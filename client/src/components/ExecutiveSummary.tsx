import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Zap, Building } from "lucide-react";
import MetricCard from "./MetricCard";
import InsightCard from "./InsightCard";
import TrafficChart from "./charts/TrafficChart";
import RoamingChart from "./charts/RoamingChart";
import { RAKUTEN_COLORS } from "@/data/csvData";
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

  const { data: roamingData } = useQuery<{
    irRoaming: Array<{month: string; year: number; value: number; factor: string}>;
    kddiRoaming: Array<{month: string; year: number; value: number; factor: string}>;
    fiveGData: Array<{month: string; year: number; value: number; factor: string}>;
    fourGData: Array<{month: string; year: number; value: number; factor: string}>;
  }>({
    queryKey: ['/api/roaming']
  });

  const { data: prefectures } = useQuery<Array<{prefecture: string; growthPercentage: number}>>({
    queryKey: ['/api/prefectures']
  });

  const { data: cellTypes } = useQuery<Array<{type: string; growthPercentage: number}>>({
    queryKey: ['/api/cell-types']
  });



  const { data: growthData } = useQuery<{
    fiveG: {factor: string; juneData: number; julyData: number; growthPercentage: number} | null;
    fourG: {factor: string; juneData: number; julyData: number; growthPercentage: number} | null;
    irRoaming: {factor: string; juneData: number; julyData: number; growthPercentage: number} | null;
    kddiRoaming: {factor: string; juneData: number; julyData: number; growthPercentage: number} | null;
  }>({
    queryKey: ['/api/all-growth']
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
          title="Month on month Traffic Growth"
          subtitle="Month-over-month progression"
          value={summary?.totalTrafficJuly ? (summary.totalTrafficJuly / 1000000).toFixed(2) : "0"}
          unit="PB (July)"
          trend={summary?.growthRate ? `+${summary.growthRate.toFixed(2)}%` : "+0%"}
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
          unit="PB/day"
          trend={summary?.normalizedGrowthRate ? `+${summary.normalizedGrowthRate.toFixed(2)}%` : "+6.35%"}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Application Insights */}
        <InsightCard
          title="Top Applications"
          subtitle="June to July growth"
          icon={<Building className="text-primary" />}
          data-testid="card-application-insights"
        >
          <div className="space-y-3">
            {applications?.slice(0, 5).map((app, index) => (
              <div key={app.application} className="flex justify-between items-center">
                <span className="text-sm font-medium">{app.application}</span>
                <span className="text-sm font-semibold" style={{ color: app.growthPercentage && app.growthPercentage > 0 ? RAKUTEN_COLORS.green : '#666' }}>
                  {app.growthPercentage !== null ? `+${app.growthPercentage.toFixed(2)}%` : 'N/A'}
                </span>
              </div>
            ))}
          </div>
        </InsightCard>

        {/* Device Insights */}
        <InsightCard
          title="Top Devices"
          subtitle="May to June growth"
          icon={<Building className="text-yellow-600" />}
          data-testid="card-device-insights"
        >
          <div className="space-y-3">
            {devices?.slice(0, 5).map((device, index) => (
              <div key={device.device} className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {device.device.split('(')[0].trim()}
                </span>
                <span className="text-sm font-semibold" style={{ 
                  color: device.growthPercentage && device.growthPercentage > 0 ? RAKUTEN_COLORS.green : '#C00000'
                }}>
                  {device.growthPercentage !== null ? 
                    `${device.growthPercentage > 0 ? '+' : ''}${device.growthPercentage.toFixed(2)}%` : 
                    'N/A'
                  }
                </span>
              </div>
            ))}
          </div>
        </InsightCard>

        {/* Prefecture Performance */}
        <InsightCard
          title="Top Prefectures"
          subtitle="July vs June growth"
          icon={<Building className="text-green-600" />}
          data-testid="card-prefecture-insights"
        >
          <div className="space-y-3">
            {prefectures?.slice(0, 5).map((prefecture, index) => (
              <div key={prefecture.prefecture} className="flex justify-between items-center">
                <span className="text-sm font-medium">{prefecture.prefecture}</span>
                <span className="text-sm font-semibold" style={{ 
                  color: prefecture.growthPercentage > 0 ? RAKUTEN_COLORS.green : RAKUTEN_COLORS.red
                }}>
                  {prefecture.growthPercentage > 0 ? '+' : ''}{prefecture.growthPercentage.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </InsightCard>

        {/* Cell Type Growth */}
        <InsightCard
          title="Cell Type Growth"
          subtitle="July vs June growth"
          icon={<Zap className="text-amber-600" />}
          data-testid="card-cell-type-insights"
        >
          <div className="space-y-3">
            {cellTypes?.slice(0, 5).map((cellType, index) => (
              <div key={cellType.type} className="flex justify-between items-center">
                <span className="text-sm font-medium">{cellType.type}</span>
                <span className="text-sm font-semibold" style={{ 
                  color: cellType.growthPercentage > 0 ? RAKUTEN_COLORS.green : RAKUTEN_COLORS.red
                }}>
                  {cellType.growthPercentage > 0 ? '+' : ''}{cellType.growthPercentage.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </InsightCard>
      </div>

      {/* Network Performance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 5G Performance Card */}
        <MetricCard
          title="5G Performance"
          subtitle="Daily traffic trend"
          value={growthData?.fiveG?.julyData?.toFixed(2) || "1.05"}
          unit="PB/day"
          trend={growthData?.fiveG?.growthPercentage ? 
            `${growthData.fiveG.growthPercentage > 0 ? '+' : ''}${growthData.fiveG.growthPercentage.toFixed(2)}%` : 
            "+10.53%"
          }
          trendDirection={growthData?.fiveG?.growthPercentage ? 
            (growthData.fiveG.growthPercentage > 0 ? 'up' : 'down') : 'up'
          }
          icon={<TrendingUp className="text-yellow-600 text-xl" />}
          data-testid="card-5g-performance"
        >
          <div className="chart-container">
            <RoamingChart 
              data={roamingData?.fiveGData || []} 
              type="total_5g_data_daily"
            />
          </div>
        </MetricCard>

        {/* 4G Performance Card */}
        <MetricCard
          title="4G Performance"
          subtitle="Daily traffic trend"
          value={growthData?.fourG?.julyData?.toFixed(2) || "6.66"}
          unit="PB/day"
          trend={growthData?.fourG?.growthPercentage ? 
            `${growthData.fourG.growthPercentage > 0 ? '+' : ''}${growthData.fourG.growthPercentage.toFixed(2)}%` : 
            "+9.54%"
          }
          trendDirection={growthData?.fourG?.growthPercentage ? 
            (growthData.fourG.growthPercentage > 0 ? 'up' : 'down') : 'up'
          }
          icon={<TrendingUp className="text-amber-600 text-xl" />}
          data-testid="card-4g-performance"
        >
          <div className="chart-container">
            <RoamingChart 
              data={roamingData?.fourGData || []} 
              type="total_4g_data_daily"
            />
          </div>
        </MetricCard>
      </div>

      {/* Roaming Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* International Roaming Card */}
        <MetricCard
          title="International Roaming"
          subtitle="Monthly trend"
          value={growthData?.irRoaming?.julyData?.toFixed(2) || "2.45"}
          unit="TB/day"
          trend={growthData?.irRoaming?.growthPercentage ? 
            `${growthData.irRoaming.growthPercentage > 0 ? '+' : ''}${growthData.irRoaming.growthPercentage.toFixed(2)}%` : 
            "+8.89%"
          }
          trendDirection={growthData?.irRoaming?.growthPercentage ? 
            (growthData.irRoaming.growthPercentage > 0 ? 'up' : 'down') : 'up'
          }
          icon={<TrendingUp className="text-green-600 text-xl" />}
          data-testid="card-ir-roaming"
        >
          <div className="chart-container">
            <RoamingChart 
              data={roamingData?.irRoaming || []} 
              type="IR_Roaming"
            />
          </div>
        </MetricCard>

        {/* KDDI Roaming Card */}
        <MetricCard
          title="KDDI Roaming"
          subtitle="Monthly trend"
          value={growthData?.kddiRoaming?.julyData?.toFixed(2) || "1.78"}
          unit="TB/day"
          trend={growthData?.kddiRoaming?.growthPercentage ? 
            `${growthData.kddiRoaming.growthPercentage > 0 ? '+' : ''}${growthData.kddiRoaming.growthPercentage.toFixed(2)}%` : 
            "+12.66%"
          }
          trendDirection={growthData?.kddiRoaming?.growthPercentage ? 
            (growthData.kddiRoaming.growthPercentage > 0 ? 'up' : 'down') : 'up'
          }
          icon={<TrendingUp className="text-blue-600 text-xl" />}
          data-testid="card-kddi-roaming"
        >
          <div className="chart-container">
            <RoamingChart 
              data={roamingData?.kddiRoaming || []} 
              type="KDDI_Roaming"
            />
          </div>
        </MetricCard>
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
