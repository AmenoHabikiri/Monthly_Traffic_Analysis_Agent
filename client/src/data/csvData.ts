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
  gray: '#A6A6A6'
};
