import { db } from './database';

export interface TrafficGrowthData {
  month: number;
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
    // Return mock data for now to test the flow
    console.log('📊 DB - Returning mock traffic data');
    return [
      { month: 5, year: 2025, totalTraffic: 242164818, normalizedTraffic: 7811768, deltaPercentage: null },
      { month: 6, year: 2025, totalTraffic: 234641470, normalizedTraffic: 7821382, deltaPercentage: 0.12 },
      { month: 7, year: 2025, totalTraffic: 257859685, normalizedTraffic: 8318054, deltaPercentage: 6.35 }
    ];
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
    // Test basic connection first
    console.log('📊 DB - Testing connection...');
    await db`SELECT 1 as test`;
    console.log('📊 DB - Connection test passed');
    
    // Check if tables exist
    console.log('📊 DB - Checking tables...');
    const tables = await db`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('ul_dl_traffic_data', 'monthly_traffic_data')
    `;
    console.log('📊 DB - Available tables:', tables);
    
    // Return mock data for now
    return {
      totalTrafficJuly: 257859685,
      normalizedTrafficJuly: 8318054,
      growthRate: 6.35
    };
  } catch (error) {
    console.error('📊 DB - Query error:', error);
    throw error;
  }
}