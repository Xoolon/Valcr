import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;           // Page-specific title
  description: string;
  keywords?: string[];
  canonicalPath?: string;   // e.g. "/calculators/shopify-profit-margin"
  ogType?: string;
  noIndex?: boolean;
  structuredData?: object;
}

export function SEOHead({
  title = "Valcr — E-Commerce Financial Intelligence",
  description,
  keywords = [],
  canonicalPath = '',
  ogType = 'website',
  noIndex = false,
  structuredData,
}: SEOHeadProps) {

  const baseUrl = 'https://valcr.site';

  // Clean canonical URL (no trailing slash)
  const canonicalUrl = `${baseUrl}${canonicalPath}`.replace(/\/$/, '');

  // Clean title - avoid "valcr.site" in browser tab
  const fullTitle = title.includes('| Valcr') || title.includes('Valcr')
    ? title
    : `${title} | Valcr`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}

      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />

      {/* Canonical - Critical for fixing "Alternate page with proper canonical tag" */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={`${baseUrl}/og-image.png`} />
      <meta property="og:site_name" content="Valcr" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}/og-image.png`} />

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}