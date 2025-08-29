import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smartphone, BarChart, Percent } from "lucide-react";
import ExecutiveSummary from "@/components/ExecutiveSummary";
import MonthlyAnalysis from "@/components/MonthlyAnalysis";

export default function Dashboard() {
  const [isPercentageView, setIsPercentageView] = useState(false);

  const toggleView = () => {
    setIsPercentageView(!isPercentageView);
  };

  return (
    <div className="bg-background font-sans min-h-screen" data-testid="dashboard-main">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {/* Rakuten Mobile logo placeholder */}
                <div className="w-10 h-10 rakuten-gradient rounded-lg flex items-center justify-center">
                  <Smartphone className="text-white text-lg" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Rakuten Mobile</h1>
                  <p className="text-xs text-muted-foreground">Data Analytics Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                July 2025 Focus
              </div>
              <Button 
                onClick={toggleView}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-toggle-view"
              >
                {isPercentageView ? (
                  <>
                    <BarChart className="mr-2 h-4 w-4" />
                    Absolute View
                  </>
                ) : (
                  <>
                    <Percent className="mr-2 h-4 w-4" />
                    Percentage View
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="executive" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="executive" data-testid="tab-executive-summary">
              Executive Summary
            </TabsTrigger>
            <TabsTrigger value="monthly" data-testid="tab-monthly-analysis">
              Monthly Traffic Analysis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="executive">
            <ExecutiveSummary isPercentageView={isPercentageView} />
          </TabsContent>
          
          <TabsContent value="monthly">
            <MonthlyAnalysis isPercentageView={isPercentageView} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
