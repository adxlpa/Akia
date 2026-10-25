/**
 * Google Analytics 4 Integration Utility for AKIA
 * Safely initializes GA4 using VITE_GA_MEASUREMENT_ID and tracks SPA page views.
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

let isInitialized = false;

export function initGA(): void {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId || typeof measurementId !== 'string' || !measurementId.startsWith('G-')) {
    // In production without GA key or in development mode, silently pass
    return;
  }

  if (isInitialized || document.getElementById('ga4-script')) {
    return;
  }

  try {
    // Load gtag script
    const script = document.createElement('script');
    script.id = 'ga4-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer?.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: false, // Managed manually for SPA view transitions
    });

    isInitialized = true;
  } catch (err) {
    console.warn('GA4 initialization skipped or blocked:', err);
  }
}

export function trackPageView(path: string, title?: string): void {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId || !window.gtag) {
    return;
  }

  try {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
      page_location: window.location.href,
    });
  } catch {
    // Ignore any tracking errors
  }
}
