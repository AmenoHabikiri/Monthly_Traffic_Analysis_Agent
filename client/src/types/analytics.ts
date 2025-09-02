export interface TrafficMetrics {
  year: number;
  month: string;
  totalTraffic: number;
  normalizedTraffic: number;
  deltaPercentage: number | null;
  totalDlVol: number | null;
  totalUlVol: number | null;
  dlUlRatio: number | null;
}

export interface ApplicationMetrics {
  year: number;
  month: number;
  rank: number;
  application: string;
  applicationType: string;
  dataVolume: number;
}

export interface DeviceMetrics {
  year: number;
  month: number;
  rank: number;
  device: string;
  dataVolume: number;
}

export interface NetworkMetrics {
  year: number;
  month: number;
  factor: string;
  value: number;
}

export interface AnalyticsSummary {
  totalTrafficJuly: number;
  normalizedTrafficJuly: number;
  growthRate: number;
  topApplications: ApplicationMetrics[];
  topDevices: DeviceMetrics[];
  fiveGMetrics: NetworkMetrics[];
}

export type StoryType = 
  | 'traffic'
  | 'applications'
  | 'application-types'
  | 'devices' 
  | 'uplink-downlink'
  | 'holiday-workday'
  | '4g-5g'
  | 'b2b-b2c'
  | 'miscellaneous';

export interface StoryNavItem {
  id: StoryType;
  title: string;
  description: string;
  icon: string;
}
