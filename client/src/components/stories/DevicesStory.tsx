import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TabletIcon, TrendingUp, Users } from "lucide-react";
import DeviceRankingChart from "../charts/DeviceRankingChart";
import DeviceUserRankingList from "../charts/DeviceUserRankingList";
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

  return (
    <div className="space-y-6">
      {/* First Row - Traffic Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-foreground">
                  Absolute Growth of Device wise Traffic
                </CardTitle>
                <p className="text-muted-foreground">
                  Device ranking by total data consumed per month
                </p>
              </div>
              <div className="bg-rakuten-blue/10 p-3 rounded-lg">
                <TrendingUp className="text-rakuten-blue text-xl" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <DeviceRankingChart data={devices || []} type="absolute" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-foreground">
                  Percentage Growth of Device wise Traffic
                </CardTitle>
                <p className="text-muted-foreground">
                  Device ranking by traffic growth percentage
                </p>
              </div>
              <div className="bg-rakuten-green/10 p-3 rounded-lg">
                <TrendingUp className="text-rakuten-green text-xl" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <DeviceRankingChart data={devices || []} type="percentage" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row - User Count Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-foreground">
                  Absolute Growth of Devices with respect User count
                </CardTitle>
                <p className="text-muted-foreground">
                  Rank list of devices by unique user count
                </p>
              </div>
              <div className="bg-rakuten-yellow/10 p-3 rounded-lg">
                <Users className="text-rakuten-yellow text-xl" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DeviceUserRankingList data={devices || []} type="absolute" />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-foreground">
                  Percentage Growth of Devices with respect User count
                </CardTitle>
                <p className="text-muted-foreground">
                  Rank list by user count growth percentage
                </p>
              </div>
              <div className="bg-rakuten-pink/10 p-3 rounded-lg">
                <Users className="text-rakuten-pink text-xl" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DeviceUserRankingList data={devices || []} type="percentage" />
          </CardContent>
        </Card>
      </div>

      {/* Third Row - Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-foreground">
                  Absolute Daily Traffic Growth
                </CardTitle>
                <p className="text-muted-foreground">
                  Daily traffic volume trends by device
                </p>
              </div>
              <div className="bg-rakuten-amber/10 p-3 rounded-lg">
                <TrendingUp className="text-rakuten-amber text-xl" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <DeviceRankingChart data={devices || []} type="absolute" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-foreground">
                  Traffic Consumption Growth per Device per User
                </CardTitle>
                <p className="text-muted-foreground">
                  Per-user consumption trends by device
                </p>
              </div>
              <div className="bg-rakuten-purple/10 p-3 rounded-lg">
                <Users className="text-rakuten-purple text-xl" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DeviceUserRankingList data={devices || []} type="per-user" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
