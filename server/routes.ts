import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getTrafficGrowthData, getTrafficSummary } from "./trafficQueries";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize mock data if no database
  if (!process.env.DATABASE_URL) {
    await storage.initializeData();
  }

  // Traffic data endpoints
  app.get("/api/traffic", async (req, res) => {
    console.log('🚗 API - /api/traffic called');
    console.log('🚗 API - DATABASE_URL exists:', !!process.env.DATABASE_URL);
    try {
      const data = process.env.DATABASE_URL ? 
        await getTrafficGrowthData() : 
        await storage.getTrafficData();
      console.log('🚗 API - Traffic data result:', data);
      res.json(data);
    } catch (error) {
      console.error('❌ API - Traffic data error:', error);
      res.status(500).json({ message: "Failed to fetch traffic data" });
    }
  });

  // Application data endpoints
  app.get("/api/applications", async (req, res) => {
    console.log('📱 API - /api/applications called');
    try {
      const data = process.env.DATABASE_URL ? 
        [] : // Return empty array for now
        await storage.getApplicationData();
      console.log('📱 API - Applications data result:', data);
      res.json(data);
    } catch (error) {
      console.error('❌ API - Applications data error:', error);
      res.status(500).json({ message: "Failed to fetch application data" });
    }
  });

  // Device data endpoints
  app.get("/api/devices", async (req, res) => {
    try {
      const data = await realStorage.getDeviceData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch device data" });
    }
  });

  // Network metrics endpoints
  app.get("/api/network-metrics", async (req, res) => {
    try {
      const data = await realStorage.getNetworkMetrics();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch network metrics" });
    }
  });

  // Analytics summary endpoint
  app.get("/api/analytics/summary", async (req, res) => {
    console.log('🔍 API - /api/analytics/summary called');
    console.log('🔍 API - DATABASE_URL exists:', !!process.env.DATABASE_URL);
    try {
      if (process.env.DATABASE_URL) {
        console.log('🔍 API - Using real database');
        const summary = await getTrafficSummary();
        console.log('🔍 API - Summary result:', summary);
        res.json(summary);
      } else {
        console.log('🔍 API - Using mock data');
        const traffic = await storage.getTrafficData();
        const applications = await storage.getApplicationData();
        const devices = await storage.getDeviceData();
        const metrics = await storage.getNetworkMetrics();
        
        const julyTraffic = traffic.find(t => t.month === 7);
        const juneTraffic = traffic.find(t => t.month === 6);
        
        const growthRate = julyTraffic && juneTraffic ? 
          ((julyTraffic.totalTraffic - juneTraffic.totalTraffic) / juneTraffic.totalTraffic * 100) : 0;

        const summary = {
          totalTrafficJuly: julyTraffic?.totalTraffic || 0,
          normalizedTrafficJuly: julyTraffic?.normalizedTraffic || 0,
          growthRate: growthRate,
          topApplications: applications.filter(a => a.month === 7).slice(0, 3),
          topDevices: devices.filter(d => d.month === 7).slice(0, 3),
          fiveGMetrics: metrics.filter(m => m.month === 7 && m.factor.includes('5g')),
        };
        
        res.json(summary);
      }
    } catch (error) {
      console.error('Analytics summary error:', error);
      res.status(500).json({ message: "Failed to fetch analytics summary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
