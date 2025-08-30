import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, LabelList } from 'recharts';
import type { TrafficMetrics } from '@/types/analytics';
import { MONTHS, RAKUTEN_COLORS } from '@/data/csvData';



interface TrafficChartProps {
  data: TrafficMetrics[];
  type: 'total' | 'normalized';
  isPercentageView: boolean;
}

export default function TrafficChart({ data, type, isPercentageView }: TrafficChartProps) {
  // Sort data by year and month name
  const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const sortedData = data.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
  });
  
  const chartData = sortedData.map((item) => ({
    month: item.month, // Use the month name directly
    monthName: item.month,
    value: parseFloat((type === 'total' ? item.totalTraffic / 1000000 : item.normalizedTraffic / 1000000).toFixed(2)),
    percentage: parseFloat((item.deltaPercentage || 0).toFixed(2)),
    totalTraffic: parseFloat((item.totalTraffic / 1000000).toFixed(2)),
    normalizedTraffic: parseFloat((item.normalizedTraffic / 1000000).toFixed(2)),
    year: item.year,
    rawData: item
  }));

  const displayData = isPercentageView ? 
    chartData.map(d => ({ ...d, value: d.percentage })) : 
    chartData;
    
  // Calculate dynamic Y-axis domain with adaptive padding
  const values = displayData.map(d => d.value).filter(v => v !== null && v !== undefined);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const paddingPercent = maxValue > 100 ? 0.1 : 0.2;
  
  const minWithPadding = Math.max(0, minValue * (1 - paddingPercent));
  const maxWithPadding = maxValue * (1 + paddingPercent);
  
  const yAxisDomain = [
    maxValue > 100 ? Math.round(minWithPadding / 10) * 10 : Math.round(minWithPadding),
    maxValue > 100 ? Math.round(maxWithPadding / 10) * 10 : Math.round(maxWithPadding)
  ];
  
  // Calculate intelligent tick interval
  const range = yAxisDomain[1] - yAxisDomain[0];
  const getTickInterval = (range: number) => {
    if (range <= 10) return 1;
    if (range <= 50) return 5;
    if (range <= 100) return 10;
    if (range <= 500) return 50;
    return 100;
  };
  
  const tickInterval = getTickInterval(range);
  const tickCount = Math.floor(range / tickInterval) + 1;
  const ticks = Array.from({length: tickCount}, (_, i) => yAxisDomain[0] + i * tickInterval);
    
  const renderLabel = (props: any) => {
    const { value } = props;
    if (!value && value !== 0) return '';
    if (isPercentageView) {
      return `${Number(value).toFixed(1)}%`;
    }
    return `${Number(value).toFixed(1)} ${type === 'total' ? 'GB' : 'GB/day'}`;
  };

  if (type === 'normalized') {
    return (
      <div style={{ width: '100%', height: '100%', isolation: 'isolate' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={displayData} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={RAKUTEN_COLORS.pink} stopOpacity={0.9}/>
                <stop offset="100%" stopColor={RAKUTEN_COLORS.red} stopOpacity={0.6}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 2" stroke="#e8e8e8" strokeOpacity={0.5} />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 13, fontWeight: 500, fill: '#333' }} 
              stroke="#666"
              strokeWidth={1}
              tickLine={false}
              axisLine={{ stroke: '#ddd', strokeWidth: 1 }}
            />
            <YAxis 
              domain={yAxisDomain}
              tickFormatter={(value) => Math.round(value).toString()}
              tick={{ fontSize: 12, fill: '#666' }} 
              stroke="#666"
              strokeWidth={1}
              tickLine={false}
              axisLine={{ stroke: '#ddd', strokeWidth: 1 }}
              label={{ 
                value: isPercentageView ? 'Growth (%)' : 'GB/day', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: '12px', fill: '#666' }
              }}
            />
            <Bar 
              dataKey="value" 
              fill="url(#barGradient)"
              stroke={RAKUTEN_COLORS.red}
              strokeWidth={1}
              radius={[6, 6, 0, 0]}
            >
              <LabelList 
                dataKey="value" 
                position="top" 
                style={{ fontSize: '11px', fontWeight: 'bold', fill: '#333' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', isolation: 'isolate' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={displayData} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={RAKUTEN_COLORS.red}/>
              <stop offset="100%" stopColor={RAKUTEN_COLORS.blue}/>
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="2 2" stroke="#e8e8e8" strokeOpacity={0.5} />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 13, fontWeight: 500, fill: '#333' }} 
            stroke="#666"
            strokeWidth={1}
            tickLine={false}
            axisLine={{ stroke: '#ddd', strokeWidth: 1 }}
          />
          <YAxis 
            domain={yAxisDomain}
            ticks={ticks}
            tickFormatter={(value) => Math.round(value).toString()}
            tick={{ fontSize: 12, fill: '#666' }} 
            stroke="#666"
            strokeWidth={1}
            tickLine={false}
            axisLine={{ stroke: '#ddd', strokeWidth: 1 }}
            label={{ 
              value: isPercentageView ? 'Growth (%)' : 'Traffic (GB)', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fontSize: '12px', fill: '#666' }
            }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="url(#lineGradient)"
            strokeWidth={4}
            dot={{ 
              fill: RAKUTEN_COLORS.red, 
              strokeWidth: 3, 
              r: 7,
              stroke: '#fff',
              filter: 'url(#shadow)'
            }}
            activeDot={{ 
              r: 9, 
              stroke: RAKUTEN_COLORS.red, 
              strokeWidth: 3,
              fill: '#fff',
              filter: 'url(#shadow)'
            }}
          >
            <LabelList 
              dataKey="value" 
              position="top" 
              style={{ fontSize: '11px', fontWeight: 'bold', fill: '#333' }}
            />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}