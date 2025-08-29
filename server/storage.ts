import { type TrafficData, type ApplicationData, type DeviceData, type NetworkMetrics, type InsertTrafficData, type InsertApplicationData, type InsertDeviceData, type InsertNetworkMetrics } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Traffic data methods
  getTrafficData(): Promise<TrafficData[]>;
  insertTrafficData(data: InsertTrafficData): Promise<TrafficData>;
  
  // Application data methods
  getApplicationData(): Promise<ApplicationData[]>;
  insertApplicationData(data: InsertApplicationData): Promise<ApplicationData>;
  
  // Device data methods
  getDeviceData(): Promise<DeviceData[]>;
  insertDeviceData(data: InsertDeviceData): Promise<DeviceData>;
  
  // Network metrics methods
  getNetworkMetrics(): Promise<NetworkMetrics[]>;
  insertNetworkMetrics(data: InsertNetworkMetrics): Promise<NetworkMetrics>;
  
  // Initialize with CSV data
  initializeData(): Promise<void>;
}

export class MemStorage implements IStorage {
  private trafficData: Map<string, TrafficData>;
  private applicationData: Map<string, ApplicationData>;
  private deviceData: Map<string, DeviceData>;
  private networkMetrics: Map<string, NetworkMetrics>;

  constructor() {
    this.trafficData = new Map();
    this.applicationData = new Map();
    this.deviceData = new Map();
    this.networkMetrics = new Map();
  }

  async getTrafficData(): Promise<TrafficData[]> {
    return Array.from(this.trafficData.values());
  }

  async insertTrafficData(insertData: InsertTrafficData): Promise<TrafficData> {
    const id = randomUUID();
    const data: TrafficData = { ...insertData as any, id };
    this.trafficData.set(id, data);
    return data;
  }

  async getApplicationData(): Promise<ApplicationData[]> {
    return Array.from(this.applicationData.values());
  }

  async insertApplicationData(insertData: InsertApplicationData): Promise<ApplicationData> {
    const id = randomUUID();
    const data: ApplicationData = { ...insertData as any, id };
    this.applicationData.set(id, data);
    return data;
  }

  async getDeviceData(): Promise<DeviceData[]> {
    return Array.from(this.deviceData.values());
  }

  async insertDeviceData(insertData: InsertDeviceData): Promise<DeviceData> {
    const id = randomUUID();
    const data: DeviceData = { ...insertData as any, id };
    this.deviceData.set(id, data);
    return data;
  }

  async getNetworkMetrics(): Promise<NetworkMetrics[]> {
    return Array.from(this.networkMetrics.values());
  }

  async insertNetworkMetrics(insertData: InsertNetworkMetrics): Promise<NetworkMetrics> {
    const id = randomUUID();
    const data: NetworkMetrics = { ...insertData as any, id };
    this.networkMetrics.set(id, data);
    return data;
  }

