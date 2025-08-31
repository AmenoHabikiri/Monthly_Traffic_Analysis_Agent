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

export async function getDeviceData() {
  console.log('📱 DB - getDeviceData called');
  
  if (!db) {
    throw new Error('Database not connected');
  }

  try {
    const result = await db`
      WITH device_data AS (
          SELECT 
              "Month 05 Device" AS device,
              SUM("Month 05 Data") AS data_may,
              0::numeric AS data_june
          FROM public.monthly_device_data
          GROUP BY "Month 05 Device"

          UNION ALL

          SELECT 
              "Month 06 Device" AS device,
              0::numeric AS data_may,
              SUM("Month 06 Data") AS data_june
          FROM public.monthly_device_data
          GROUP BY "Month 06 Device"
      ),
      merged AS (
          SELECT 
              device,
              SUM(data_may) AS data_may,
              SUM(data_june) AS data_june
          FROM device_data
          GROUP BY device
      ),
      growth_calc AS (
          SELECT
              device,
              data_may,
              data_june,
              CASE 
                  WHEN data_may = 0 THEN NULL
                  ELSE ROUND(((data_june - data_may) / data_may) * 100, 2)
              END AS growth_percentage
          FROM merged
      )
      SELECT 
          device,
          data_may,
          data_june,
          growth_percentage
      FROM growth_calc
      ORDER BY growth_percentage DESC NULLS LAST
      LIMIT 5
    `;
    
    return result.map((row: any) => ({
      device: row.device,
      dataMay: parseFloat(row.data_may || 0),
      dataJune: parseFloat(row.data_june || 0),
      growthPercentage: row.growth_percentage ? parseFloat(row.growth_percentage) : null
    }));
  } catch (error) {
    console.error('📱 DB - Device query error:', error);
    throw error;
  }
}

export async function getApplicationData() {
  console.log('📱 DB - getApplicationData called');
  
  if (!db) {
    throw new Error('Database not connected');
  }

  try {
    const result = await db`
      WITH app_data AS (
          SELECT 
              "Month 06 Application" AS app,
              SUM("Month 06 Data") AS data_june,
              0::numeric AS data_july
          FROM public.monthly_application_data
          GROUP BY "Month 06 Application"

          UNION ALL

          SELECT 
              "Month 07 Application" AS app,
              0::numeric AS data_june,
              SUM("Month 07 Data") AS data_july
          FROM public.monthly_application_data
          GROUP BY "Month 07 Application"
      ),
      merged AS (
          SELECT 
              app,
              SUM(data_june) AS data_june,
              SUM(data_july) AS data_july
          FROM app_data
          GROUP BY app
      ),
      growth_calc AS (
          SELECT
              app,
              data_june,
              data_july,
              CASE 
                  WHEN data_june = 0 THEN NULL
                  ELSE ROUND(((data_july - data_june) / data_june) * 100, 2)
              END AS growth_percentage
          FROM merged
      )
      SELECT 
          app,
          data_june,
          data_july,
          growth_percentage
      FROM growth_calc
      WHERE app NOT IN ('GoogleServices', 'HTTPS_Streaming', 'HTTPS')
      ORDER BY growth_percentage DESC NULLS LAST
      LIMIT 5
    `;
    
    return result.map((row: any) => ({
      application: row.app,
      dataJune: parseFloat(row.data_june || 0),
      dataJuly: parseFloat(row.data_july || 0),
      growthPercentage: row.growth_percentage ? parseFloat(row.growth_percentage) : null
    }));
  } catch (error) {
    console.error('📱 DB - Application query error:', error);
    throw error;
  }
}

