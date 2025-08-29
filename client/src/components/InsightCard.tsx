import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface InsightCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  'data-testid'?: string;
}

export default function InsightCard({ 
  title, 
  subtitle, 
  icon, 
  children,
  'data-testid': testId
}: InsightCardProps) {
  return (
    <Card className="shadow-lg" data-testid={testId}>
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            {icon}
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{title}</h4>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
