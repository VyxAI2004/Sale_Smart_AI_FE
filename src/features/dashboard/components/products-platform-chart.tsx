/**
 * Products Platform Chart - Hiển thị phân bố products theo platform
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

interface ProductsPlatformChartProps {
  data: Array<{ name: string; value: number; color?: string }>
}

export function ProductsPlatformChart({ data }: ProductsPlatformChartProps) {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='name' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey='value' radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || '#0f766e'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
