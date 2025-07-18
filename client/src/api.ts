import axios from 'axios';
import { Job, Listing, ListingsApiResponse, NotificationAdapter, Settings } from './types';
import { JobStatistics, Statistics } from './types/statistic';
import { User } from './types/user';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Job-related API methods
export const getJobs = () => api.get<Job[]>('/jobs');
export const createJob = (jobData: Partial<Job>) => api.post<Job>('/jobs', jobData);
export const getJobById = (id: string) => api.get<Job>(`/jobs/${id}`);
export const updateJob = (id: string, jobData: Partial<Job>) => api.put<Job>(`/jobs/${id}`, jobData);
export const deleteJob = (id: string) => api.delete(`/jobs/${id}`);
export const runJob = (id: string) => api.post(`/jobs/${id}/execute`);

// Listing-related API methods
export const getListings = (params?: {
  page?: number,
  limit?: number,
  jobId?: string,
  minPrice?: string,
  maxPrice?: string,
  minRooms?: string,
  minArea?: string,
  location?: string,
  sortBy?: string,
  sortOrder?: string,
  searchTerm?: string,
}) => api.get<ListingsApiResponse>('/listings', { params });
export const createListing = (listingData: Partial<Listing>) => api.post<Listing>('/listings', listingData);
export const deleteListing = (id: string) => api.delete(`/listings/${id}`);

// Setting-related API methods
export const getSettings = () => api.get<Settings>('/admin/settings');
export const putSettings = (data: Settings) => api.put<Settings>('/admin/settings', data);

// User-related API methods
export const getUsers = () => api.get<User[]>('/admin/users');
export const createUser = (userData: Partial<User>) => api.post<User>('/admin/users', userData);
export const updateUser = (id: string, userData: Partial<User>) => api.put<User>(`/admin/users/${id}`, userData);
export const deleteUser = (id: string) => api.delete(`/admin/users/${id}`);

// Statistics-related API methods
export const getdStats = () => api.get<Statistics>('/statistics');
export const getDashboardStats = () => api.get<Statistics>('/dashboard/stats');
export const getJobStats = (jobId: string) => api.get<JobStatistics>(`/statistics/jobs/${jobId}`);

// Notification Adapter-related API methods
export const getNotificationAdapterConfig = (adapterId: string) => api.get(`/notificationAdapters/${adapterId}`);
export const getAvailableNotificationAdapters = () => api.get<NotificationAdapter[]>(`/notificationAdapters`);

// Provider-related API methods
export const getProviders = () => api.get('/providers');


export default api;
