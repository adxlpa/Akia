/**
 * Dynamic SEO and Metadata Manager for AKIA
 * Updates title, meta tags, canonical link, Open Graph, Twitter Cards,
 * and JSON-LD Breadcrumb schema dynamically per view.
 */

export interface PageMetadata {
  title: string;
  description: string;
  canonical: string;
  ogType?: string;
  ogImage?: string;
  breadcrumbs?: Array<{ name: string; path: string }>;
}

export function getBaseUrl(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL && import.meta.env.VITE_SITE_URL.trim()) {
    return import.meta.env.VITE_SITE_URL.trim().replace(/\/$/, '');
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'https://akiapremium.in';
}

const BASE_URL = getBaseUrl();
const DEFAULT_IMAGE = `${BASE_URL}/images/logo.png`;

export const METADATA_CONFIG: Record<string, PageMetadata> = {
  home: {
    title: 'AKIA | Premium Hand Made Soaps & Pure Herbal Botanicals',
    description:
      'Handcrafted Ayurvedic cold-cured soaps, herbal hair oils, and nourishing botanical gels made with 100% sulphate-free and paraben-free natural ingredients in Kerala.',
    canonical: `${BASE_URL}/`,
    ogType: 'website',
    ogImage: `${BASE_URL}/images/products/thulasi-soap.jpg`,
    breadcrumbs: [{ name: 'Home', path: '/' }],
  },
  catalogue: {
    title: 'Botanical Formulations Catalogue | AKIA Hand Made Soaps & Care',
    description:
      'Explore all 16 handcrafted Ayurvedic formulations by AKIA. Cold-process herbal soaps, revitalizing face washes, Brahmi hair oil, and soothing botanical gels.',
    canonical: `${BASE_URL}/catalogue`,
    ogType: 'product.group',
    ogImage: `${BASE_URL}/images/products/thulasi-soap.jpg`,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Catalogue', path: '/catalogue' },
    ],
  },
  about: {
    title: 'Our Story & Botanical Heritage | AKIA Kerala Apothecary',
    description:
      'Discover the philosophy of AKIA: authentic Ayurvedic alchemy, 30-to-45-day natural cold curing, zero sulphates or parabens, and pure heritage herbs in Kerala.',
    canonical: `${BASE_URL}/about`,
    ogType: 'article',
    ogImage: `${BASE_URL}/images/products/thulasi-soap.jpg`,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Our Heritage', path: '/about' },
    ],
  },
  reviews: {
    title: 'Customer Reviews & Real Experiences | AKIA Hand Made Soaps (4.9★)',
    description:
      'Read 1,200+ verified customer reviews of AKIA handmade soaps, Brahmi hair oil, and herbal skincare formulations. Rated 4.9/5 by patrons across India.',
    canonical: `${BASE_URL}/reviews`,
    ogType: 'website',
    ogImage: `${BASE_URL}/images/products/thulasi-soap.jpg`,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Reviews', path: '/reviews' },
    ],
  },
  contact: {
    title: 'Contact Concierge & Kerala Atelier | AKIA Customer Care',
    description:
      'Reach the AKIA apothecary atelier directly via WhatsApp (+91 8078462709 / 9497802709) for consultations, custom hampers, wholesale, and order assistance.',
    canonical: `${BASE_URL}/contact`,
    ogType: 'website',
    ogImage: DEFAULT_IMAGE,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Contact Atelier', path: '/contact' },
    ],
  },
  'privacy-policy': {
    title: 'Privacy Policy & Data Security | AKIA Handcrafted Botanicals',
    description:
      'Learn how AKIA protects your personal information, delivery details, and order data in compliance with standard consumer privacy practices.',
    canonical: `${BASE_URL}/privacy-policy`,
    ogType: 'website',
    ogImage: DEFAULT_IMAGE,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Privacy Policy', path: '/privacy-policy' },
    ],
  },
  'order-track': {
    title: 'Track Consignment & Dispatch | AKIA Order Concierge',
    description:
      'Live parcel tracking for your AKIA dispatch. Enter your order number and registered phone number to verify courier transit status.',
    canonical: `${BASE_URL}/order-track`,
    ogType: 'website',
    ogImage: DEFAULT_IMAGE,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Order Tracker', path: '/order-track' },
    ],
  },
  checkout: {
    title: 'Checkout & Delivery Details | AKIA Botanical Essentials',
    description:
      'Enter your delivery address and contact information for safe courier dispatch from our Kerala atelier.',
    canonical: `${BASE_URL}/checkout`,
    ogType: 'website',
    ogImage: DEFAULT_IMAGE,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Checkout', path: '/checkout' },
    ],
  },
  payment: {
    title: 'UPI Merchant Payment | AKIA Botanical Essentials',
    description:
      'Complete your handcrafted order via verified Google Pay, PhonePe, Paytm, or BHIM UPI.',
    canonical: `${BASE_URL}/payment`,
    ogType: 'website',
    ogImage: DEFAULT_IMAGE,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Checkout', path: '/checkout' },
      { name: 'UPI Payment', path: '/payment' },
    ],
  },
  'order-confirmation': {
    title: 'Order Confirmed | AKIA Hand Made Soaps & Herbal Botanicals',
    description:
      'Your order has been recorded. Complete the 1-click WhatsApp transmission to dispatch your freshly cured formulations.',
    canonical: `${BASE_URL}/order-confirmation`,
    ogType: 'website',
    ogImage: DEFAULT_IMAGE,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Order Confirmed', path: '/order-confirmation' },
    ],
  },
  admin: {
    title: 'Staff Security Gateway | AKIA Atelier Administration',
    description:
      'Protected staff administrative console with cryptographic authorization and session management.',
    canonical: `${BASE_URL}/admin`,
    ogType: 'website',
    ogImage: DEFAULT_IMAGE,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Staff Gateway', path: '/admin' },
    ],
  },
  'not-found': {
    title: '404 - Page Not Found | AKIA Hand Made Soaps',
    description:
      'The requested page or formulation could not be located. Explore our complete catalogue of handcrafted soaps and Ayurvedic care.',
    canonical: `${BASE_URL}/404`,
    ogType: 'website',
    ogImage: DEFAULT_IMAGE,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Page Not Found', path: '/404' },
    ],
  },
};

