import { db } from './database';
import { trafficData, applicationData, deviceData, networkMetrics } from '@shared/schema';
import { processTrafficData, processApplicationData, processDeviceData, processNetworkMetrics } from '@/lib/csvParser';
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
      const trafficCsv = readFileSync(join(csvDir, 'traffic_growth.csv'), 'utf-8');
      const processedTraffic = processTrafficData(trafficCsv);
      for (const traffic of processedTraffic) {
        await this.insertTrafficData(traffic);
      }

      // Application data
      const appCsv = readFileSync(join(csvDir, 'application_ranking.csv'), 'utf-8');
      const processedApps = processApplicationData(appCsv);
      for (const app of processedApps) {
        await this.insertApplicationData(app);
      }

      // Device data
      const deviceCsv = readFileSync(join(csvDir, 'device_ranking.csv'), 'utf-8');
      const processedDevices = processDeviceData(deviceCsv);
      for (const device of processedDevices) {
        await this.insertDeviceData(device);
      }

      // Network metrics
      const networkCsv = readFileSync(join(csvDir, 'network_metrics.csv'), 'utf-8');
      const processedNetwork = processNetworkMetrics(networkCsv);
      for (const metric of processedNetwork) {
        await this.insertNetworkMetrics(metric);
      }

      console.log('Database initialized with CSV data');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }
}