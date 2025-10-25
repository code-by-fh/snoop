import { JobStatus } from "@/utils/jobStatusStyles";

export interface Job {
  id: string;
  name: string;
  runtimeErrors: JobError[];
  isActive: boolean;
  status: JobStatus;
  progress: number;
  totalListings: number;
  newListings: number;
  user: string;
  createdAt: string;
  updatedAt: string;
  lastRun?: string;
  error?: boolean;
  notificationAdapters: NotificationAdapter[];
  providers: Provider[];
  blacklistTerms: string[];
}

export interface JobError {
  providerId: string,
  providerName: string,
  providerUrl: string,
  message: string,
  timestamp: Date
}

export interface Provider {
  id: string;
  name: string;
  url: string;
  baseUrl: string;
}

export interface NotificationAdapter {
  id: string;
  name?: string;
  description?: string;
  readme?: string;
  fields?: Record<string, AdapterFieldConfig>;
}

export interface AdapterFieldConfig {
  name: string;
  value?: string;
  label?: string;
  description?: string;
  type?: 'text' | 'password' | 'number' | 'select' | 'textarea';
}

export interface Listing {
  id: string;
  title: string;
  price?: number;
  location?: {
    lat?: number;
    lng?: number;
    street?: string;
    city?: string;
    district?: string;
    zipcode?: string;
    state?: string;
    country?: string;
    fullAddress?: string;
  };
  size?: number;
  rooms?: number;
  description?: string;
  imageUrl?: string;
  url: string;
  job: string | Job;
  providerId: string;
  providerName: string;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListingsApiResponse {
  listings: Listing[];
  totalPages: number;
  total: number;
  providers?: Provider[]
}

export interface Settings {
  queryInterval: number;
  port: number;
  workingHoursFrom: string;
  workingHoursTo: string;
}

export interface Provider {
  providerId: string;
  providerName: string;
}