  async initializeData(): Promise<void> {
    // Initialize with CSV data - Traffic Growth
    await this.insertTrafficData({
      year: 2025,
      month: 5,
      totalTraffic: 242164818.68931866,
      normalizedTraffic: 7811768.344816731,
      deltaPercentage: null,
      totalDlVol: 220863318,
      totalUlVol: 21301500.66,
      dlUlRatio: 10.36843937
    });

    await this.insertTrafficData({
      year: 2025,
      month: 6,
      totalTraffic: 234641470.82363397,
      normalizedTraffic: 7821382.360787799,
      deltaPercentage: 0.12307093025161785,
      totalDlVol: 214189757.2,
      totalUlVol: 20451713.66,
      dlUlRatio: 10.47294915
    });

    await this.insertTrafficData({
      year: 2025,
      month: 7,
      totalTraffic: 257859685.77365103,
      normalizedTraffic: 8318054.379795195,
      deltaPercentage: 6.350182053462085,
      totalDlVol: 235187074.5,
      totalUlVol: 22672611.24,
      dlUlRatio: 10.37317987
    });

    // Initialize application data - Top applications for each month
    const applications = [
      { name: "YouTube", type: "Streaming Applications", may: 1147365.6974193552, june: 1016596.9783333335, july: 1304984.082903226 },
      { name: "Tik Tok", type: "Streaming Applications", may: 621290.0670967741, june: 563143.1319999999, july: 755711.4974193547 },
      { name: "Instagram", type: "Social Media Applications", may: 465110.0038709678, june: 419735.64933333336, july: 557585.9477419353 },
      { name: "HTTPS", type: "Web Applications", may: 347953.89032258064, june: 310209.05799999996, july: 398643.2870967741 },
      { name: "Quic Obfuscated", type: "Web Applications", may: 279123.7435483871, june: 253275.10933333336, july: 294571.77258064516 }
    ];

    for (let i = 0; i < applications.length; i++) {
      const app = applications[i];
      await this.insertApplicationData({ year: 2025, month: 5, rank: i + 1, application: app.name, applicationType: app.type, dataVolume: app.may });
      await this.insertApplicationData({ year: 2025, month: 6, rank: i + 1, application: app.name, applicationType: app.type, dataVolume: app.june });
      await this.insertApplicationData({ year: 2025, month: 7, rank: i + 1, application: app.name, applicationType: app.type, dataVolume: app.july });
    }

    // Initialize device data - Top devices for each month
    const devices = [
      { name: "Apple iPhone 15 (A3089)", may: 297721.442989908, june: 373243.8653704641, july: 391880.50218456896 },
      { name: "Rakuten WiFi Pocket 2C", may: 339926.1830764979, june: 400222.70996156713, july: 376580.8252005202 },
      { name: "R2314M-JP", may: 309012.0322392574, june: 368295.77691721293, july: 357337.21740722633 },
      { name: "Apple iPhone 14 (A2881)", may: 243389.35803613244, june: 296459.1049773182, july: 302873.3528515629 },
      { name: "Rakuten WiFi Pocket Platinum", may: 219789.55751399722, june: 286547.3315681705, july: 302808.97670410166 }
    ];

    for (let i = 0; i < devices.length; i++) {
      const device = devices[i];
      await this.insertDeviceData({ year: 2025, month: 5, rank: i + 1, device: device.name, dataVolume: device.may });
      await this.insertDeviceData({ year: 2025, month: 6, rank: i + 1, device: device.name, dataVolume: device.june });
      await this.insertDeviceData({ year: 2025, month: 7, rank: i + 1, device: device.name, dataVolume: device.july });
    }

    // Initialize network metrics
    const metrics = [
      { factor: "Working Day", may: 6539428.66, june: 5826808.57, july: 7573382.26 },
      { factor: "Holiday", may: 7391175.58, june: 6677040.48, july: 8295456.8 },
      { factor: "total_4g_data_daily", may: 6583912.65, june: 6078405.99, july: 6662765.7 },
      { factor: "total_5g_data_daily", may: 928843.44, june: 950295.53, july: 1053260.84 },
      { factor: "B2B", may: 0.48, june: 0.58, july: 0.52 },
      { factor: "B2C", may: 0.92, june: 1.11, july: 1.04 },
      { factor: "KDDI_Roaming", may: 466308.3, june: 507334.67, july: 495385.3 },
      { factor: "IR_Roaming", may: 5084.35, june: 4588.63, july: 4951.24 },
      { factor: "CPE_and_others", may: 6.75, june: 6.59, july: 6.16 }
    ];

    for (const metric of metrics) {
      await this.insertNetworkMetrics({ year: 2025, month: 5, factor: metric.factor, value: metric.may });
      await this.insertNetworkMetrics({ year: 2025, month: 6, factor: metric.factor, value: metric.june });
      await this.insertNetworkMetrics({ year: 2025, month: 7, factor: metric.factor, value: metric.july });
    }
  }
}

export const storage = new MemStorage();
