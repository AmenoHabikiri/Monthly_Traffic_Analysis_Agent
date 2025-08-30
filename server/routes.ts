import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { DatabaseStorage } from "./realStorage";

// Use real database if DATABASE_URL is provided
const realStorage = process.env.DATABASE_URL ? new DatabaseStorage() : storage;

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize data from CSV files
  await realStorage.initializeData();

  // Traffic data endpoints
  app.get("/api/traffic", async (req, res) => {
    try {
      const data = await realStorage.getTrafficData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch traffic data" });
    }
  });

  // Application data endpoints
  app.get("/api/applications", async (req, res) => {
    try {
      const data = await realStorage.getApplicationData();
      res.json(data);
    } catch (error) {
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
    try {
      const traffic = await realStorage.getTrafficData();
      const applications = await realStorage.getApplicationData();
      const devices = await realStorage.getDeviceData();
      const metrics = await realStorage.getNetworkMetrics();
      
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
