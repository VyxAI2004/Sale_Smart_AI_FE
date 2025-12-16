/**
 * Reviews Sentiment Chart - Hiển thị phân bố sentiment của reviews
 */
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ReviewsSentimentChartProps {
  data: Array<{ name: string; value: number; color?: string }>;
}

export function ReviewsSentimentChart({ data }: ReviewsSentimentChartProps) {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <PieChart>
        <Pie
          data={data}
          cx='50%'
          cy='50%'
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill='#8884d8'
          dataKey='value'
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || '#6b7280'} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
