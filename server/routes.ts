import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize data from CSV files
  await storage.initializeData();

  // Traffic data endpoints
  app.get("/api/traffic", async (req, res) => {
    try {
      const data = await storage.getTrafficData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch traffic data" });
    }
  });

  // Application data endpoints
  app.get("/api/applications", async (req, res) => {
    try {
      const data = await storage.getApplicationData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch application data" });
    }
  });

  // Device data endpoints
  app.get("/api/devices", async (req, res) => {
    try {
      const data = await storage.getDeviceData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch device data" });
    }
  });

  // Network metrics endpoints
  app.get("/api/network-metrics", async (req, res) => {
    try {
      const data = await storage.getNetworkMetrics();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch network metrics" });
    }
  });

  // Analytics summary endpoint
  app.get("/api/analytics/summary", async (req, res) => {
    try {
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
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics summary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
