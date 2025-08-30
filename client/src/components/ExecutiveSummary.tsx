import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Zap, Building } from "lucide-react";
import MetricCard from "./MetricCard";
import InsightCard from "./InsightCard";
import TrafficChart from "./charts/TrafficChart";
import type { AnalyticsSummary, TrafficMetrics, ApplicationMetrics, DeviceMetrics, NetworkMetrics } from "@/types/analytics";

interface ExecutiveSummaryProps {
  isPercentageView: boolean;
}

export default function ExecutiveSummary({ isPercentageView }: ExecutiveSummaryProps) {
  const { data: summary, isLoading: summaryLoading, error: summaryError } = useQuery<AnalyticsSummary>({
    queryKey: ['/api/analytics/summary']
  });
  
  console.log('🔍 Frontend - Summary data:', summary);
  console.log('🔍 Frontend - Summary loading:', summaryLoading);
  console.log('🔍 Frontend - Summary error:', summaryError);

  const { data: trafficData, isLoading: trafficLoading, error: trafficError } = useQuery<TrafficMetrics[]>({
    queryKey: ['/api/traffic']
  });
  
  console.log('🚗 Frontend - Traffic data:', trafficData);
  console.log('🚗 Frontend - Traffic loading:', trafficLoading);
  console.log('🚗 Frontend - Traffic error:', trafficError);

  const { data: applications } = useQuery<ApplicationMetrics[]>({
    queryKey: ['/api/applications']
  });

  const { data: devices } = useQuery<DeviceMetrics[]>({
    queryKey: ['/api/devices']
  });

  const { data: networkMetrics } = useQuery<NetworkMetrics[]>({
    queryKey: ['/api/network-metrics']
  });

  if (summaryError || trafficError) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading data. Please try again.</p>
      </div>
    );
  }

  if (summaryLoading || trafficLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  const fiveGMetrics = networkMetrics?.filter(m => m.month === 7 && m.factor === 'total_5g_data_daily')[0];
  const fourGMetrics = networkMetrics?.filter(m => m.month === 7 && m.factor === 'total_4g_data_daily')[0];
  const fiveGSharePercent = fiveGMetrics && fourGMetrics && (fiveGMetrics.value + fourGMetrics.value) > 0 ? 
    ((fiveGMetrics.value / (fiveGMetrics.value + fourGMetrics.value)) * 100) : 0;

  return (
    <div className="space-y-8" data-testid="executive-summary">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Total Traffic Growth Card */}
        <MetricCard
          title="Total Traffic Growth"
          subtitle="Month-over-month progression"
          value={summary?.totalTrafficJuly ? (summary.totalTrafficJuly / 1000000).toFixed(1) : "0"}
          unit="GB (July)"
          trend={summary?.growthRate ? `+${summary.growthRate.toFixed(1)}%` : "+0%"}
          trendDirection="up"
          icon={<TrendingUp className="text-secondary text-xl" />}
          data-testid="card-total-traffic"
        >
          <div className="chart-container">
            <TrafficChart 
              data={trafficData || []} 
              type="total" 
              isPercentageView={isPercentageView} 
            />
          </div>
        </MetricCard>

        {/* Normalized Traffic Growth Card */}
        <MetricCard
          title="Normalized Traffic Growth"
          subtitle="Daily average traffic per month"
          value={summary?.normalizedTrafficJuly ? (summary.normalizedTrafficJuly / 1000000).toFixed(2) : "0"}
          unit="GB/day"
          trend={summary?.normalizedGrowthRate ? `+${summary.normalizedGrowthRate.toFixed(1)}%` : "+6.35%"}
          trendDirection="up"
          icon={<Zap className="text-accent text-xl" />}
          data-testid="card-normalized-traffic"
        >
          <div className="chart-container">
            <TrafficChart 
              data={trafficData || []} 
              type="normalized" 
              isPercentageView={isPercentageView} 
            />
          </div>
        </MetricCard>
      </div>

      {/* Summary Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Application Insights */}
        <InsightCard
          title="Top Applications"
          subtitle="July performance"
          icon={<Building className="text-primary" />}
          data-testid="card-application-insights"
        >
          <div className="space-y-3">
            {applications?.filter(app => app.month === 7).slice(0, 3).map((app, index) => {
              const juneApp = applications.find(a => a.application === app.application && a.month === 6);
              const growth = juneApp && juneApp.dataVolume > 0 ? 
                ((app.dataVolume - juneApp.dataVolume) / juneApp.dataVolume * 100) : 0;
              
              return (
                <div key={app.application} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{app.application}</span>
                  <span className="text-sm text-secondary font-semibold">
                    +{growth.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </InsightCard>

        {/* Device Insights */}
        <InsightCard
          title="Top Devices"
          subtitle="Market leaders"
          icon={<Building className="text-yellow-600" />}
          data-testid="card-device-insights"
        >
          <div className="space-y-3">
            {devices?.filter(device => device.month === 7).slice(0, 3).map((device, index) => {
              const juneDevice = devices.find(d => d.device === device.device && d.month === 6);
              const growth = juneDevice && juneDevice.dataVolume > 0 ? 
                ((device.dataVolume - juneDevice.dataVolume) / juneDevice.dataVolume * 100) : 0;
              
              return (
                <div key={device.device} className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {device.device.replace(/\s*\([^)]*\)/g, '').substring(0, 15)}...
                  </span>
                  <span className={`text-sm font-semibold ${
                    growth > 0 ? 'text-secondary' : 'text-destructive'
                  }`}>
                    {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </InsightCard>

        {/* Network Performance */}
        <InsightCard
          title="5G Performance"
          subtitle="Network evolution"
          icon={<TrendingUp className="text-secondary" />}
          data-testid="card-network-performance"
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">5G Share</span>
              <span className="text-sm text-secondary font-semibold">
                {fiveGSharePercent.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Daily 5G Traffic</span>
              <span className="text-sm text-secondary font-semibold">
                {fiveGMetrics ? (fiveGMetrics.value / 1000000).toFixed(2) : '0'} GB
              </span>
            </div>
            <div className="w-full bg-muted/20 rounded-full h-2">
              <div 
                className="bg-secondary h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${fiveGSharePercent}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {fiveGSharePercent.toFixed(1)}% of total traffic
            </p>
          </div>
        </InsightCard>
      </div>

      {/* Key Observations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <div className="w-8 h-8 bg-rakuten-yellow/10 rounded-lg flex items-center justify-center mr-3">
              <TrendingUp className="text-rakuten-yellow" />
            </div>
            Key Observations & Future Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-l-4 border-secondary pl-4">
                <h4 className="font-semibold text-foreground">Streaming Dominance</h4>
                <p className="text-sm text-muted-foreground">
                  Video streaming applications (YouTube, TikTok) account for 68% of total data consumption, 
                  showing the increasing demand for video content.
                </p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold text-foreground">5G Acceleration</h4>
                <p className="text-sm text-muted-foreground">
                  5G traffic growth of 10.8% indicates strong network modernization adoption among users.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-accent pl-4">
                <h4 className="font-semibold text-foreground">Premium Device Shift</h4>
                <p className="text-sm text-muted-foreground">
                  iPhone 15 overtaking WiFi Pocket devices suggests users prioritizing high-end mobile experiences.
                </p>
              </div>
              <div className="border-l-4 border-rakuten-yellow pl-4">
                <h4 className="font-semibold text-foreground">Holiday Impact</h4>
                <p className="text-sm text-muted-foreground">
                  9.6% higher data usage on holidays indicates increased leisure time digital consumption patterns.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
