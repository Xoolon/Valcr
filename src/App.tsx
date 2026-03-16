import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
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
import { AdminPage } from '@/pages/admin/Admin'
import { PaymentVerifyPage } from '@/pages/PaymentVerify'
import { NotFoundPage } from '@/pages/NotFound'
import { BlogPostPage } from '@/pages/blog/BlogPost'

const NO_FOOTER = ['/login', '/signup', '/forgot-password', '/reset-password', '/payments/verify']

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const showFooter = !NO_FOOTER.some((p) => pathname.startsWith(p))

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Nav />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calculators" element={<CalculatorsPage />} />
          <Route path="/calculators/:slug" element={<CalculatorPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/embed" element={<EmbedPage />} />
          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Legal */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          {/* Admin */}
          <Route path="/admin" element={<AdminPage />} />
          {/* Paystack callback */}
          <Route path="/payments/verify" element={<PaymentVerifyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  )
}
