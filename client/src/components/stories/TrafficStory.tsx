import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, CheckCircle, Lightbulb } from "lucide-react";
import TrafficChart from "../charts/TrafficChart";
import type { TrafficMetrics } from "@/types/analytics";

interface TrafficStoryProps {
  isPercentageView: boolean;
}

export default function TrafficStory({ isPercentageView }: TrafficStoryProps) {
  const { data: trafficData, isLoading } = useQuery<TrafficMetrics[]>({
    queryKey: ['/api/traffic']
  });

  if (isLoading) {
    return <Skeleton className="h-96" />;
  }

  const julyTraffic = trafficData?.find(t => t.month === 7);
  const juneTraffic = trafficData?.find(t => t.month === 6);
  
  const growthRate = julyTraffic && juneTraffic ? 
    ((julyTraffic.totalTraffic - juneTraffic.totalTraffic) / juneTraffic.totalTraffic * 100) : 0;

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
                        Normalized daily traffic grew <strong>6.35%</strong> indicating genuine growth
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="text-rakuten-yellow mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>
                        July shows strongest growth momentum in the analyzed period
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="text-center p-4">
                  <div className="text-2xl font-bold text-foreground">
                    {julyTraffic ? (julyTraffic.totalTraffic / 1000000).toFixed(1) : '0'}
                  </div>
                  <div className="text-sm text-muted-foreground">Total GB (July)</div>
                </Card>
                <Card className="text-center p-4">
                  <div className="text-2xl font-bold text-secondary">
                    +{growthRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Growth Rate</div>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            UL vs DL Traffic Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="large-chart-container">
            <TrafficChart 
              data={trafficData || []} 
              type="normalized" 
              isPercentageView={isPercentageView} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
