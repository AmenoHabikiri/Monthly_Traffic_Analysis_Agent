// This file contains processed CSV data for immediate use
// In a real application, this would be replaced with API calls

export const MONTHS = ['May 2025', 'June 2025', 'July 2025'];

export const STORY_NAVIGATION = [
  {
    id: 'traffic' as const,
    title: 'Traffic Trends',
    description: 'Month-over-month growth analysis',
    icon: 'chart-line'
  },
  {
    id: 'applications' as const,
    title: 'Application Rankings',
    description: 'App performance evolution',
    icon: 'mobile-alt'
  },
  {
    id: 'application-types' as const,
    title: 'Application Type Trends',
    description: 'Category-wise usage patterns',
    icon: 'layers'
  },
  {
    id: 'devices' as const,
    title: 'Device Rankings', 
    description: 'Device preference changes',
    icon: 'tablet-alt'
  },
  {
    id: 'uplink-downlink' as const,
    title: 'UL vs DL',
    description: 'Upload vs Download patterns',
    icon: 'exchange-alt'
  },
  {
    id: 'holiday-workday' as const,
    title: 'Holiday vs Workday',
    description: 'Usage pattern differences',
    icon: 'calendar-alt'
  },
  {
    id: '4g-5g' as const,
    title: '4G vs 5G',
    description: 'Network technology adoption',
    icon: 'signal'
  },
  {
    id: 'b2b-b2c' as const,
    title: 'B2B vs B2C',
    description: 'Business vs consumer trends',
    icon: 'building'
  },
  {
    id: 'miscellaneous' as const,
    title: 'Miscellaneous',
    description: 'Additional trends & insights',
    icon: 'chart-pie'
  }
];

export const RAKUTEN_COLORS = {
  pink: '#FF3399',
  red: '#C00000', 
  blue: '#0070C0',
  yellow: '#FFC000',
  green: '#00B050',
  amber: '#CC9900',
  gray: '#A6A6A6',
  purple: '#7030A0',
  orange: '#FF6600',
  teal: '#00B7C3'
};

export const DEVICE_DATA = [
  { device: 'Rakuten WiFi Pocket 2C', month: 5, year: 2025, dataVolume: 12406904.008808600 },
  { device: 'Apple iPhone 15 (A3089)', month: 5, year: 2025, dataVolume: 11570559.826484400 },
  { device: 'R2314M-JP', month: 5, year: 2025, dataVolume: 11417169.0844336 },
  { device: 'Apple iPhone 14 (A2881)', month: 5, year: 2025, dataVolume: 9190232.254296860 },
  { device: 'Rakuten WiFi Pocket Platinum', month: 5, year: 2025, dataVolume: 8882967.278613290 },
  { device: 'Apple iPhone 12 (A2402)', month: 5, year: 2025, dataVolume: 7460332.262666020 },
  { device: 'iPhone 13 (A2631)', month: 5, year: 2025, dataVolume: 7445766.598261730 },
  { device: 'Apple iPhone 16 (A3286)', month: 5, year: 2025, dataVolume: 5917832.145332020 },
  { device: 'Apple iPhone 15 Pro (A3101)', month: 5, year: 2025, dataVolume: 5337911.872666020 },
  { device: 'Apple iPhone 16 Pro (A3292)', month: 5, year: 2025, dataVolume: 4571603.998925780 },
  { device: 'Apple iPhone 15 (A3089)', month: 6, year: 2025, dataVolume: 11756415.065537100 },
  { device: 'Rakuten WiFi Pocket 2C', month: 6, year: 2025, dataVolume: 11297424.756015600 },
  { device: 'R2314M-JP', month: 6, year: 2025, dataVolume: 10720116.52221680 },
  { device: 'Apple iPhone 14 (A2881)', month: 6, year: 2025, dataVolume: 9086200.585546890 },
  { device: 'Rakuten WiFi Pocket Platinum', month: 6, year: 2025, dataVolume: 9084269.30112305 },
  { device: 'iPhone 13 (A2631)', month: 6, year: 2025, dataVolume: 7234009.198173820 },
  { device: 'Apple iPhone 12 (A2402)', month: 6, year: 2025, dataVolume: 7019186.264013650 },
  { device: 'Apple iPhone 16 (A3286)', month: 6, year: 2025, dataVolume: 6322306.898310520 },
  { device: 'Apple iPhone 15 Pro (A3101)', month: 6, year: 2025, dataVolume: 5268826.159189450 },
  { device: 'Apple iPhone 16 Pro (A3292)', month: 6, year: 2025, dataVolume: 4836999.509707020 },
  { device: 'Apple iPhone 15 (A3089)', month: 7, year: 2025, dataVolume: 12114490.002763700 },
  { device: 'Rakuten WiFi Pocket 2C', month: 7, year: 2025, dataVolume: 10434558.360742200 },
  { device: 'R2314M-JP', month: 7, year: 2025, dataVolume: 10208660.320527300 },
  { device: 'Rakuten WiFi Pocket Platinum', month: 7, year: 2025, dataVolume: 9363400.15163083 },
  { device: 'Apple iPhone 14 (A2881)', month: 7, year: 2025, dataVolume: 9146504.576396500 },
  { device: 'iPhone 13 (A2631)', month: 7, year: 2025, dataVolume: 7079016.037441390 },
  { device: 'Apple iPhone 12 (A2402)', month: 7, year: 2025, dataVolume: 6927646.243710930 },
  { device: 'Apple iPhone 16 (A3286)', month: 7, year: 2025, dataVolume: 6848501.284443360 },
  { device: 'Apple iPhone 15 Pro (A3101)', month: 7, year: 2025, dataVolume: 5280197.662070320 },
  { device: 'Apple iPhone 16 Pro (A3292)', month: 7, year: 2025, dataVolume: 5115297.732363280 }
];