export async function getRoamingData() {
  console.log('🌐 DB - getRoamingData called');
  
  if (!db) {
    throw new Error('Database not connected');
  }

  try {
    const [irResult, kddiResult, fiveGResult, fourGResult] = await Promise.all([
      db`
        SELECT "year", factor, month_01_data, month_02_data, month_03_data, month_04_data, 
               month_05_data, month_06_data, month_07_data, month_08_data, month_09_data, 
               month_10_data, month_11_data, month_12_data
        FROM public.monthly_factor_data
        WHERE factor = 'IR_Roaming'
      `,
      db`
        SELECT "year", factor, month_01_data, month_02_data, month_03_data, month_04_data, 
               month_05_data, month_06_data, month_07_data, month_08_data, month_09_data, 
               month_10_data, month_11_data, month_12_data
        FROM public.monthly_factor_data
        WHERE factor = 'KDDI_Roaming'
      `,
      db`
        SELECT "year", factor, month_01_data, month_02_data, month_03_data, month_04_data, 
               month_05_data, month_06_data, month_07_data, month_08_data, month_09_data, 
               month_10_data, month_11_data, month_12_data
        FROM monthly_factor_data
        WHERE factor = 'total_5g_data_daily'
      `,
      db`
        SELECT "year", factor, month_01_data, month_02_data, month_03_data, month_04_data, 
               month_05_data, month_06_data, month_07_data, month_08_data, month_09_data, 
               month_10_data, month_11_data, month_12_data
        FROM monthly_factor_data
        WHERE factor = 'total_4g_data_daily'
      `
    ]);
    
    const processRoamingData = (data: any[], factor: string) => {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December'];
      
      return data.flatMap(row => 
        monthNames.map((monthName, index) => {
          const monthKey = `month_${(index + 1).toString().padStart(2, '0')}_data`;
          const value = parseFloat(row[monthKey] || 0);
          return {
            month: monthName,
            year: parseInt(row.year),
            value: (factor === 'total_5g_data_daily' || factor === 'total_4g_data_daily') ? value / 1000000 : value / 1000,
            factor
          };
        })
      ).filter(item => item.value > 0);
    };
    
    return {
      irRoaming: processRoamingData(irResult, 'IR_Roaming'),
      kddiRoaming: processRoamingData(kddiResult, 'KDDI_Roaming'),
      fiveGData: processRoamingData(fiveGResult, 'total_5g_data_daily'),
      fourGData: processRoamingData(fourGResult, 'total_4g_data_daily')
    };
  } catch (error) {
    console.error('🌐 DB - Roaming query error:', error);
    throw error;
  }
}

export async function get5G4GGrowth() {
  console.log('📶 DB - get5G4GGrowth called');
  
  if (!db) {
    throw new Error('Database not connected');
  }

  try {
    const result = await db`
      SELECT 
        factor,
        month_06_data as june_data,
        month_07_data as july_data
      FROM monthly_factor_data
      WHERE factor IN ('total_5g_data_daily', 'total_4g_data_daily')
    `;
    
    const growthData = result.map((row: any) => {
      const juneData = parseFloat(row.june_data || 0);
      const julyData = parseFloat(row.july_data || 0);
      const growthRate = juneData > 0 ? ((julyData - juneData) / juneData) * 100 : 0;
      
      return {
        factor: row.factor,
        juneData: juneData / 1000000, // Convert to PB
        julyData: julyData / 1000000, // Convert to PB
        growthPercentage: parseFloat(growthRate.toFixed(2))
      };
    });
    
    return {
      fiveG: growthData.find(item => item.factor === 'total_5g_data_daily') || null,
      fourG: growthData.find(item => item.factor === 'total_4g_data_daily') || null
    };
  } catch (error) {
    console.error('📶 DB - 5G/4G growth query error:', error);
    throw error;
  }
}

export async function getPrefectureData() {
  console.log('🗾 DB - getPrefectureData called');
  
  if (!db) {
    throw new Error('Database not connected');
  }

  try {
    const result = await db`
      SELECT prefecture, data_volume
      FROM prefecture_data
      ORDER BY data_volume DESC
      LIMIT 5
    `;
    
    return result.map((row: any) => ({
      prefecture: row.prefecture,
      dataVolume: parseFloat(row.data_volume || 0)
    }));
  } catch (error) {
    console.error('🗾 DB - Prefecture query error:', error);
    const dummyData = [
      { prefecture: 'Tokyo', dataVolume: 45.67 },
      { prefecture: 'Osaka', dataVolume: 32.45 },
      { prefecture: 'Kanagawa', dataVolume: 28.91 },
      { prefecture: 'Aichi', dataVolume: 24.33 },
      { prefecture: 'Saitama', dataVolume: 21.78 }
    ];
    const total = dummyData.reduce((sum, item) => sum + item.dataVolume, 0);
    return dummyData.map(item => ({
      prefecture: item.prefecture,
      dataVolume: parseFloat(((item.dataVolume / total) * 100).toFixed(2))
    }));
  }
}