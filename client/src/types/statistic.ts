export interface Statistics {
  totalJobs: number;
  activeJobs: number;
  totalListings: number;
  newListingsToday: number;
  listingsBySource: ListingsBySource;
  listingsByPrice: ListingsByPrice;
  listingsByDate: ListingsByDate;
  meta: Meta
}

export interface Meta {
  totalJobsChange: string
  activeJobsChange: string
  totalListingsChange: string
  newListingsTodayChange: string
}

export interface ListingsBySource {
  providers: ProviderSource[];
  sourcePerformance: SourcePerformance[];
}

export interface ProviderSource {
  name: string;
  value: number;
}

export interface SourcePerformance {
  name: string;
  listings: number;
  successRate: number;
  avgResponseTime: number; // in hours
  lastCrawl: string;       // e.g., "2 hours ago"
  status: "active" | "warning" | "inactive"; // assuming possible values
}

export interface ListingsByPrice {
  range: PriceRange[];
  price: PriceTrend[];
  priceDistribution: PriceDistribution[];
  priceStats: PriceStats;
  priceTrends: PriceTrend[];
}

export interface PriceRange {
  range: string;
  count: number;
}

export interface PriceTrend {
  month: string;
  avgPrice: number;
  medianPrice: number;
}

export interface PriceDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface PriceStats {
  averagePrice: number;
  medianPrice: number;
  priceChange: string;
  trend: "up" | "down";
}

export interface ListingsByDate {
  daily: DailyCount[];
  hourly: HourlyCount[];
  weekly: WeeklyStats[];
  monthly: MonthlyStats[];
  timeStats: TimeStats;
}

export interface DailyCount {
  date: string; // e.g., "2023-01"
  count: number;
}

export interface HourlyCount {
  hour: string; // e.g., "00:00"
  listings: number;
}

export interface WeeklyStats {
  day: string; // e.g., "Monday"
  listings: number;
  avgPrice: number;
}

export interface MonthlyStats {
  month: string; // e.g., "Jan"
  listings: number;
  growth: number; // e.g., 12 for 12%
}

export interface TimeStats {
  peakHour: string;         // e.g., "12:00 PM"
  peakDay: string;          // e.g., "Wednesday"
  avgListingsPerDay: number;
  growthRate: string;       // e.g., "+15.2%"
}

export interface JobStatistics {
  jobId: string;
  jobName: string;
  totalListings: number;
  newListingsToday: number;
  listingsBySource: { name: string; value: number }[];
  listingsByPrice: { range: string; count: number }[];
  listingsOverTime: { date: string; count: number }[];
  errorsOverTime: { date: string; count: number }[];
  processingTime: { date: string; avgTimeMs: number }[];
}
