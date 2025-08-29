import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import type { ApplicationMetrics } from '@/types/analytics';
import { RAKUTEN_COLORS, MONTHS } from '@/data/csvData';

interface ApplicationChartProps {
  data: ApplicationMetrics[];
  isPercentageView: boolean;
}

export default function ApplicationChart({ data, isPercentageView }: ApplicationChartProps) {
  // Group data by application
  const appGroups = data.reduce((acc, item) => {
    if (!acc[item.application]) {
      acc[item.application] = [];
    }
    acc[item.application].push(item);
    return acc;
  }, {} as Record<string, ApplicationMetrics[]>);

  // Get top 5 applications
  const topApps = Object.keys(appGroups).slice(0, 5);
  
  // Create chart data
  const chartData = [5, 6, 7].map(month => {
    const monthData: any = { month: MONTHS[month - 5] };
    
    topApps.forEach((app, index) => {
      const appData = appGroups[app]?.find(d => d.month === month);
      if (appData) {
        if (isPercentageView && month > 5) {
          const prevData = appGroups[app]?.find(d => d.month === month - 1);
          if (prevData) {
            monthData[app] = ((appData.dataVolume - prevData.dataVolume) / prevData.dataVolume * 100);
          }
        } else {
          monthData[app] = appData.dataVolume / 1000; // Convert to GB
        }
      }
    });
    
    return monthData;
  });

  const colors = Object.values(RAKUTEN_COLORS);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12 }} 
          stroke="#888"
        />
        <YAxis 
          tick={{ fontSize: 12 }} 
          stroke="#888"
          label={{ 
            value: isPercentageView ? 'Growth (%)' : 'Data (GB)', 
            angle: -90, 
            position: 'insideLeft' 
          }}
        />
        <Legend />
        {topApps.map((app, index) => (
          <Line
            key={app}
            type="monotone"
            dataKey={app}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ strokeWidth: 2, r: 3 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
