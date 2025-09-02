import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Layers, TrendingUp, CheckCircle, Lightbulb } from "lucide-react";
import { RAKUTEN_COLORS } from "@/data/csvData";
import type { ApplicationMetrics } from "@/types/analytics";

interface ApplicationTypesStoryProps {
  isPercentageView: boolean;
}

export default function ApplicationTypesStory({ isPercentageView }: ApplicationTypesStoryProps) {
  const { data: applications, isLoading } = useQuery<ApplicationMetrics[]>({
    queryKey: ['/api/applications']
  });

  if (isLoading) {
    return <Skeleton className="h-96" />;
  }

  // Application type categories with sample data
  const applicationTypes = [
    { type: "Video Streaming", share: 68, growth: 12.5, examples: ["YouTube", "TikTok", "Netflix"] },
    { type: "Social Media", share: 15, growth: 8.3, examples: ["Instagram", "Facebook", "Twitter"] },
    { type: "Web Applications", share: 12, growth: 6.7, examples: ["Chrome", "Safari", "Edge"] },
    { type: "Gaming", share: 3, growth: 15.2, examples: ["Mobile Games", "Cloud Gaming"] },
    { type: "Others", share: 2, growth: 4.1, examples: ["Utilities", "Productivity"] }
  ];

  const totalGrowth = applicationTypes.reduce((sum, type) => sum + type.growth, 0) / applicationTypes.length;
  const highestGrowthType = applicationTypes.reduce((max, type) => type.growth > max.growth ? type : max);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Application Type Trends
            </CardTitle>
            <p className="text-muted-foreground">
              Category-wise usage patterns and growth analysis
            </p>
          </div>
          <div className="bg-primary/10 p-3 rounded-lg">
            <Layers className="text-primary text-2xl" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Application Types Chart */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Traffic Share by Category</h3>
            <div className="space-y-3">
              {applicationTypes.map((type, index) => (
                <div key={type.type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{type.type}</span>
                    <span className="text-sm font-bold">{type.share}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${type.share}%`,
                        backgroundColor: Object.values(RAKUTEN_COLORS)[index % Object.values(RAKUTEN_COLORS).length]
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{type.examples.join(", ")}</span>
                    <span style={{ color: type.growth > 0 ? RAKUTEN_COLORS.green : RAKUTEN_COLORS.red }}>
                      +{type.growth.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="space-y-6">
            <Card className="bg-secondary/5 border-secondary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Lightbulb className="mr-2 h-5 w-5 text-secondary" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="text-secondary mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>
                      <strong>Video Streaming</strong> dominates with <strong>68%</strong> of total application traffic
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>
                      <strong>{highestGrowthType.type}</strong> shows highest growth at <strong>{highestGrowthType.growth.toFixed(1)}%</strong>
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="text-green-600 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>
                      Average category growth rate: <strong>{totalGrowth.toFixed(1)}%</strong> month-over-month
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="text-amber-600 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>
                      <strong>Social Media</strong> maintains steady <strong>15%</strong> market share
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="text-blue-600 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>
                      Top 3 categories account for <strong>95%</strong> of total application traffic
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center p-4">
                <div className="text-2xl font-bold" style={{ color: RAKUTEN_COLORS.green }}>
                  +{totalGrowth.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Growth</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-foreground">
                  {applicationTypes.length}
                </div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </Card>
            </div>
          </div>
        </div>

        {/* Growth Trends */}
        <div className="mt-6">
          <Card className="bg-accent/5 border-accent/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="mr-2 h-5 w-5 text-accent" />
                Growth Trends by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {applicationTypes.slice(0, 3).map((type, index) => (
                  <div key={type.type} className="p-4 bg-white rounded-lg border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">{type.type}</span>
                      <span 
                        className="text-sm font-bold"
                        style={{ color: type.growth > 10 ? RAKUTEN_COLORS.green : RAKUTEN_COLORS.blue }}
                      >
                        +{type.growth.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {type.share}% market share
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {type.examples[0]} leading
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}