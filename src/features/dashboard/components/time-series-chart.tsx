/**
 * Time Series Chart - Hiển thị xu hướng theo thời gian
 */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface TimeSeriesChartProps {
  data: Array<{
    date: string
    projects: number
    products: number
    tasks: number
    reviews: number
    trustScore: number
  }>
}

export function TimeSeriesChart({ data }: TimeSeriesChartProps) {
  // Format date for display
  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('vi-VN', {
      month: 'short',
      day: 'numeric',
    }),
    trustScore: Number((item.trustScore * 100).toFixed(1)),
  }))

  return (
    <ResponsiveContainer width='100%' height={350}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='date' />
        <YAxis yAxisId='left' />
        <YAxis yAxisId='right' orientation='right' />
        <Tooltip />
        <Legend />
        <Line
          yAxisId='left'
          type='monotone'
          dataKey='projects'
          stroke='#3b82f6'
          strokeWidth={2}
          name='Projects'
        />
        <Line
          yAxisId='left'
          type='monotone'
          dataKey='products'
          stroke='#10b981'
          strokeWidth={2}
          name='Products'
        />
        <Line
          yAxisId='left'
          type='monotone'
          dataKey='tasks'
          stroke='#f59e0b'
          strokeWidth={2}
          name='Tasks'
        />
        <Line
          yAxisId='left'
          type='monotone'
          dataKey='reviews'
          stroke='#8b5cf6'
          strokeWidth={2}
          name='Reviews'
        />
        <Line
          yAxisId='right'
          type='monotone'
          dataKey='trustScore'
          stroke='#ef4444'
          strokeWidth={2}
          name='Trust Score %'
          strokeDasharray='5 5'
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
