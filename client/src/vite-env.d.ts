/// <reference types="vite/client" />

declare global {
    interface Window {
        __API_URL__?: string;
        __WS_URL__?: string;
    }
}

export { };
