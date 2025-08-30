import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import type { TrafficMetrics } from '@/types/analytics';
import { MONTHS } from '@/data/csvData';

const CHART_COLORS = {
  pink: 'hsl(327, 100%, 60%)',
  blue: 'hsl(207, 89%, 56%)',
  green: 'hsl(139, 61%, 35%)',
  yellow: 'hsl(48, 100%, 50%)'
};

interface TrafficChartProps {
  data: TrafficMetrics[];
  type: 'total' | 'normalized';
  isPercentageView: boolean;
}

export default function TrafficChart({ data, type, isPercentageView }: TrafficChartProps) {
  const chartData = data.map((item, index) => ({
    month: MONTHS[index] || `${item.year}-${item.month.toString().padStart(2, '0')}`,
    value: type === 'total' ? item.totalTraffic / 1000000 : item.normalizedTraffic / 1000000,
    percentage: item.deltaPercentage || 0
  })).sort((a, b) => a.month.localeCompare(b.month));

  const displayData = isPercentageView ? 
    chartData.map(d => ({ ...d, value: d.percentage })) : 
    chartData;

  if (type === 'normalized') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={displayData}>
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
              value: isPercentageView ? 'Growth (%)' : 'GB/day', 
              angle: -90, 
              position: 'insideLeft' 
            }}
          />
          <Bar 
            dataKey="value" 
            fill={CHART_COLORS.pink}
            stroke={CHART_COLORS.pink}
            strokeWidth={2}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={displayData}>
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
            value: isPercentageView ? 'Growth (%)' : 'Traffic (GB)', 
            angle: -90, 
            position: 'insideLeft' 
          }}
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={CHART_COLORS.blue}
          strokeWidth={3}
          dot={{ fill: CHART_COLORS.blue, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: CHART_COLORS.blue, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
