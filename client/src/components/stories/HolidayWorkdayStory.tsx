import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";
import NetworkChart from "../charts/NetworkChart";
import type { NetworkMetrics } from "@/types/analytics";

interface HolidayWorkdayStoryProps {
  isPercentageView: boolean;
}

export default function HolidayWorkdayStory({ isPercentageView }: HolidayWorkdayStoryProps) {
  const { data: networkMetrics, isLoading } = useQuery<NetworkMetrics[]>({
    queryKey: ['/api/network-metrics']
  });

  if (isLoading) {
    return <Skeleton className="h-96" />;
  }

  const julyHoliday = networkMetrics?.find(m => m.month === 7 && m.factor === 'Holiday');
  const julyWorking = networkMetrics?.find(m => m.month === 7 && m.factor === 'Working Day');
  
  const holidayIncrease = julyHoliday && julyWorking ? 
    ((julyHoliday.value - julyWorking.value) / julyWorking.value * 100) : 0;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Holiday vs Workday Usage
            </CardTitle>
            <p className="text-muted-foreground">
              Behavioral patterns across different day types
            </p>
          </div>
          <div className="bg-rakuten-amber/10 p-3 rounded-lg">
            <Calendar className="text-rakuten-amber text-2xl" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="large-chart-container">
            <NetworkChart 
              data={networkMetrics || []} 
              type="holiday-workday"
              isPercentageView={isPercentageView} 
            />
          </div>
          <div className="space-y-6">
            <Card className="bg-rakuten-amber/5 border-rakuten-amber/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Usage Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Holiday Usage</span>
                      <span className="text-sm font-medium">
                        {julyHoliday ? (julyHoliday.value / 1000000).toFixed(2) : '0'} GB/day
                      </span>
                    </div>
                    <div className="w-full bg-muted/20 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-rakuten-amber" 
                        style={{ width: `${Math.min(113, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Workday Usage</span>
                      <span className="text-sm font-medium">
                        {julyWorking ? (julyWorking.value / 1000000).toFixed(2) : '0'} GB/day
                      </span>
                    </div>
                    <div className="w-full bg-muted/20 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>
                <Card className="mt-4 p-3 bg-white border-l-4 border-rakuten-amber">
                  <div className="text-lg font-bold text-rakuten-amber">
                    +{holidayIncrease.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Higher usage on holidays</div>
                </Card>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
