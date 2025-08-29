import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2 } from "lucide-react";
import NetworkChart from "../charts/NetworkChart";
import type { NetworkMetrics } from "@/types/analytics";

interface B2bB2cStoryProps {
  isPercentageView: boolean;
}

export default function B2bB2cStory({ isPercentageView }: B2bB2cStoryProps) {
  const { data: networkMetrics, isLoading } = useQuery<NetworkMetrics[]>({
    queryKey: ['/api/network-metrics']
  });

  if (isLoading) {
    return <Skeleton className="h-96" />;
  }

  const julyB2C = networkMetrics?.find(m => m.month === 7 && m.factor === 'B2C');
  const julyB2B = networkMetrics?.find(m => m.month === 7 && m.factor === 'B2B');

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              B2B vs B2C Market Segments
            </CardTitle>
            <p className="text-muted-foreground">
              Business and consumer usage comparison
            </p>
          </div>
          <div className="bg-destructive/10 p-3 rounded-lg">
            <Building2 className="text-destructive text-2xl" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="large-chart-container">
            <NetworkChart 
              data={networkMetrics || []} 
              type="b2b-b2c"
              isPercentageView={isPercentageView} 
            />
          </div>
          <div className="space-y-6">
            <Card className="bg-destructive/5 border-destructive/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Segment Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">B2C Market</span>
                      <span className="text-sm font-bold">
                        {julyB2C ? julyB2C.value.toFixed(2) : '0'} GB/day
                      </span>
                    </div>
                    <div className="w-full bg-muted/20 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">B2B Market</span>
                      <span className="text-sm font-bold">
                        {julyB2B ? julyB2B.value.toFixed(2) : '0'} GB/day
                      </span>
                    </div>
                    <div className="w-full bg-muted/20 rounded-full h-2">
                      <div className="bg-destructive h-2 rounded-full" style={{ width: '50%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-accent/5 border-accent/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Key Insight</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Consumer segment drives 2x more data usage than business segment, 
                  indicating higher video and entertainment consumption in personal use cases.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
