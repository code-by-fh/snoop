import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToHash() {
    const { hash } = useLocation();

    useEffect(() => {
        if (!hash) return;
        const id = hash.substring(1);

        let tries = 0;
        const maxTries = 30; // ms interval

        const tryScroll = () => {
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                observer?.disconnect();
                return true;
            }
            return false;
        };

        if (tryScroll()) return;

        const interval = setInterval(() => {
            tries++;
            if (tryScroll() || tries >= maxTries) {
                clearInterval(interval);
            }
        }, 100);

        const observer = new MutationObserver(() => {
            tryScroll();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            clearInterval(interval);
            observer.disconnect();
        };
    }, [hash]);

    return null;
}
