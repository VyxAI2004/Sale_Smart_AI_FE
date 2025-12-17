/**
 * Trust Score Distribution Chart - Hiển thị phân bố trust scores
 */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface TrustScoreChartProps {
  data: Array<{ range: string; count: number; color?: string }>
}

export function TrustScoreChart({ data }: TrustScoreChartProps) {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='range' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey='count' radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || '#10b981'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
