import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useMatomoTagManager() {
    const location = useLocation();

    useEffect(() => {
        // injecter le script MTM si pas déjà présent
        if (!document.getElementById("matomo-tagmanager")) {
            const script = document.createElement("script");
            script.id = "matomo-tagmanager";
            script.innerHTML = `
        var _mtm = _mtm || [];
        _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.async=true; g.src='https://analytics.remiguerin.fr/container_xxx.js'; s.parentNode.insertBefore(g,s);
      `;
            document.head.appendChild(script);
        }

        // envoyer un événement de changement de page à MTM
        if (window._mtm) {
            window._mtm.push({ event: "pageview", url: window.location.pathname });
        }
    }, [location]);
}
