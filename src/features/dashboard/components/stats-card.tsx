/**
 * Stats Card Component - Hiển thị một metric với icon và trend
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        {description && (
          <p className='text-muted-foreground text-xs mt-1'>{description}</p>
        )}
        {trend && (
          <p
            className={cn(
              'text-xs mt-1',
              trend.isPositive !== false
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            )}
          >
            {trend.isPositive !== false ? '↑' : '↓'} {trend.value}% {trend.label}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
