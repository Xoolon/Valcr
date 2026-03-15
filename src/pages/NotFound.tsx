import { Link } from 'react-router-dom'
import { SEOHead } from '@/components/SEOHead'

export function NotFoundPage() {
  return (
    <>
      <SEOHead title="404 — Page Not Found | Valcr" description="Page not found." noIndex />
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="font-display font-800 text-8xl text-ink-800 mb-4 select-none">404</p>
          <h1 className="font-display font-700 text-2xl text-ink-50 mb-3">Page not found</h1>
          <p className="text-ink-400 mb-8">This page doesn't exist or was moved.</p>
          <Link to="/" className="btn-primary">Go home</Link>
        </div>
      </div>
    </>
  )
}
