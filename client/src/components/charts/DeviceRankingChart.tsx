import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import type { DeviceMetrics } from '@/types/analytics';
import { RAKUTEN_COLORS, MONTHS } from '@/data/csvData';

interface DeviceRankingChartProps {
  data: DeviceMetrics[];
  type: 'absolute' | 'percentage';
}

export default function DeviceRankingChart({ data, type }: DeviceRankingChartProps) {
  // Group data by device and get top 10
  const deviceGroups = data.reduce((acc, item) => {
    const shortName = item.device.replace(/\s*\([^)]*\)/g, '').substring(0, 15);
    if (!acc[shortName]) {
      acc[shortName] = [];
    }
    acc[shortName].push(item);
    return acc;
  }, {} as Record<string, DeviceMetrics[]>);

  const topDevices = Object.keys(deviceGroups).slice(0, 10);
  
  // Create chart data
  const chartData = [5, 6, 7].map(month => {
    const monthData: any = { month: MONTHS[month - 5] };
    
    topDevices.forEach(device => {
      const deviceData = deviceGroups[device]?.find(d => d.month === month);
      if (deviceData) {
        if (type === 'absolute') {
          monthData[device] = deviceData.dataVolume / 1000; // Convert to GB
        } else {
          // Get devices for this month and sort by data volume for ranking
          const monthDevices = data.filter(d => d.month === month)
            .sort((a, b) => b.dataVolume - a.dataVolume);
          const rank = monthDevices.findIndex(d => 
            d.device.replace(/\s*\([^)]*\)/g, '').substring(0, 15) === device
          ) + 1;
          monthData[device] = rank;
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
          domain={type === 'percentage' ? [1, 10] : undefined}
          reversed={type === 'percentage'}
          label={{ 
            value: type === 'absolute' ? 'Data Traffic (GB)' : 'Rank', 
            angle: -90, 
            position: 'insideLeft' 
          }}
        />
        <Legend />
        {topDevices.map((device, index) => (
          <Line
            key={device}
            type="monotone"
            dataKey={device}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ strokeWidth: 2, r: 3 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}