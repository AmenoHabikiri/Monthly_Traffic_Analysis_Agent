import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  className?: string;
  'data-testid'?: string;
}

export default function StoryCard({ 
  title, 
  description, 
  icon, 
  isActive, 
  onClick,
  className,
  'data-testid': testId
}: StoryCardProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "story-card h-auto p-0 justify-start",
        isActive ? "active-story" : "",
        className
      )}
      onClick={onClick}
      data-testid={testId}
    >
      <Card className="w-full border-0 shadow-none bg-transparent">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="text-primary">{icon}</div>
            <h4 className="font-semibold text-foreground text-left">{title}</h4>
          </div>
          <p className="text-sm text-muted-foreground text-left">{description}</p>
        </CardContent>
      </Card>
    </Button>
  );
}
