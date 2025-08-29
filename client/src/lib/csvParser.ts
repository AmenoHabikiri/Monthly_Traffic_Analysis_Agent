// Utility functions for parsing and processing CSV data for analytics

export interface CSVRow {
  [key: string]: string | number;
}

export interface ProcessedTrafficData {
  month: number;
  year: number;
  totalTraffic: number;
  normalizedTraffic: number;
  deltaPercentage: number | null;
  totalDlVol?: number;
  totalUlVol?: number;
  dlUlRatio?: number;
}

export interface ProcessedApplicationData {
  rank: number;
  application: string;
  applicationType: string;
  dataVolume: number;
  month: number;
  year: number;
}

export interface ProcessedDeviceData {
  rank: number;
  device: string;
  dataVolume: number;
  month: number;
  year: number;
}

export interface ProcessedNetworkMetrics {
  factor: string;
  value: number;
  month: number;
  year: number;
}

/**
 * Parse CSV string into array of objects
 */
export function parseCSV(csvString: string): CSVRow[] {
  const lines = csvString.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  const rows: CSVRow[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
    if (values.length === headers.length) {
      const row: CSVRow = {};
      headers.forEach((header, index) => {
        const value = values[index];
        // Try to parse as number, fallback to string
        row[header] = isNaN(Number(value)) ? value : Number(value);
      });
      rows.push(row);
    }
  }
  
  return rows;
}

/**
 * Process traffic metrics CSV data
 */
export function processTrafficMetrics(csvData: CSVRow[]): ProcessedTrafficData[] {
  return csvData.map(row => ({
    year: Number(row.year || row.agg_year),
    month: Number(row.month || row.agg_month),
    totalTraffic: Number(row.total_traffic),
    normalizedTraffic: Number(row.total_normalized_traffic || Number(row.total_traffic) / 30), // Approximate if not available
    deltaPercentage: row.delta_percentage ? Number(row.delta_percentage) : null,
    totalDlVol: row.total_dl_vol_gb_monthly ? Number(row.total_dl_vol_gb_monthly) : undefined,
    totalUlVol: row.total_ul_vol_gb_monthly ? Number(row.total_ul_vol_gb_monthly) : undefined,
    dlUlRatio: row.dl_ul_ratio ? Number(row.dl_ul_ratio) : undefined
  }));
}

/**
 * Process application rankings CSV data
 */
export function processApplicationData(csvData: CSVRow[]): ProcessedApplicationData[] {
  const processed: ProcessedApplicationData[] = [];
  
  csvData.forEach(row => {
    const year = Number(row.year);
    const rank = Number(row.rank_by_daily_volume);
    
    // Process each month's data
    for (let month = 5; month <= 7; month++) {
      const monthKey = month.toString().padStart(2, '0');
      const appKey = `Month ${monthKey} Application`;
      const typeKey = `Month ${monthKey} Application Type`;
      const dataKey = `Month ${monthKey} Data`;
      
      if (row[appKey] && row[dataKey]) {
        processed.push({
          year,
          rank,
          month,
          application: String(row[appKey]),
          applicationType: String(row[typeKey] || 'Unknown'),
          dataVolume: Number(row[dataKey])
        });
      }
    }
  });
  
  return processed.sort((a, b) => a.month - b.month || a.rank - b.rank);
}

/**
 * Process device rankings CSV data
 */
export function processDeviceData(csvData: CSVRow[]): ProcessedDeviceData[] {
  const processed: ProcessedDeviceData[] = [];
  
  csvData.forEach(row => {
    const year = Number(row.year);
    const rank = Number(row.rank_by_data_volume);
    
    // Process each month's data
    for (let month = 5; month <= 7; month++) {
      const monthKey = month.toString().padStart(2, '0');
      const deviceKey = `Month ${monthKey} Device`;
      const dataKey = `Month ${monthKey} Data`;
      
      if (row[deviceKey] && row[dataKey]) {
        processed.push({
          year,
          rank,
          month,
          device: String(row[deviceKey]),
          dataVolume: Number(row[dataKey])
        });
      }
    }
  });
  
  return processed.sort((a, b) => a.month - b.month || a.rank - b.rank);
}

/**
 * Process network metrics CSV data
 */
export function processNetworkMetrics(csvData: CSVRow[]): ProcessedNetworkMetrics[] {
  const processed: ProcessedNetworkMetrics[] = [];
  
  csvData.forEach(row => {
    const year = Number(row.year);
    const factor = String(row.Factor);
    
    // Process each month's data
    for (let month = 5; month <= 7; month++) {
      const monthKey = month.toString().padStart(2, '0');
      const dataKey = `Month_${monthKey}_Data`;
      
      if (row[dataKey] !== undefined && row[dataKey] !== '') {
        processed.push({
          year,
          month,
          factor,
          value: Number(row[dataKey])
        });
      }
    }
  });
  
  return processed.sort((a, b) => a.month - b.month);
}

/**
 * Calculate growth percentage between two values
 */
export function calculateGrowthPercentage(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Format large numbers for display
 */
export function formatLargeNumber(value: number, unit: string = ''): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M ${unit}`.trim();
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K ${unit}`.trim();
  }
  return `${value.toFixed(1)} ${unit}`.trim();
}

/**
 * Get month name from month number
 */
export function getMonthName(month: number, year: number): string {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${monthNames[month - 1]} ${year}`;
}

/**
 * Calculate rankings and detect significant changes
 */
export function detectRankingChanges<T extends { rank: number; month: number }>(
  data: T[], 
  compareMonths: [number, number]
): Array<T & { rankChange: number; significantChange: boolean }> {
  const [prevMonth, currentMonth] = compareMonths;
  
  const prevData = data.filter(d => d.month === prevMonth);
  const currentData = data.filter(d => d.month === currentMonth);
  
  return currentData.map(current => {
    const previous = prevData.find(p => 
      'application' in current && 'application' in p ? 
        (current as any).application === (p as any).application :
        'device' in current && 'device' in p ?
          (current as any).device === (p as any).device :
          false
    );
    
    const rankChange = previous ? previous.rank - current.rank : 0;
    const significantChange = Math.abs(rankChange) >= 2;
    
    return {
      ...current,
      rankChange,
      significantChange
    };
  });
}

/**
 * Aggregate data by time period
 */
export function aggregateByPeriod<T extends { month: number; year: number }>(
  data: T[],
  groupBy: 'month' | 'quarter' = 'month'
): Record<string, T[]> {
  return data.reduce((acc, item) => {
    let key: string;
    
    if (groupBy === 'month') {
      key = `${item.year}-${item.month.toString().padStart(2, '0')}`;
    } else {
      const quarter = Math.ceil(item.month / 3);
      key = `${item.year}-Q${quarter}`;
    }
    
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    
    return acc;
  }, {} as Record<string, T[]>);
}

/**
 * Filter data for specific date range
 */
export function filterDateRange<T extends { month: number; year: number }>(
  data: T[],
  startYear: number,
  startMonth: number,
  endYear: number,
  endMonth: number
): T[] {
  return data.filter(item => {
    const itemDate = item.year * 12 + item.month;
    const startDate = startYear * 12 + startMonth;
    const endDate = endYear * 12 + endMonth;
    
    return itemDate >= startDate && itemDate <= endDate;
  });
}
