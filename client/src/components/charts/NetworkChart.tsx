import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import type { NetworkMetrics } from '@/types/analytics';
import { RAKUTEN_COLORS, MONTHS } from '@/data/csvData';

interface NetworkChartProps {
  data: NetworkMetrics[];
  type: 'holiday-workday' | '4g-5g' | 'b2b-b2c' | 'misc';
  isPercentageView: boolean;
}

export default function NetworkChart({ data, type, isPercentageView }: NetworkChartProps) {
  const chartData = [5, 6, 7].map(month => {
    const monthData: any = { month: MONTHS[month - 5] };
    
    if (type === 'holiday-workday') {
      const workingDay = data.find(d => d.month === month && d.factor === 'Working Day');
      const holiday = data.find(d => d.month === month && d.factor === 'Holiday');
      
      if (workingDay && holiday) {
        if (isPercentageView && month > 5) {
          const prevWorking = data.find(d => d.month === month - 1 && d.factor === 'Working Day');
          const prevHoliday = data.find(d => d.month === month - 1 && d.factor === 'Holiday');
          if (prevWorking && prevHoliday) {
            monthData['Working Day'] = ((workingDay.value - prevWorking.value) / prevWorking.value * 100);
            monthData['Holiday'] = ((holiday.value - prevHoliday.value) / prevHoliday.value * 100);
          }
        } else {
          monthData['Working Day'] = workingDay.value / 1000000; // GB
          monthData['Holiday'] = holiday.value / 1000000; // GB
        }
      }
    } else if (type === '4g-5g') {
      const fourG = data.find(d => d.month === month && d.factor === 'total_4g_data_daily');
      const fiveG = data.find(d => d.month === month && d.factor === 'total_5g_data_daily');
      
      if (fourG && fiveG) {
        if (isPercentageView && month > 5) {
          const prev4G = data.find(d => d.month === month - 1 && d.factor === 'total_4g_data_daily');
          const prev5G = data.find(d => d.month === month - 1 && d.factor === 'total_5g_data_daily');
          if (prev4G && prev5G) {
            monthData['4G Traffic'] = ((fourG.value - prev4G.value) / prev4G.value * 100);
            monthData['5G Traffic'] = ((fiveG.value - prev5G.value) / prev5G.value * 100);
          }
        } else {
          monthData['4G Traffic'] = fourG.value / 1000000; // GB
          monthData['5G Traffic'] = fiveG.value / 1000000; // GB
        }
      }
    } else if (type === 'b2b-b2c') {
      const b2b = data.find(d => d.month === month && d.factor === 'B2B');
      const b2c = data.find(d => d.month === month && d.factor === 'B2C');
      
      if (b2b && b2c) {
        monthData['B2B'] = b2b.value;
        monthData['B2C'] = b2c.value;
      }
    }
    
    return monthData;
  });

  if (type === 'misc') {
    const miscData = data
      .filter(d => d.month === 7 && ['KDDI_Roaming', 'IR_Roaming', 'CPE_and_others'].includes(d.factor))
      .map(d => ({
        name: d.factor.replace(/_/g, ' '),
        value: d.value / 1000000 // Convert to GB
      }));

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={miscData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label
          >
            {miscData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={Object.values(RAKUTEN_COLORS)[index]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
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
            value: isPercentageView ? 'Growth (%)' : 'Usage (GB/day)', 
            angle: -90, 
            position: 'insideLeft' 
          }}
        />
        <Legend />
        {Object.keys(chartData[0] || {}).filter(key => key !== 'month').map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={Object.values(RAKUTEN_COLORS)[index % Object.values(RAKUTEN_COLORS).length]}
            stroke={Object.values(RAKUTEN_COLORS)[index % Object.values(RAKUTEN_COLORS).length]}
            strokeWidth={2}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
