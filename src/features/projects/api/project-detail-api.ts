/**
 * Project Detail API Client - handles project dashboard data
 */
import http from '@/utils/http'
import type { ProjectDetailData } from '../types/project-detail.types'

export class ProjectDetailApi {
  private static readonly BASE_PATH = '/projects'

  /**
   * Get comprehensive project detail data for dashboard
   */
  static async getProjectDetail(projectId: string): Promise<ProjectDetailData> {
    const response = await http.get<ProjectDetailData>(`${this.BASE_PATH}/${projectId}`)
    return response.data
  }

  /**
   * Get project analytics only
   */
  static async getProjectAnalytics(projectId: string) {
    const response = await http.get(`${this.BASE_PATH}/${projectId}/analytics`)
    return response.data
  }

  /**
   * Get project product sources
   */
  static async getProductSources(projectId: string) {
    const response = await http.get(`${this.BASE_PATH}/${projectId}/sources`)
    return response.data
  }

  /**
   * Get competitor products
   */
  static async getCompetitorProducts(projectId: string, params?: {
    limit?: number
    offset?: number
    similarity_threshold?: number
  }) {
    const response = await http.get(`${this.BASE_PATH}/${projectId}/competitors`, { params })
    return response.data
  }

  /**
   * Get price analysis
   */
  static async getPriceAnalysis(projectId: string) {
    const response = await http.get(`${this.BASE_PATH}/${projectId}/price-analysis`)
    return response.data
  }

  /**
   * Get project tasks
   */
  static async getProjectTasks(projectId: string) {
    const response = await http.get(`${this.BASE_PATH}/${projectId}/tasks`)
    return response.data
  }

  /**
   * Get recent activities
   */
  static async getRecentActivities(projectId: string, limit = 10) {
    const response = await http.get(`${this.BASE_PATH}/${projectId}/activities`, {
      params: { limit }
    })
    return response.data
  }

  /**
   * Trigger manual crawl for project
   */
  static async triggerCrawl(projectId: string) {
    const response = await http.post(`${this.BASE_PATH}/${projectId}/crawl/trigger`)
    return response.data
  }

  /**
   * Update crawl schedule
   */
  static async updateCrawlSchedule(projectId: string, schedule: {
    crawl_schedule: string
    next_crawl_at?: string
  }) {
    const response = await http.put(`${this.BASE_PATH}/${projectId}/crawl/schedule`, schedule)
    return response.data
  }
}