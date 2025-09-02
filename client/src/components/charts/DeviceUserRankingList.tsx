import type { DeviceMetrics } from '@/types/analytics';
import { RAKUTEN_COLORS } from '@/data/csvData';

interface DeviceUserRankingListProps {
  data: DeviceMetrics[];
  type: 'absolute' | 'percentage';
}

export default function DeviceUserRankingList({ data, type }: DeviceUserRankingListProps) {
  // Mock user count data since it's not in the current schema
  const mockUserData = data.slice(0, 10).map((device, index) => ({
    device: device.device.replace(/\s*\([^)]*\)/g, '').substring(0, 20),
    userCount: Math.floor(Math.random() * 50000) + 10000,
    growthPercentage: (Math.random() - 0.5) * 40
  })).sort((a, b) => type === 'absolute' ? b.userCount - a.userCount : b.growthPercentage - a.growthPercentage);

  return (
    <div className="space-y-3">
      {mockUserData.map((device, index) => (
        <div key={device.device} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: Object.values(RAKUTEN_COLORS)[index % Object.values(RAKUTEN_COLORS).length] }}
            >
              {index + 1}
            </div>
            <span className="text-sm font-medium">{device.device}</span>
          </div>
          <div className="text-right">
            {type === 'absolute' ? (
              <span className="text-sm font-semibold">{device.userCount.toLocaleString()}</span>
            ) : (
              <span 
                className="text-sm font-semibold"
                style={{ color: device.growthPercentage > 0 ? RAKUTEN_COLORS.green : RAKUTEN_COLORS.red }}
              >
                {device.growthPercentage > 0 ? '+' : ''}{device.growthPercentage.toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}