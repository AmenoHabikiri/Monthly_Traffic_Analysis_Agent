import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  subtitle: string;
  value: string;
  unit: string;
  trend: string;
  trendDirection: 'up' | 'down';
  icon: React.ReactNode;
  children?: React.ReactNode;
  'data-testid'?: string;
}

export default function MetricCard({ 
  title, 
  subtitle, 
  value, 
  unit, 
  trend, 
  trendDirection,
  icon,
  children,
  'data-testid': testId
}: MetricCardProps) {
  const TrendIcon = trendDirection === 'up' ? TrendingUp : TrendingDown;
  const trendColor = trendDirection === 'up' ? 'text-secondary' : 'text-destructive';

  return (
    <Card className="metric-card shadow-lg" data-testid={testId}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <div className="bg-secondary/10 p-3 rounded-lg">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-foreground" data-testid="metric-value">
            {value}
          </span>
          <span className="text-lg text-muted-foreground">{unit}</span>
          <span className={`bg-secondary/10 px-2 py-1 rounded-full text-sm font-medium flex items-center ${trendColor}`}>
            <TrendIcon className="mr-1 h-3 w-3" />
            {trend}
          </span>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
