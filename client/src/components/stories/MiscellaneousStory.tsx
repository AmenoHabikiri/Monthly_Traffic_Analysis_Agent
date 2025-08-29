import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Satellite, Globe, Wifi } from "lucide-react";
import NetworkChart from "../charts/NetworkChart";
import type { NetworkMetrics } from "@/types/analytics";

interface MiscellaneousStoryProps {
  isPercentageView: boolean;
}

export default function MiscellaneousStory({ isPercentageView }: MiscellaneousStoryProps) {
  const { data: networkMetrics, isLoading } = useQuery<NetworkMetrics[]>({
    queryKey: ['/api/network-metrics']
  });

  if (isLoading) {
    return <Skeleton className="h-96" />;
  }

  const julyKDDI = networkMetrics?.find(m => m.month === 7 && m.factor === 'KDDI_Roaming');
  const juneKDDI = networkMetrics?.find(m => m.month === 6 && m.factor === 'KDDI_Roaming');
  const kddiGrowth = julyKDDI && juneKDDI ? 
    ((julyKDDI.value - juneKDDI.value) / juneKDDI.value * 100) : 0;

  const julyIR = networkMetrics?.find(m => m.month === 7 && m.factor === 'IR_Roaming');
  const juneIR = networkMetrics?.find(m => m.month === 6 && m.factor === 'IR_Roaming');
  const irGrowth = julyIR && juneIR ? 
    ((julyIR.value - juneIR.value) / juneIR.value * 100) : 0;

  const julyCPE = networkMetrics?.find(m => m.month === 7 && m.factor === 'CPE_and_others');
  const juneCPE = networkMetrics?.find(m => m.month === 6 && m.factor === 'CPE_and_others');
  const cpeGrowth = julyCPE && juneCPE ? 
    ((julyCPE.value - juneCPE.value) / juneCPE.value * 100) : 0;

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Additional Network Insights
              </CardTitle>
              <p className="text-muted-foreground">
                KDDI roaming, IR traffic, and specialized devices
              </p>
            </div>
            <div className="bg-rakuten-amber/10 p-3 rounded-lg">
              <PieChart className="text-rakuten-amber text-2xl" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Satellite className="text-primary" />
                  <h4 className="font-semibold text-foreground">KDDI Roaming</h4>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-foreground">
                    {julyKDDI ? (julyKDDI.value / 1000).toFixed(1) : '0'}
                  </div>
                  <div className="text-sm text-muted-foreground">GB daily average</div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    kddiGrowth >= 0 ? 'bg-secondary/10 text-secondary' : 'bg-destructive/10 text-destructive'
                  }`}>
                    {kddiGrowth >= 0 ? '+' : ''}{kddiGrowth.toFixed(1)}% vs June
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Globe className="text-accent" />
                  <h4 className="font-semibold text-foreground">IR Roaming</h4>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-foreground">
                    {julyIR ? julyIR.value.toFixed(2) : '0'}
                  </div>
                  <div className="text-sm text-muted-foreground">GB daily average</div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    irGrowth >= 0 ? 'bg-secondary/10 text-secondary' : 'bg-destructive/10 text-destructive'
                  }`}>
                    {irGrowth >= 0 ? '+' : ''}{irGrowth.toFixed(1)}% vs June
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Wifi className="text-secondary" />
                  <h4 className="font-semibold text-foreground">CPE & Others</h4>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-foreground">
                    {julyCPE ? julyCPE.value.toFixed(2) : '0'}
                  </div>
                  <div className="text-sm text-muted-foreground">GB daily average</div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    cpeGrowth >= 0 ? 'bg-secondary/10 text-secondary' : 'bg-destructive/10 text-destructive'
                  }`}>
                    {cpeGrowth >= 0 ? '+' : ''}{cpeGrowth.toFixed(1)}% vs June
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Specialized Device Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="large-chart-container">
            <NetworkChart 
              data={networkMetrics || []} 
              type="misc"
              isPercentageView={isPercentageView} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
