import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import type { DeviceMetrics } from '@/types/analytics';
import { RAKUTEN_COLORS, MONTHS } from '@/data/csvData';

interface DeviceChartProps {
  data: DeviceMetrics[];
  isPercentageView: boolean;
}

export default function DeviceChart({ data, isPercentageView }: DeviceChartProps) {
  // Group data by device
  const deviceGroups = data.reduce((acc, item) => {
    const shortName = item.device.replace(/\s*\([^)]*\)/g, '').substring(0, 20);
    if (!acc[shortName]) {
      acc[shortName] = [];
    }
    acc[shortName].push(item);
    return acc;
  }, {} as Record<string, DeviceMetrics[]>);

  // Get top 5 devices
  const topDevices = Object.keys(deviceGroups).slice(0, 5);
  
  // Create chart data
  const chartData = [5, 6, 7].map(month => {
    const monthData: any = { month: MONTHS[month - 5] };
    
    topDevices.forEach((device, index) => {
      const deviceData = deviceGroups[device]?.find(d => d.month === month);
      if (deviceData) {
        if (isPercentageView && month > 5) {
          const prevData = deviceGroups[device]?.find(d => d.month === month - 1);
          if (prevData) {
            monthData[device] = ((deviceData.dataVolume - prevData.dataVolume) / prevData.dataVolume * 100);
          }
        } else {
          monthData[device] = deviceData.dataVolume / 1000; // Convert to GB
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
