import { db } from './database';

export interface TrafficGrowthData {
  month: string;
  year: number;
  totalTraffic: number;
  normalizedTraffic: number;
  deltaPercentage: number | null;
}

export async function getTrafficGrowthData(): Promise<TrafficGrowthData[]> {
  console.log('📊 DB - getTrafficGrowthData called');
  
  if (!db) {
    throw new Error('Database not connected');
  }

  try {
    console.log('📊 DB - Executing your actual query...');
    const result = await db`
      SELECT 
    u.agg_year AS year,
    TRIM(TO_CHAR(TO_DATE(u.agg_month::text, 'MM'), 'Month')) AS month,
    u.total_dl_vol_gb_monthly AS total_dl_traffic,
    u.total_ul_vol_gb_monthly AS total_ul_traffic,
    u.total_traffic,
    u.dl_ul_ratio AS ul_dl_ratio,
    m.total_normalized_traffic,
    m.delta_percentage
FROM ul_dl_traffic_data u
JOIN monthly_traffic_data m
    ON u.agg_year = m.year
   AND u.agg_month = m.month;

    `;
    
    console.log('📊 DB - Raw query result:', result);
    
    const mappedResult = result.map((row: any) => ({
      year: parseInt(row.year),
      month: row.month, // Keep as string now
      totalTraffic: parseFloat(row.total_traffic || 0),
      normalizedTraffic: parseFloat(row.total_normalized_traffic || 0),
      deltaPercentage: row.delta_percentage ? parseFloat(row.delta_percentage) : null
    }));
    
    console.log('📊 DB - Mapped result:', mappedResult);
    return mappedResult;
  } catch (error) {
    console.error('📊 DB - Traffic query error:', error);
    throw error;
  }
}

export async function getTrafficSummary() {
  console.log('📊 DB - getTrafficSummary called');
  
  if (!db) {
    throw new Error('Database not connected');
  }

  try {
    const result = await db`
      SELECT 
        SUM(CASE WHEN m.month = 7 THEN u.total_traffic ELSE 0 END) as july_traffic,
        SUM(CASE WHEN m.month = 6 THEN u.total_traffic ELSE 0 END) as june_traffic,
        AVG(CASE WHEN m.month = 7 THEN m.total_normalized_traffic ELSE NULL END) as july_normalized
      FROM ul_dl_traffic_data u
      JOIN monthly_traffic_data m ON u.agg_year = m.year AND u.agg_month = m.month
      WHERE m.month IN (6, 7)
    `;

    const row = result[0];
    const julyTraffic = parseFloat(row.july_traffic || 0);
    const juneTraffic = parseFloat(row.june_traffic || 0);
    const growthRate = juneTraffic > 0 ? ((julyTraffic - juneTraffic) / juneTraffic) * 100 : 0;

    return {
      totalTrafficJuly: julyTraffic,
      normalizedTrafficJuly: parseFloat(row.july_normalized || 0),
      growthRate: growthRate
    };
  } catch (error) {
    console.error('📊 DB - Query error:', error);
    throw error;
  }
}