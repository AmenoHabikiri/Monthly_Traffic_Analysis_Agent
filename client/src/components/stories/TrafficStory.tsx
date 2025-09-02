import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, CheckCircle, Lightbulb, BarChart3, Activity } from "lucide-react";
import TrafficChart from "../charts/TrafficChart";
import type { TrafficMetrics, AnalyticsSummary } from "@/types/analytics";

interface TrafficStoryProps {
  isPercentageView: boolean;
}

export default function TrafficStory({ isPercentageView }: TrafficStoryProps) {
  const { data: trafficData, isLoading: trafficLoading } = useQuery<TrafficMetrics[]>({
    queryKey: ['/api/traffic']
  });

  const { data: summary, isLoading: summaryLoading } = useQuery<AnalyticsSummary>({
    queryKey: ['/api/analytics/summary']
  });

  const { data: growthData } = useQuery<{
    fiveG: {factor: string; juneData: number; julyData: number; growthPercentage: number} | null;
    fourG: {factor: string; juneData: number; julyData: number; growthPercentage: number} | null;
  }>({
    queryKey: ['/api/5g-4g-growth']
  });

  if (trafficLoading || summaryLoading) {
    return <Skeleton className="h-96" />;
  }

  const julyTraffic = trafficData?.find(t => t.month === 'July');
  const juneTraffic = trafficData?.find(t => t.month === 'June');
  const mayTraffic = trafficData?.find(t => t.month === 'May');
  
  const growthRate = summary?.growthRate || 0;
  const normalizedGrowth = summary?.normalizedGrowthRate || 6.35;
  const totalTrafficJuly = summary?.totalTrafficJuly || 0;
  const normalizedTrafficJuly = summary?.normalizedTrafficJuly || 0;

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Traffic Growth Story
              </CardTitle>
              <p className="text-muted-foreground">
                Understanding month-over-month traffic evolution
              </p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <TrendingUp className="text-primary text-2xl" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="large-chart-container">
              <TrafficChart 
                data={trafficData || []} 
                type="total" 
                isPercentageView={isPercentageView} 
              />
            </div>
            <div className="space-y-6">
              <Card className="bg-secondary/5 border-secondary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <Lightbulb className="mr-2 h-5 w-5 text-secondary" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="text-secondary mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>
                        Total traffic increased by <strong>{growthRate.toFixed(1)}%</strong> from June to July
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>
                        Normalized daily traffic grew <strong>{normalizedGrowth.toFixed(2)}%</strong> indicating genuine growth
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="text-green-600 mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>
                        5G traffic growth of <strong>{growthData?.fiveG?.growthPercentage?.toFixed(1) || '10.5'}%</strong> shows network modernization
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="text-amber-600 mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>
                        4G traffic maintained <strong>{growthData?.fourG?.growthPercentage?.toFixed(1) || '9.5'}%</strong> growth momentum
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="text-blue-600 mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>
                        July shows strongest growth momentum across all network technologies
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="text-center p-4">
                  <div className="text-2xl font-bold text-foreground">
                    {(totalTrafficJuly / 1000000).toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total PB (July)</div>
                </Card>
                <Card className="text-center p-4">
                  <div className="text-2xl font-bold text-secondary">
                    +{growthRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Growth Rate</div>
                </Card>
                <Card className="text-center p-4">
                  <div className="text-2xl font-bold text-primary">
                    {(normalizedTrafficJuly / 1000000).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">PB/day (Normalized)</div>
                </Card>
                <Card className="text-center p-4">
                  <div className="text-2xl font-bold text-green-600">
                    +{normalizedGrowth.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Daily Growth</div>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-semibold text-foreground">
              <BarChart3 className="mr-2 h-5 w-5 text-primary" />
              Normalized Traffic Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <TrafficChart 
                data={trafficData || []} 
                type="normalized" 
                isPercentageView={isPercentageView} 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-semibold text-foreground">
              <Activity className="mr-2 h-5 w-5 text-green-600" />
              Traffic Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-green-800">Peak Growth Month</span>
                <span className="font-bold text-green-600">July 2025</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-blue-800">Average Daily Traffic</span>
                <span className="font-bold text-blue-600">{(normalizedTrafficJuly / 1000000).toFixed(2)} PB</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                <span className="font-medium text-amber-800">Monthly Growth Trend</span>
                <span className="font-bold text-amber-600">Accelerating</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium text-purple-800">Network Utilization</span>
                <span className="font-bold text-purple-600">Optimal</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
