export interface ApiError {
  message?: string;
  error?: string;
}

export interface AppMeta {
  selfRegistrationEnabled: boolean;
  isDemoModeEnabled: boolean;
  isTrackingEnabled: boolean;
  passwordResetEnabled: boolean;
  isSelfRegistrationEnabled: boolean;
  supportEmail: string;
  apiUrl: string;
}