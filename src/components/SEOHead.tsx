import { Helmet } from 'react-helmet-async'

interface SEOHeadProps {
  title: string
  description: string
  keywords?: string[]
  canonicalPath?: string
  ogType?: string
  noIndex?: boolean
  structuredData?: object
}

export function SEOHead({
  title,
  description,
  keywords = [],
  canonicalPath = '',
  ogType = 'website',
  noIndex = false,
  structuredData,
}: SEOHeadProps) {
  const baseUrl = 'https://valcr.site'
  const canonicalUrl = `${baseUrl}${canonicalPath}`
  const fullTitle = title.includes('Valcr') ? title : `${title} | Valcr`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={`${baseUrl}/og-image.png`} />

      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  )
}
