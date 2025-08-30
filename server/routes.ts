import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getTrafficGrowthData, getTrafficSummary } from "./trafficQueries";

export async function registerRoutes(app: Express): Promise<Server> {
  // No mock data initialization

  // Traffic data endpoints
  app.get("/api/traffic", async (req, res) => {
    console.log('🚗 API - /api/traffic called');
    try {
      const data = await getTrafficGrowthData();
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
      res.json([]);
    } catch (error) {
      console.error('❌ API - Applications data error:', error);
      res.status(500).json({ message: "Failed to fetch application data" });
    }
  });

  // Device data endpoints
  app.get("/api/devices", async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch device data" });
    }
  });

  // Network metrics endpoints
  app.get("/api/network-metrics", async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch network metrics" });
    }
  });

  // Analytics summary endpoint
  app.get("/api/analytics/summary", async (req, res) => {
    console.log('🔍 API - /api/analytics/summary called');
    try {
      const summary = await getTrafficSummary();
      console.log('🔍 API - Summary result:', summary);
      res.json(summary);
    } catch (error) {
      console.error('❌ API - Analytics summary error:', error);
      res.status(500).json({ message: "Failed to fetch analytics summary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
