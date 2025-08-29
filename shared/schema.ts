import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const trafficData = pgTable("traffic_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  year: integer("year").notNull(),
  month: integer("month").notNull(),
  totalTraffic: real("total_traffic").notNull(),
  normalizedTraffic: real("normalized_traffic").notNull(),
  deltaPercentage: real("delta_percentage"),
  totalDlVol: real("total_dl_vol"),
  totalUlVol: real("total_ul_vol"),
  dlUlRatio: real("dl_ul_ratio"),
});

export const applicationData = pgTable("application_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  year: integer("year").notNull(),
  month: integer("month").notNull(),
  rank: integer("rank").notNull(),
  application: text("application").notNull(),
  applicationType: text("application_type").notNull(),
  dataVolume: real("data_volume").notNull(),
});

export const deviceData = pgTable("device_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  year: integer("year").notNull(),
  month: integer("month").notNull(),
  rank: integer("rank").notNull(),
  device: text("device").notNull(),
  dataVolume: real("data_volume").notNull(),
});

export const networkMetrics = pgTable("network_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  year: integer("year").notNull(),
  month: integer("month").notNull(),
  factor: text("factor").notNull(),
  value: real("value").notNull(),
});

export type TrafficData = typeof trafficData.$inferSelect;
export type ApplicationData = typeof applicationData.$inferSelect;
export type DeviceData = typeof deviceData.$inferSelect;
export type NetworkMetrics = typeof networkMetrics.$inferSelect;

const insertTrafficDataSchema = createInsertSchema(trafficData).omit({ id: true });
const insertApplicationDataSchema = createInsertSchema(applicationData).omit({ id: true });
const insertDeviceDataSchema = createInsertSchema(deviceData).omit({ id: true });
const insertNetworkMetricsSchema = createInsertSchema(networkMetrics).omit({ id: true });

export type InsertTrafficData = z.infer<typeof insertTrafficDataSchema>;
export type InsertApplicationData = z.infer<typeof insertApplicationDataSchema>;
export type InsertDeviceData = z.infer<typeof insertDeviceDataSchema>;
export type InsertNetworkMetrics = z.infer<typeof insertNetworkMetricsSchema>;
