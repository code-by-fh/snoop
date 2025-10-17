// src/runtimeConfig.ts
export interface AppConfig {
  API_URL: string;
  WS_URL: string;
}

let config: AppConfig | null = null;

export async function loadRuntimeConfig(): Promise<AppConfig> {
  if (config) return config;

  try {
    const response = await fetch('/config.json');
    const data = await response.json();

    config = {
      API_URL:
        data.API_URL && data.API_URL !== '__API_URL__'
          ? data.API_URL
          : import.meta.env.k_API_URL,
      WS_URL:
        data.WS_URL && data.WS_URL !== '__WS_URL__'
          ? data.WS_URL
          : import.meta.env.WEBSOCKET_BASE_URL,
    };
  } catch (e) {
    config = {
      API_URL: import.meta.env.VITE_API_URL,
      WS_URL: import.meta.env.WEBSOCKET_BASE_URL,
    };
  }

  return config;
}

// Zugriff überall synchron möglich, nachde23891wism geladen
export function getRuntimeConfig(): AppConfig {
  if (!config) throw new Error('Runtime config not loaded yet!');
  return config;
}
