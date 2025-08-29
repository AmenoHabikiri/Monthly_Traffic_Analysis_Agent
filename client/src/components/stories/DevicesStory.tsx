import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TabletIcon } from "lucide-react";
import DeviceChart from "../charts/DeviceChart";
import type { DeviceMetrics } from "@/types/analytics";

interface DevicesStoryProps {
  isPercentageView: boolean;
}

export default function DevicesStory({ isPercentageView }: DevicesStoryProps) {
  const { data: devices, isLoading } = useQuery<DeviceMetrics[]>({
    queryKey: ['/api/devices']
  });

  if (isLoading) {
    return <Skeleton className="h-96" />;
  }

  const julyDevices = devices?.filter(device => device.month === 7) || [];
  const juneDevices = devices?.filter(device => device.month === 6) || [];

  const significantChanges = julyDevices.slice(0, 3).map(device => {
    const juneDevice = juneDevices.find(j => j.device === device.device);
    const growth = juneDevice ? 
      ((device.dataVolume - juneDevice.dataVolume) / juneDevice.dataVolume * 100) : 0;
    return { ...device, growth };
  });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Device Market Evolution
            </CardTitle>
            <p className="text-muted-foreground">
              Ranking changes and market preferences
            </p>
          </div>
          <div className="bg-rakuten-yellow/10 p-3 rounded-lg">
            <TabletIcon className="text-rakuten-yellow text-2xl" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 large-chart-container">
            <DeviceChart 
              data={devices || []} 
              isPercentageView={isPercentageView} 
            />
          </div>
          <div className="space-y-4">
            <Card className="bg-rakuten-yellow/5 border-rakuten-yellow/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Significant Changes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {significantChanges.map((device, index) => {
                    const borderColor = device.growth > 0 ? 'border-secondary' : 
                                       device.growth < -5 ? 'border-destructive' : 'border-primary';
                    const textColor = device.growth > 0 ? 'text-secondary' : 
                                     device.growth < -5 ? 'text-destructive' : 'text-primary';
                    
                    return (
                      <div key={device.device} className={`border-l-4 ${borderColor} pl-3`}>
                        <div className="text-sm font-medium">
                          {device.device.replace(/\s*\([^)]*\)/g, '').substring(0, 20)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {index === 0 ? 'Moved to #1 position' : 
                           index === 1 ? 'Dropped to #2' : 'Strong momentum'}
                        </div>
                        <div className={`text-xs ${textColor}`}>
                          {device.growth > 0 ? '+' : ''}{device.growth.toFixed(1)}% growth
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
