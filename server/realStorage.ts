import { db } from './database';
import { trafficData, applicationData, deviceData, networkMetrics } from '@shared/schema';
import { parseCSV, processTrafficMetrics, processApplicationData, processDeviceData, processNetworkMetrics } from '../client/src/lib/csvParser';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { IStorage } from './storage';

export class DatabaseStorage implements IStorage {
  async getTrafficData() {
    return await db.select().from(trafficData);
  }

  async insertTrafficData(data: any) {
    const [result] = await db.insert(trafficData).values(data).returning();
    return result;
  }

  async getApplicationData() {
    return await db.select().from(applicationData);
  }

  async insertApplicationData(data: any) {
    const [result] = await db.insert(applicationData).values(data).returning();
    return result;
  }

  async getDeviceData() {
    return await db.select().from(deviceData);
  }

  async insertDeviceData(data: any) {
    const [result] = await db.insert(deviceData).values(data).returning();
    return result;
  }

  async getNetworkMetrics() {
    return await db.select().from(networkMetrics);
  }

  async insertNetworkMetrics(data: any) {
    const [result] = await db.insert(networkMetrics).values(data).returning();
    return result;
  }

  async initializeData() {
    try {
      // Check if data already exists
      const existingTraffic = await this.getTrafficData();
      if (existingTraffic.length > 0) {
        console.log('Data already initialized');
        return;
      }

      // Process CSV files
      const csvDir = join(process.cwd(), 'attached_assets');
      
      // Traffic data
      const trafficCsv = readFileSync(join(csvDir, 'CalculatedMetrics_202508201053_1756447015744.csv'), 'utf-8');
      const trafficRows = parseCSV(trafficCsv);
      const processedTraffic = processTrafficMetrics(trafficRows);
      for (const traffic of processedTraffic) {
        await this.insertTrafficData(traffic);
      }

      // For now, skip other CSV files if they don't exist
      console.log('Traffic data loaded. Other CSV files can be added later.');

      console.log('Database initialized with CSV data');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }
}