/**
 * Dashboard Types - Định nghĩa các types cho dashboard data
 */

export interface DashboardStats {
  projects: {
    total: number;
    active: number;
    completed: number;
    pending: number;
    byStatus: Record<string, number>;
  };
  products: {
    total: number;
    analyzed: number;
    withReviews: number;
    averageTrustScore: number;
    byPlatform: Record<string, number>;
  };
  tasks: {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
    overdue: number;
    byStatus: Record<string, number>;
  };
  reviews: {
    total: number;
    analyzed: number;
    positive: number;
    negative: number;
    neutral: number;
    spam: number;
    averageRating: number;
  };
  trustScores: {
    average: number;
    high: number; // >= 0.7
    medium: number; // 0.4 - 0.69
    low: number; // < 0.4
    distribution: Array<{ range: string; count: number }>;
  };
}

export interface DashboardTimeSeries {
  date: string;
  projects: number;
  products: number;
  tasks: number;
  reviews: number;
  trustScore: number;
}

export interface DashboardChartData {
  projectsByStatus: Array<{ name: string; value: number; color?: string }>;
  tasksByStatus: Array<{ name: string; value: number; color?: string }>;
  reviewsBySentiment: Array<{ name: string; value: number; color?: string }>;
  productsByPlatform: Array<{ name: string; value: number; color?: string }>;
  trustScoreDistribution: Array<{ range: string; count: number; color?: string }>;
  timeSeries: DashboardTimeSeries[];
  recentActivity: Array<{
    id: string;
    type: 'project' | 'product' | 'task' | 'review';
    title: string;
    description: string;
    timestamp: string;
    status?: string;
  }>;
}

export interface DashboardResponse {
  stats: DashboardStats;
  charts: DashboardChartData;
  lastUpdated: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  status: string;
  productCount: number;
  taskCount: number;
  completedTasks: number;
  trustScore: number;
  lastUpdated: string;
}

export interface ProductSummary {
  id: string;
  name: string;
  platform: string;
  price: number;
  trustScore: number;
  reviewCount: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  lastAnalyzed: string;
}

export interface TaskSummary {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  status: string;
  priority: string;
  dueDate: string | null;
  assignedTo: string | null;
  createdAt: string;
}

export interface RecentActivity {
  id: string;
  type: 'project_created' | 'product_added' | 'task_completed' | 'review_analyzed' | 'trust_score_updated';
  title: string;
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
  relatedId: string;
}
