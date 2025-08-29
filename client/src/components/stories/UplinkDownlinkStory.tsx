import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpDown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import type { TrafficMetrics } from "@/types/analytics";
import { RAKUTEN_COLORS } from "@/data/csvData";

interface UplinkDownlinkStoryProps {
  isPercentageView: boolean;
}

export default function UplinkDownlinkStory({ isPercentageView }: UplinkDownlinkStoryProps) {
  const { data: trafficData, isLoading } = useQuery<TrafficMetrics[]>({
    queryKey: ['/api/traffic']
  });

  if (isLoading) {
    return <Skeleton className="h-96" />;
  }

  const julyTraffic = trafficData?.find(t => t.month === 7);

  const pieData = julyTraffic ? [
    { name: 'Downlink', value: julyTraffic.totalDlVol! / 1000000, color: RAKUTEN_COLORS.blue },
    { name: 'Uplink', value: julyTraffic.totalUlVol! / 1000000, color: RAKUTEN_COLORS.pink }
  ] : [];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Upload vs Download Patterns
            </CardTitle>
            <p className="text-muted-foreground">
              Understanding directional traffic trends
            </p>
          </div>
          <div className="bg-secondary/10 p-3 rounded-lg">
            <ArrowUpDown className="text-secondary text-2xl" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="large-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  label={({name, value}) => `${name}: ${value.toFixed(1)} GB`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-6">
            <Card className="bg-secondary/5 border-secondary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Traffic Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">DL/UL Ratio</span>
                    <span className="font-bold text-lg">
                      {julyTraffic?.dlUlRatio?.toFixed(2) || '0'}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Users consume 10x more than they upload, typical for video streaming dominance
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-primary/5 text-center p-4">
                <div className="text-xl font-bold text-primary">
                  {julyTraffic ? (julyTraffic.totalDlVol! / 1000000).toFixed(1) : '0'}
                </div>
                <div className="text-sm text-muted-foreground">Downlink GB</div>
              </Card>
              <Card className="bg-accent/5 text-center p-4">
                <div className="text-xl font-bold text-accent">
                  {julyTraffic ? (julyTraffic.totalUlVol! / 1000000).toFixed(1) : '0'}
                </div>
                <div className="text-sm text-muted-foreground">Uplink GB</div>
              </Card>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
