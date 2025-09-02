import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from 'recharts';
import { RAKUTEN_COLORS } from '@/data/csvData';

interface DeviceTypeTrendsChartProps {
  data: Array<{
    device: string;
    monthName: string;
    year: number;
    monthlyTotalDataGb: number;
  }>;
}

export default function DeviceTypeTrendsChart({ data }: DeviceTypeTrendsChartProps) {
  // Get top 10 devices by total data across all months
  const deviceTotals = data.reduce((acc, item) => {
    acc[item.device] = (acc[item.device] || 0) + item.monthlyTotalDataGb;
    return acc;
  }, {} as Record<string, number>);
  
  const top10Devices = Object.entries(deviceTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([device]) => device);
  
  // Filter data for top 10 devices and transform for chart
  const filteredData = data.filter(item => top10Devices.includes(item.device));
  
  // Group by month for the chart
  const monthOrder = ['May', 'June', 'July'];
  const chartData = monthOrder.map(month => {
    const monthData: any = { month };
    top10Devices.forEach(device => {
      const deviceData = filteredData.find(d => d.device === device && d.monthName === month);
      monthData[device] = deviceData ? deviceData.monthlyTotalDataGb : 0;
    });
    return monthData;
  });
  
  const colors = Object.values(RAKUTEN_COLORS);

  return (
    <div style={{ width: '100%', height: '100%', isolation: 'isolate' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="2 2" stroke="#e8e8e8" strokeOpacity={0.5} />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12, fontWeight: 500, fill: '#333' }} 
            stroke="#666"
            strokeWidth={1}
            tickLine={false}
            axisLine={{ stroke: '#ddd', strokeWidth: 1 }}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#666' }} 
            stroke="#666"
            strokeWidth={1}
            tickLine={false}
            axisLine={{ stroke: '#ddd', strokeWidth: 1 }}
            label={{ 
              value: 'Data (GB)', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fontSize: '12px', fill: '#666' }
            }}
          />
          {top10Devices.slice(0, 5).map((device, index) => (
            <Bar 
              key={device}
              dataKey={device} 
              fill={colors[index % colors.length]}
              stroke={colors[index % colors.length]}
              strokeWidth={1}
              radius={[2, 2, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}