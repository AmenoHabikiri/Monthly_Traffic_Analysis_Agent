import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from 'recharts';
import { RAKUTEN_COLORS } from '@/data/csvData';

interface RoamingChartProps {
  data: Array<{
    month: string;
    year: number;
    value: number;
    factor: string;
  }>;
  type: 'IR_Roaming' | 'KDDI_Roaming' | 'total_5g_data_daily' | 'total_4g_data_daily';
}

export default function RoamingChart({ data, type }: RoamingChartProps) {
  // Sort data by year and month
  const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const sortedData = data
    .filter(item => item.factor === type)
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });
  
  const chartData = sortedData.map((item) => ({
    month: item.month,
    value: parseFloat(item.value.toFixed(2))
  }));

  // Calculate dynamic Y-axis domain with adaptive padding
  const values = chartData.map(d => d.value).filter(v => v !== null && v !== undefined);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  
  // Adaptive padding logic: 10% for values >100, 20% for smaller values
  const paddingPercent = maxValue > 100 ? 0.1 : 0.2;
  
  const minWithPadding = Math.max(0, minValue * (1 - paddingPercent));
  const maxWithPadding = maxValue * (1 + paddingPercent);
  
  // Special handling for 4G performance with adaptive padding
  const yAxisDomain = type === 'total_4g_data_daily' ? [
    maxValue > 100 ? Math.round(minWithPadding / 10) * 10 : parseFloat(minWithPadding.toFixed(2)),
    maxValue > 100 ? Math.round(maxWithPadding / 10) * 10 : parseFloat(maxWithPadding.toFixed(2))
  ] : type === 'total_5g_data_daily' ? [0.9, 1.1] : [
    maxValue > 100 ? Math.round(minWithPadding / 10) * 10 : Math.round(minWithPadding),
    maxValue > 100 ? Math.round(maxWithPadding / 10) * 10 : Math.round(maxWithPadding)
  ];
  
  // Calculate intelligent tick interval with 4G adaptive logic
  const range = yAxisDomain[1] - yAxisDomain[0];
  const getTickInterval = (range: number, chartType: string) => {
    if (chartType === 'total_5g_data_daily') return 0.1;
    if (chartType === 'total_4g_data_daily') {
      if (range <= 1) return 0.1;
      if (range <= 5) return 0.5;
      if (range <= 10) return 1;
      if (range <= 50) return 5;
      if (range <= 100) return 10;
      return 50;
    }
    if (range <= 10) return 1;
    if (range <= 50) return 5;
    if (range <= 100) return 10;
    if (range <= 500) return 50;
    return 100;
  };
  
  const tickInterval = getTickInterval(range, type);
  const tickCount = Math.floor(range / tickInterval) + 1;
  const ticks = Array.from({length: tickCount}, (_, i) => 
    parseFloat((yAxisDomain[0] + i * tickInterval).toFixed(2))
  );

  const unit = (type === 'total_5g_data_daily' || type === 'total_4g_data_daily') ? 'PB' : 'TB';

  return (
    <div style={{ width: '100%', height: '100%', isolation: 'isolate' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id={`${type}Gradient`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={
                type === 'total_5g_data_daily' ? RAKUTEN_COLORS.yellow : 
                type === 'total_4g_data_daily' ? RAKUTEN_COLORS.amber : 
                RAKUTEN_COLORS.green
              }/>
              <stop offset="100%" stopColor={RAKUTEN_COLORS.blue}/>
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
            ticks={ticks}
            tickFormatter={(value) => {
              if (type === 'total_5g_data_daily') return value.toFixed(2);
              if (type === 'total_4g_data_daily') {
                return maxValue > 100 ? Math.round(value).toString() : value.toFixed(2);
              }
              return value < 10 ? value.toFixed(2) : Math.round(value).toString();
            }}
            tick={{ fontSize: 12, fill: '#666' }} 
            stroke="#666"
            strokeWidth={1}
            tickLine={false}
            axisLine={{ stroke: '#ddd', strokeWidth: 1 }}
            label={{ 
              value: `Traffic (${unit})`, 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fontSize: '12px', fill: '#666' }
            }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={`url(#${type}Gradient)`}
            strokeWidth={4}
            dot={{ 
              fill: type === 'total_5g_data_daily' ? RAKUTEN_COLORS.yellow : 
                    type === 'total_4g_data_daily' ? RAKUTEN_COLORS.amber : 
                    RAKUTEN_COLORS.green, 
              strokeWidth: 3, 
              r: 7,
              stroke: '#fff'
            }}
            activeDot={{ 
              r: 9, 
              stroke: type === 'total_5g_data_daily' ? RAKUTEN_COLORS.yellow : 
                      type === 'total_4g_data_daily' ? RAKUTEN_COLORS.amber : 
                      RAKUTEN_COLORS.green, 
              strokeWidth: 3,
              fill: '#fff'
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