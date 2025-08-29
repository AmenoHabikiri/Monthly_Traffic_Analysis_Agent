import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Smartphone, TrendingUp } from "lucide-react";
import ApplicationChart from "../charts/ApplicationChart";
import type { ApplicationMetrics } from "@/types/analytics";

interface ApplicationsStoryProps {
  isPercentageView: boolean;
}

export default function ApplicationsStory({ isPercentageView }: ApplicationsStoryProps) {
  const { data: applications, isLoading } = useQuery<ApplicationMetrics[]>({
    queryKey: ['/api/applications']
  });

  if (isLoading) {
    return <Skeleton className="h-96" />;
  }

  const julyApps = applications?.filter(app => app.month === 7) || [];
  const juneApps = applications?.filter(app => app.month === 6) || [];

  const topMovers = julyApps.slice(0, 3).map(app => {
    const juneApp = juneApps.find(j => j.application === app.application);
    const growth = juneApp ? 
      ((app.dataVolume - juneApp.dataVolume) / juneApp.dataVolume * 100) : 0;
    return { ...app, growth };
  });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Application Ranking Evolution
            </CardTitle>
            <p className="text-muted-foreground">
              How app preferences changed over time
            </p>
          </div>
          <div className="bg-accent/10 p-3 rounded-lg">
            <Smartphone className="text-accent text-2xl" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 large-chart-container">
            <ApplicationChart 
              data={applications || []} 
              isPercentageView={isPercentageView} 
            />
          </div>
          <div className="space-y-4">
            <Card className="bg-accent/5 border-accent/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <TrendingUp className="mr-2 h-4 w-4 text-accent" />
                  Top Movers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topMovers.map((app, index) => (
                    <div key={app.application} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{app.application}</span>
                      <span className="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs">
                        +{app.growth.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-destructive/5 border-destructive/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Application Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Streaming</span>
                    <span className="font-medium">68%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Social Media</span>
                    <span className="font-medium">15%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Web Applications</span>
                    <span className="font-medium">12%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Others</span>
                    <span className="font-medium">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
