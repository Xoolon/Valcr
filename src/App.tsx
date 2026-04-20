import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { SupportWidget } from '@/components/SupportWidget'
import { HomePage } from '@/pages/Home'
import { CalculatorsPage } from '@/pages/Calculators'
import { CalculatorPage } from '@/pages/Calculator'
import { PricingPage } from '@/pages/Pricing'
import { EmbedPage } from '@/pages/Embed'
import { LoginPage } from '@/pages/Login'
import { SignupPage } from '@/pages/Signup'
import { ForgotPasswordPage } from '@/pages/ForgotPassword'
import { ResetPasswordPage } from '@/pages/ResetPassword'
import { DashboardPage } from '@/pages/Dashboard'
import { AboutPage } from '@/pages/legal/About'
import { PrivacyPage } from '@/pages/legal/Privacy'
import { TermsPage } from '@/pages/legal/Terms'
import { BlogPage } from '@/pages/legal/Blog'
import { BlogPostPage } from '@/pages/blog/BlogPost'
import { AdminPage } from '@/pages/admin/Admin'
import { PaymentVerifyPage } from '@/pages/PaymentVerify'
import { NotFoundPage } from '@/pages/NotFound'
import { ConsentBanner } from '@/components/ConsentBanner'
import { VerifyEmailPage } from '@/pages/VerifyEmail'
import { ProfilePage } from '@/pages/Profile'
import { CookieBanner } from '@/components/CookieBanner'
import { SharedCalculationPage } from '@/pages/SharedCalculation'
import { BlogAdminPage } from '@/pages/admin/BlogAdmin'
import { ComparisonPage } from '@/pages/comparisons/ComparisonPage'
import { ReportPage, ReportsIndex } from '@/pages/reports/ReportPage'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
const NO_FOOTER = ['/login', '/signup', '/forgot-password', '/reset-password', '/payments/verify']

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function PageTracker() {
  const { pathname } = useLocation()
  useEffect(() => {
    const skip = ['/admin', '/dashboard', '/login', '/signup', '/forgot-password', '/reset-password', '/payments']
    if (skip.some((p) => pathname.startsWith(p))) return
    fetch(`${API}/analytics/pageview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, referrer: document.referrer || '' }),
    }).catch(() => {})
  }, [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const showFooter = !NO_FOOTER.some((p) => pathname.startsWith(p))

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <PageTracker />
      <Nav />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calculators" element={<CalculatorsPage />} />
          <Route path="/calculators/:slug" element={<CalculatorPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/embed" element={<EmbedPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/shared/:token" element={<SharedCalculationPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/admin/blog" element={<BlogAdminPage />} />
          <Route path="/admin/blog/:slug" element={<BlogAdminPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/payments/verify" element={<PaymentVerifyPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/compare/:slug" element={<ComparisonPage />} />
          <Route path="/reports" element={<ReportsIndex />} />
          <Route path="/reports/:slug" element={<ReportPage />} />

        </Routes>
      </main>
      {showFooter && <Footer />}
      <CookieBanner />
      <ConsentBanner />
      <SupportWidget />
    </div>
  )
}