import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Signal } from "lucide-react";
import NetworkChart from "../charts/NetworkChart";
import type { NetworkMetrics } from "@/types/analytics";

interface FourGFiveGStoryProps {
  isPercentageView: boolean;
}

export default function FourGFiveGStory({ isPercentageView }: FourGFiveGStoryProps) {
  const { data: networkMetrics, isLoading } = useQuery<NetworkMetrics[]>({
    queryKey: ['/api/network-metrics']
  });

  if (isLoading) {
    return <Skeleton className="h-96" />;
  }

  const july5G = networkMetrics?.find(m => m.month === 7 && m.factor === 'total_5g_data_daily');
  const july4G = networkMetrics?.find(m => m.month === 7 && m.factor === 'total_4g_data_daily');
  const june5G = networkMetrics?.find(m => m.month === 6 && m.factor === 'total_5g_data_daily');
  
  const fiveGShare = july5G && july4G ? 
    (july5G.value / (july5G.value + july4G.value) * 100) : 0;
  
  const fiveGGrowth = july5G && june5G ? 
    ((july5G.value - june5G.value) / june5G.value * 100) : 0;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              4G vs 5G Network Evolution
            </CardTitle>
            <p className="text-muted-foreground">
              Technology adoption and usage trends
            </p>
          </div>
          <div className="bg-secondary/10 p-3 rounded-lg">
            <Signal className="text-secondary text-2xl" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="large-chart-container">
            <NetworkChart 
              data={networkMetrics || []} 
              type="4g-5g"
              isPercentageView={isPercentageView} 
            />
          </div>
          <div className="space-y-6">
            <Card className="bg-secondary/5 border-secondary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">5G Growth Trajectory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">5G Share (July)</span>
                    <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full font-medium">
                      {fiveGShare.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Monthly Growth</span>
                    <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full font-medium">
                      +{fiveGGrowth.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted/20 rounded-full h-3">
                    <div 
                      className="bg-secondary h-3 rounded-full transition-all duration-1000" 
                      style={{ width: `${fiveGShare}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-primary/5 text-center p-4">
                <div className="text-xl font-bold text-primary">
                  {july4G ? (july4G.value / 1000000).toFixed(2) : '0'}
                </div>
                <div className="text-sm text-muted-foreground">4G GB/day</div>
              </Card>
              <Card className="bg-secondary/5 text-center p-4">
                <div className="text-xl font-bold text-secondary">
                  {july5G ? (july5G.value / 1000000).toFixed(2) : '0'}
                </div>
                <div className="text-sm text-muted-foreground">5G GB/day</div>
              </Card>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