/**
 * Updates document title, meta description, canonical tag, Open Graph, and Twitter metadata.
 */
export function updatePageSEO(view: string, custom?: Partial<PageMetadata>): void {
  const config = { ...(METADATA_CONFIG[view] || METADATA_CONFIG['not-found']), ...custom };

  // 1. Title
  document.title = config.title;

  // 2. Meta description
  updateMetaTag('name', 'description', config.description);

  // 3. Canonical link
  updateCanonicalTag(config.canonical);

  // 4. Open Graph Tags
  updateMetaTag('property', 'og:title', config.title);
  updateMetaTag('property', 'og:description', config.description);
  updateMetaTag('property', 'og:url', config.canonical);
  updateMetaTag('property', 'og:type', config.ogType || 'website');
  updateMetaTag('property', 'og:image', config.ogImage || DEFAULT_IMAGE);
  updateMetaTag('property', 'og:site_name', 'AKIA Premium Hand Made');
  updateMetaTag('property', 'og:locale', 'en_IN');

  // 5. Twitter Card Tags
  updateMetaTag('name', 'twitter:card', 'summary_large_image');
  updateMetaTag('name', 'twitter:title', config.title);
  updateMetaTag('name', 'twitter:description', config.description);
  updateMetaTag('name', 'twitter:image', config.ogImage || DEFAULT_IMAGE);

  // 6. Dynamic BreadcrumbList JSON-LD
  if (config.breadcrumbs && config.breadcrumbs.length > 0) {
    updateBreadcrumbSchema(config.breadcrumbs);
  }

  // 7. Google Search Console Verification (Requirement 18)
  const gscTag = import.meta.env.VITE_GSC_VERIFICATION_TAG;
  if (gscTag && typeof gscTag === 'string' && gscTag.trim() && !gscTag.includes('your_gsc')) {
    updateMetaTag('name', 'google-site-verification', gscTag.trim());
  }
}

function updateMetaTag(attributeName: 'name' | 'property', attributeValue: string, content: string): void {
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateCanonicalTag(url: string): void {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function updateBreadcrumbSchema(breadcrumbs: Array<{ name: string; path: string }>): void {
  let script = document.getElementById('breadcrumb-schema') as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'breadcrumb-schema';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${BASE_URL}${crumb.path === '/' ? '' : crumb.path}`,
    })),
  };

  script.textContent = JSON.stringify(schema);
}
