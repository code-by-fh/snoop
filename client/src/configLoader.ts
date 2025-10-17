export interface AppConfig {
    API_URL: string;
    WS_URL: string;
}

export async function loadConfig(): Promise<AppConfig> {
    const config = await fetch('/config.json')
        .then(res => res.json())
        .catch(() => ({}));

    return {
        API_URL: config.API_URL && config.API_URL !== "__API_URL__"
            ? config.API_URL
            : import.meta.env.VITE_API_URL,
        WS_URL: config.WS_URL && config.WS_URL !== "__WS_URL__"
            ? config.WS_URL
            : import.meta.env.WEBSOCKET_BASE_URL,
    };
}