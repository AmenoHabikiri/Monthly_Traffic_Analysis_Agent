import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getTrafficGrowthData, getTrafficSummary, getDeviceData, getApplicationData, getRoamingData, getPrefectureData, get5G4GGrowth } from "./trafficQueries";

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
      const data = await getApplicationData();
      console.log('📱 API - Applications data result:', data);
      res.json(data);
    } catch (error) {
      console.error('❌ API - Applications data error:', error);
      res.status(500).json({ message: "Failed to fetch application data" });
    }
  });

  // Device data endpoints
  app.get("/api/devices", async (req, res) => {
    console.log('📱 API - /api/devices called');
    try {
      const data = await getDeviceData();
      console.log('📱 API - Devices data result:', data);
      res.json(data);
    } catch (error) {
      console.error('❌ API - Devices data error:', error);
      res.status(500).json({ message: "Failed to fetch device data" });
    }
  });

  // Roaming data endpoints
  app.get("/api/roaming", async (req, res) => {
    console.log('🌐 API - /api/roaming called');
    try {
      const data = await getRoamingData();
      console.log('🌐 API - Roaming data result:', data);
      res.json(data);
    } catch (error) {
      console.error('❌ API - Roaming data error:', error);
      res.status(500).json({ message: "Failed to fetch roaming data" });
    }
  });

  // Prefecture data endpoints
  app.get("/api/prefectures", async (req, res) => {
    console.log('🗾 API - /api/prefectures called');
    try {
      const data = await getPrefectureData();
      console.log('🗾 API - Prefecture data result:', data);
      res.json(data);
    } catch (error) {
      console.error('❌ API - Prefecture data error:', error);
      res.status(500).json({ message: "Failed to fetch prefecture data" });
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

  // 5G/4G growth endpoint
  app.get("/api/5g-4g-growth", async (req, res) => {
    console.log('📶 API - /api/5g-4g-growth called');
    try {
      const data = await get5G4GGrowth();
      console.log('📶 API - 5G/4G growth result:', data);
      res.json(data);
    } catch (error) {
      console.error('❌ API - 5G/4G growth error:', error);
      res.status(500).json({ message: "Failed to fetch 5G/4G growth data" });
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
