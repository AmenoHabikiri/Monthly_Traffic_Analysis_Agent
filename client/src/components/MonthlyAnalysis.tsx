import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Smartphone, 
  TabletIcon, 
  ArrowUpDown, 
  Calendar, 
  Signal, 
  Building2, 
  PieChart 
} from "lucide-react";
import StoryCard from "./StoryCard";
import { STORY_NAVIGATION } from "@/data/csvData";
import TrafficStory from "./stories/TrafficStory";
import ApplicationsStory from "./stories/ApplicationsStory";
import DevicesStory from "./stories/DevicesStory";
import UplinkDownlinkStory from "./stories/UplinkDownlinkStory";
import HolidayWorkdayStory from "./stories/HolidayWorkdayStory";
import FourGFiveGStory from "./stories/FourGFiveGStory";
import B2bB2cStory from "./stories/B2bB2cStory";
import MiscellaneousStory from "./stories/MiscellaneousStory";
import type { StoryType } from "@/types/analytics";

interface MonthlyAnalysisProps {
  isPercentageView: boolean;
}

const iconMap = {
  'chart-line': TrendingUp,
  'mobile-alt': Smartphone,
  'tablet-alt': TabletIcon,
  'exchange-alt': ArrowUpDown,
  'calendar-alt': Calendar,
  'signal': Signal,
  'building': Building2,
  'chart-pie': PieChart
};

export default function MonthlyAnalysis({ isPercentageView }: MonthlyAnalysisProps) {
  const [activeStory, setActiveStory] = useState<StoryType>('traffic');

  const renderStoryContent = () => {
    switch (activeStory) {
      case 'traffic':
        return <TrafficStory isPercentageView={isPercentageView} />;
      case 'applications':
        return <ApplicationsStory isPercentageView={isPercentageView} />;
      case 'devices':
        return <DevicesStory isPercentageView={isPercentageView} />;
      case 'uplink-downlink':
        return <UplinkDownlinkStory isPercentageView={isPercentageView} />;
      case 'holiday-workday':
        return <HolidayWorkdayStory isPercentageView={isPercentageView} />;
      case '4g-5g':
        return <FourGFiveGStory isPercentageView={isPercentageView} />;
      case 'b2b-b2c':
        return <B2bB2cStory isPercentageView={isPercentageView} />;
      case 'miscellaneous':
        return <MiscellaneousStory isPercentageView={isPercentageView} />;
      default:
        return <TrafficStory isPercentageView={isPercentageView} />;
    }
  };

  return (
    <div className="space-y-8" data-testid="monthly-analysis">
      {/* Story Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">
            Select Your Data Story
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {STORY_NAVIGATION.map((story) => {
              const IconComponent = iconMap[story.icon as keyof typeof iconMap];
              return (
                <StoryCard
                  key={story.id}
                  title={story.title}
                  description={story.description}
                  icon={<IconComponent />}
                  isActive={activeStory === story.id}
                  onClick={() => setActiveStory(story.id)}
                  data-testid={`story-card-${story.id}`}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Story Content */}
      <div data-testid={`story-content-${activeStory}`}>
        {renderStoryContent()}
      </div>
    </div>
  );
}
