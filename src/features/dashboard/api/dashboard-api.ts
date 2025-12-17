/**
 * Dashboard API Client - handles dashboard data fetching
 */
import http from '@/utils/http'
import type {
  DashboardResponse,
  ProjectSummary,
  ProductSummary,
  TaskSummary,
} from '../types/dashboard.types'

export class DashboardApi {
  private static ensureArray<T = any>(value: unknown): T[] {
    return Array.isArray(value) ? value : []
  }

  private static ensureObject(value: unknown): Record<string, any> {
    return value && typeof value === 'object'
      ? (value as Record<string, any>)
      : {}
  }

  /**
   * Get comprehensive dashboard data
   */
  static async getDashboardData(): Promise<DashboardResponse> {
    try {
      const projectsResponse = await http.get<{ items?: any[] }>('/projects/my', {
        params: { limit: 100 },
      })
      const projectList = DashboardApi.ensureArray(projectsResponse.data?.items)

      const [dashboardStatsResponse, projectSummaries, products, tasks] =
        await Promise.all([
          http
            .get<{
              total_reviews?: number
              active_projects?: number
              average_trust_score?: number
            }>('/dashboard/statistics')
            .catch(() => ({ data: null })),
          this.getProjectsSummary(projectList),
          this.getProductsSummary(projectList),
          this.getTasksSummary(),
        ])

      const reviews = await this.getReviewsSummary(projectList)

      const dashboardStats =
        dashboardStatsResponse && typeof dashboardStatsResponse.data === 'object'
          ? (dashboardStatsResponse.data as {
              total_reviews?: number
              active_projects?: number
              average_trust_score?: number
            })
          : null

      const stats = this.calculateStats(
        projectSummaries,
        products,
        tasks,
        reviews,
        dashboardStats
      )

      const charts = this.generateChartData(
        projectSummaries,
        products,
        tasks,
        reviews
      )

      return {
        stats,
        charts,
        lastUpdated: new Date().toISOString(),
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      throw error
    }
  }

  /**
   * Get projects summary
   */
  static async getProjectsSummary(projects?: any[]): Promise<ProjectSummary[]> {
    try {
      let projectList = DashboardApi.ensureArray(projects)

      if (projectList.length === 0) {
        const response = await http.get<{ items?: any[] }>('/projects/my', {
          params: { limit: 100 },
        })
        projectList = DashboardApi.ensureArray(response.data?.items)
      }

      // For each project, get additional stats
      const projectsWithStats = await Promise.all(
        projectList.map(async (project: any) => {
          try {
            // Get products count for this project
            const productsResponse = await http.get<{
              items?: any[]
              total?: number
            }>(
              `/products/project/${project.id}`,
              {
                params: { limit: 100 },
              }
            )

            // Get tasks count for this project
            const tasksResponse = await http.get<any[]>('/tasks', {
              params: { project_id: project.id, limit: 1000 },
            })

            const tasks = DashboardApi.ensureArray(tasksResponse.data)
            const completedTasks = tasks.filter(
              (t: any) => t.status === 'completed'
            ).length

            // Calculate average trust score from products
            const products = DashboardApi.ensureArray(
              productsResponse.data?.items
            )
            const trustScores = products
              .map((p: any) => p.trust_score?.score)
              .filter((score: any) => score != null)
            const avgTrustScore =
              trustScores.length > 0
                ? trustScores.reduce((a: number, b: number) => a + b, 0) /
                  trustScores.length
                : 0

            return {
              id: project.id,
              name: project.name,
              status: project.status || 'pending',
              productCount:
                productsResponse.data?.total ?? products.length ?? 0,
              taskCount: tasks.length,
              completedTasks,
              trustScore: avgTrustScore,
              lastUpdated: project.updated_at || project.created_at,
            }
          } catch (err) {
            console.error(
              `Error fetching stats for project ${project.id}:`,
              err
            )
            return {
              id: project.id,
              name: project.name,
              status: project.status || 'pending',
              productCount: 0,
              taskCount: 0,
              completedTasks: 0,
              trustScore: 0,
              lastUpdated: project.updated_at || project.created_at,
            }
          }
        })
      )

      return projectsWithStats
    } catch (error) {
      console.error('Error fetching projects summary:', error)
      return []
    }
  }

  /**
   * Get products summary
   */
  static async getProductsSummary(projects?: any[]): Promise<ProductSummary[]> {
    try {
      // If projects not provided, fetch them
      let projectList = DashboardApi.ensureArray(projects)
      if (projectList.length === 0) {
        const projectsResponse = await http.get<{ items?: any[] }>(
          '/projects/my',
          {
            params: { limit: 100 },
          }
        )
        projectList = DashboardApi.ensureArray(projectsResponse.data?.items)
      }

      // Get products from each project
      const allProducts: any[] = []

      await Promise.all(
        projectList.map(async (project: any) => {
          try {
            const productsResponse = await http.get<{ items?: any[] }>(
              `/products/project/${project.id}`,
              {
                params: { limit: 100 },
              }
            )

            const products = DashboardApi.ensureArray(
              productsResponse.data?.items
            )
            allProducts.push(...products)
          } catch (err) {
            console.error(
              `Error fetching products for project ${project.id}:`,
              err
            )
          }
        })
      )

      return allProducts.map((product: any) => ({
        id: product.id,
        name: product.name || product.title || 'Unknown Product',
        platform: product.platform || 'unknown',
        price: product.price || 0,
        trustScore: product.trust_score?.score || 0,
        reviewCount: product.review_count || 0,
        sentiment: this.getSentimentFromTrustScore(
          product.trust_score?.score || 0
        ),
        lastAnalyzed: product.updated_at || product.created_at,
      }))
    } catch (error) {
      console.error('Error fetching products summary:', error)
      return []
    }
  }

  /**
   * Get tasks summary
   */
  static async getTasksSummary(): Promise<TaskSummary[]> {
    try {
      const response = await http.get<any[]>('/tasks', {
        params: { limit: 1000 },
      })

      const tasks = DashboardApi.ensureArray(response.data)

      // Get project names for tasks
      const projectIds: string[] = Array.from(
        new Set(
          tasks
            .map((t: any) => t.project_id)
            .filter((id: unknown): id is string => typeof id === 'string')
        )
      )
      const projectMap = new Map<string, string>()

      await Promise.all(
        projectIds.map(async (projectId: string) => {
          try {
            const projectResponse = await http.get<{ name?: string }>(
              `/projects/${projectId}`
            )
            const projectData = DashboardApi.ensureObject(
              projectResponse.data
            )
            projectMap.set(
              projectId,
              String(projectData.name ?? 'Unknown Project')
            )
          } catch (err) {
            projectMap.set(projectId, 'Unknown Project')
          }
        })
      )

      return tasks.map((task: any) => ({
        id: task.id,
        title: task.title || task.name || 'Untitled Task',
        projectId: task.project_id || '',
        projectName: projectMap.get(task.project_id) || 'Unknown Project',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        dueDate: task.due_date || null,
        assignedTo: task.assigned_to || null,
        createdAt: task.created_at,
      }))
    } catch (error) {
      console.error('Error fetching tasks summary:', error)
      return []
    }
  }

  /**
   * Get reviews summary
   */
  static async getReviewsSummary(projects?: any[]): Promise<any> {
    try {
      // If projects not provided, fetch them
      let projectList = DashboardApi.ensureArray(projects)
      if (projectList.length === 0) {
        const projectsResponse = await http.get<{ items?: any[] }>(
          '/projects/my',
          {
            params: { limit: 100 },
          }
        )
        projectList = DashboardApi.ensureArray(projectsResponse.data?.items)
      }

      // Get all products from all projects
      const allProducts: any[] = []

      await Promise.all(
        projectList.map(async (project: any) => {
          try {
            const productsResponse = await http.get<{ items?: any[] }>(
              `/products/project/${project.id}`,
              {
                params: { limit: 100 },
              }
            )
            const products = DashboardApi.ensureArray(
              productsResponse.data?.items
            )
            allProducts.push(...products)
          } catch (err) {
            console.error(
              `Error fetching products for project ${project.id}:`,
              err
            )
          }
        })
      )

      // Get review statistics for each product (limit to first 50 to avoid too many requests)
      const productsToAnalyze = DashboardApi.ensureArray(allProducts).slice(
        0,
        50
      )
      const reviewStats = await Promise.all(
        productsToAnalyze.map(async (product: any) => {
          try {
            const statsResponse =
              await http.get<Record<string, unknown>>(
              `/products/${product.id}/reviews/statistics`
            )
            const statsData = DashboardApi.ensureObject(statsResponse.data)
            return {
              productId: product.id,
              ...statsData,
            }
          } catch (err) {
            return {
              productId: product.id,
              reviews: { total: 0, verified_count: 0, rating_distribution: {} },
              analysis: {
                total_analyzed: 0,
                sentiment_counts: {},
                spam_count: 0,
              },
            }
          }
        })
      )

      return reviewStats
    } catch (error) {
      console.error('Error fetching reviews summary:', error)
      return []
    }
  }

  /**
   * Calculate dashboard stats from summaries
   */
  private static calculateStats(
    projects: ProjectSummary[],
    products: ProductSummary[],
    tasks: TaskSummary[],
    reviews: any[],
    dashboardStats?: {
      total_reviews?: number
      active_projects?: number
      average_trust_score?: number
    } | null
  ) {
    // Projects stats
    const projectsByStatus = projects.reduce(
      (acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    // Products stats
    const productsByPlatform = products.reduce(
      (acc, p) => {
        acc[p.platform] = (acc[p.platform] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const trustScores = products.map((p) => p.trustScore).filter((s) => s > 0)
    // Use API data if available, otherwise calculate from products
    const avgTrustScore =
      dashboardStats?.average_trust_score !== undefined
        ? dashboardStats.average_trust_score
        : trustScores.length > 0
          ? trustScores.reduce((a, b) => a + b, 0) / trustScores.length
          : 0

    // Tasks stats
    const tasksByStatus = tasks.reduce(
      (acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    // Reviews stats - Use API data if available for total reviews
    const totalReviews =
      dashboardStats?.total_reviews !== undefined
        ? dashboardStats.total_reviews
        : reviews.reduce((sum, r) => sum + (r.reviews?.total || 0), 0)

    const analyzedReviews = reviews.reduce(
      (sum, r) => sum + (r.analysis?.total_analyzed || 0),
      0
    )
    const positiveReviews = reviews.reduce(
      (sum, r) => sum + (r.analysis?.sentiment_counts?.positive || 0),
      0
    )
    const negativeReviews = reviews.reduce(
      (sum, r) => sum + (r.analysis?.sentiment_counts?.negative || 0),
      0
    )
    const neutralReviews = reviews.reduce(
      (sum, r) => sum + (r.analysis?.sentiment_counts?.neutral || 0),
      0
    )
    const spamReviews = reviews.reduce(
      (sum, r) => sum + (r.analysis?.spam_count || 0),
      0
    )

    const allRatings = reviews.flatMap((r) => {
      const dist = r.reviews?.rating_distribution || {}
      return Object.entries(dist).flatMap(([rating, count]) =>
        Array(count as number).fill(parseInt(rating))
      )
    })
    const avgRating =
      allRatings.length > 0
        ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length
        : 0

    return {
      projects: {
        total: projects.length,
        // Use API data if available for active projects
        active:
          dashboardStats?.active_projects !== undefined
            ? dashboardStats.active_projects
            : projectsByStatus['active'] || 0,
        completed: projectsByStatus['completed'] || 0,
        pending: projectsByStatus['pending'] || 0,
        byStatus: projectsByStatus,
      },
      products: {
        total: products.length,
        analyzed: products.filter((p) => p.trustScore > 0).length,
        withReviews: products.filter((p) => p.reviewCount > 0).length,
        averageTrustScore: avgTrustScore,
        byPlatform: productsByPlatform,
      },
      tasks: {
        total: tasks.length,
        completed: tasksByStatus['completed'] || 0,
        pending: tasksByStatus['pending'] || 0,
        inProgress: tasksByStatus['in_progress'] || 0,
        overdue: tasks.filter(
          (t) =>
            t.dueDate &&
            new Date(t.dueDate) < new Date() &&
            t.status !== 'completed'
        ).length,
        byStatus: tasksByStatus,
      },
      reviews: {
        total: totalReviews,
        analyzed: analyzedReviews,
        positive: positiveReviews,
        negative: negativeReviews,
        neutral: neutralReviews,
        spam: spamReviews,
        averageRating: avgRating,
      },
      trustScores: {
        average: avgTrustScore,
        high: trustScores.filter((s) => s >= 0.7).length,
        medium: trustScores.filter((s) => s >= 0.4 && s < 0.7).length,
        low: trustScores.filter((s) => s < 0.4).length,
        distribution: [
          {
            range: '0.0-0.3',
            count: trustScores.filter((s) => s >= 0 && s < 0.3).length,
          },
          {
            range: '0.3-0.5',
            count: trustScores.filter((s) => s >= 0.3 && s < 0.5).length,
          },
          {
            range: '0.5-0.7',
            count: trustScores.filter((s) => s >= 0.5 && s < 0.7).length,
          },
          {
            range: '0.7-0.9',
            count: trustScores.filter((s) => s >= 0.7 && s < 0.9).length,
          },
          {
            range: '0.9-1.0',
            count: trustScores.filter((s) => s >= 0.9 && s <= 1.0).length,
          },
        ],
      },
    }
  }

  /**
   * Generate chart data from summaries
   */
  private static generateChartData(
    projects: ProjectSummary[],
    products: ProductSummary[],
    tasks: TaskSummary[],
    reviews: any[]
  ) {
    // Projects by status
    const projectsByStatus = Object.entries(
      projects.reduce(
        (acc, p) => {
          acc[p.status] = (acc[p.status] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )
    ).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: this.getStatusColor(name),
    }))

    // Tasks by status
    const tasksByStatus = Object.entries(
      tasks.reduce(
        (acc, t) => {
          acc[t.status] = (acc[t.status] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )
    ).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' '),
      value,
      color: this.getTaskStatusColor(name),
    }))

    // Reviews by sentiment
    const sentimentCounts = reviews.reduce(
      (acc, r) => {
        const counts = r.analysis?.sentiment_counts || {}
        acc.positive = (acc.positive || 0) + (counts.positive || 0)
        acc.negative = (acc.negative || 0) + (counts.negative || 0)
        acc.neutral = (acc.neutral || 0) + (counts.neutral || 0)
        return acc
      },
      {} as Record<string, number>
    )

    const reviewsBySentiment = [
      {
        name: 'Positive',
        value: sentimentCounts.positive || 0,
        color: '#10b981',
      },
      {
        name: 'Negative',
        value: sentimentCounts.negative || 0,
        color: '#ef4444',
      },
      {
        name: 'Neutral',
        value: sentimentCounts.neutral || 0,
        color: '#6b7280',
      },
    ]

    // Products by platform
    const productsByPlatform = Object.entries(
      products.reduce(
        (acc, p) => {
          acc[p.platform] = (acc[p.platform] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )
    ).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: this.getPlatformColor(name),
    }))

    // Trust score distribution
    const trustScores = products.map((p) => p.trustScore).filter((s) => s > 0)
    const distribution = [
      {
        range: '0.0-0.3',
        count: trustScores.filter((s) => s >= 0 && s < 0.3).length,
        color: '#ef4444',
      },
      {
        range: '0.3-0.5',
        count: trustScores.filter((s) => s >= 0.3 && s < 0.5).length,
        color: '#f59e0b',
      },
      {
        range: '0.5-0.7',
        count: trustScores.filter((s) => s >= 0.5 && s < 0.7).length,
        color: '#eab308',
      },
      {
        range: '0.7-0.9',
        count: trustScores.filter((s) => s >= 0.7 && s < 0.9).length,
        color: '#84cc16',
      },
      {
        range: '0.9-1.0',
        count: trustScores.filter((s) => s >= 0.9 && s <= 1.0).length,
        color: '#10b981',
      },
    ]

    // Time series (last 7 days)
    const timeSeries = this.generateTimeSeries(
      projects,
      products,
      tasks,
      reviews
    )

    // Recent activity
    const recentActivity = this.generateRecentActivity(
      projects,
      products,
      tasks
    )

    return {
      projectsByStatus,
      tasksByStatus,
      reviewsBySentiment,
      productsByPlatform,
      trustScoreDistribution: distribution,
      timeSeries,
      recentActivity,
    }
  }

  /**
   * Helper function to safely parse date
   */
  private static safeParseDate(
    dateValue: string | null | undefined
  ): Date | null {
    if (!dateValue) return null
    try {
      const date = new Date(dateValue)
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return null
      }
      return date
    } catch (e) {
      return null
    }
  }

  /**
   * Helper function to safely format date to ISO string
   */
  private static safeFormatDate(
    dateValue: string | null | undefined
  ): string | null {
    const date = this.safeParseDate(dateValue)
    if (!date) return null
    try {
      return date.toISOString().split('T')[0]
    } catch (e) {
      return null
    }
  }

  /**
   * Generate time series data
   */
  private static generateTimeSeries(
    projects: ProjectSummary[],
    products: ProductSummary[],
    tasks: TaskSummary[],
    reviews: any[]
  ) {
    const days = 7
    const today = new Date()
    const series: any[] = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      const projectsOnDate = projects.filter((p) => {
        const created = this.safeFormatDate(p.lastUpdated)
        return created && created <= dateStr
      }).length

      const productsOnDate = products.filter((p) => {
        const created = this.safeFormatDate(p.lastAnalyzed)
        return created && created <= dateStr
      }).length

      const tasksOnDate = tasks.filter((t) => {
        const created = this.safeFormatDate(t.createdAt)
        return created && created <= dateStr
      }).length

      const reviewsOnDate = reviews.reduce((sum, r) => {
        // Approximate based on product creation
        return sum + (r.reviews?.total || 0) / days
      }, 0)

      const trustScoresOnDate = products
        .filter((p) => {
          const created = this.safeFormatDate(p.lastAnalyzed)
          return created && created <= dateStr && p.trustScore > 0
        })
        .map((p) => p.trustScore)
      const avgTrustScore =
        trustScoresOnDate.length > 0
          ? trustScoresOnDate.reduce((a, b) => a + b, 0) /
            trustScoresOnDate.length
          : 0

      series.push({
        date: dateStr,
        projects: projectsOnDate,
        products: productsOnDate,
        tasks: tasksOnDate,
        reviews: Math.round(reviewsOnDate),
        trustScore: avgTrustScore,
      })
    }

    return series
  }

  /**
   * Generate recent activity
   */
  private static generateRecentActivity(
    projects: ProjectSummary[],
    products: ProductSummary[],
    tasks: TaskSummary[]
  ) {
    const activities: any[] = []

    // Helper function to safely get timestamp for sorting
    const getTimestamp = (dateValue: string | null | undefined): number => {
      const date = this.safeParseDate(dateValue)
      return date ? date.getTime() : 0
    }

    // Recent projects - filter out items with invalid dates
    projects
      .filter((p) => p.lastUpdated)
      .sort((a, b) => getTimestamp(b.lastUpdated) - getTimestamp(a.lastUpdated))
      .slice(0, 5)
      .forEach((p) => {
        activities.push({
          id: `project-${p.id}`,
          type: 'project' as const,
          title: `Project: ${p.name}`,
          description: `Status: ${p.status}, Products: ${p.productCount}, Tasks: ${p.taskCount}`,
          timestamp: p.lastUpdated,
          status: p.status,
        })
      })

    // Recent products - filter out items with invalid dates
    products
      .filter((p) => p.lastAnalyzed)
      .sort(
        (a, b) => getTimestamp(b.lastAnalyzed) - getTimestamp(a.lastAnalyzed)
      )
      .slice(0, 5)
      .forEach((p) => {
        activities.push({
          id: `product-${p.id}`,
          type: 'product' as const,
          title: `Product: ${p.name}`,
          description: `Platform: ${p.platform}, Trust Score: ${(p.trustScore * 100).toFixed(1)}%, Reviews: ${p.reviewCount}`,
          timestamp: p.lastAnalyzed,
          status: p.sentiment,
        })
      })

    // Recent tasks - filter out items with invalid dates
    tasks
      .filter((t) => t.createdAt)
      .sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt))
      .slice(0, 5)
      .forEach((t) => {
        activities.push({
          id: `task-${t.id}`,
          type: 'task' as const,
          title: `Task: ${t.title}`,
          description: `Project: ${t.projectName}, Status: ${t.status}, Priority: ${t.priority}`,
          timestamp: t.createdAt,
          status: t.status,
        })
      })

    return activities
      .filter((a) => a.timestamp) // Filter out activities with invalid timestamps
      .sort((a, b) => getTimestamp(b.timestamp) - getTimestamp(a.timestamp))
      .slice(0, 10)
  }

  /**
   * Helper methods
   */
  private static getSentimentFromTrustScore(
    score: number
  ): 'positive' | 'negative' | 'neutral' {
    if (score >= 0.7) return 'positive'
    if (score < 0.4) return 'negative'
    return 'neutral'
  }

  private static getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      active: '#10b981',
      completed: '#3b82f6',
      pending: '#f59e0b',
      cancelled: '#ef4444',
    }
    return colors[status.toLowerCase()] || '#6b7280'
  }

  private static getTaskStatusColor(status: string): string {
    const colors: Record<string, string> = {
      completed: '#10b981',
      in_progress: '#3b82f6',
      pending: '#f59e0b',
      cancelled: '#ef4444',
    }
    return colors[status.toLowerCase()] || '#6b7280'
  }

  private static getPlatformColor(platform: string): string {
    const colors: Record<string, string> = {
      lazada: '#0f766e',
      shopee: '#ee4d2d',
      tiki: '#189eff',
      amazon: '#ff9900',
    }
    return colors[platform.toLowerCase()] || '#6b7280'
  }
}
