import { Link } from 'react-router-dom'
import { SEOHead } from '@/components/SEOHead'

const LAST_UPDATED = 'March 2025'

export function TermsPage() {
  return (
    <>
      <SEOHead
        title="Terms of Service | Valcr"
        description="Valcr terms of service — rules for using our calculator platform and embed widget."
        canonicalPath="/terms"
      />

      <div className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <span className="section-tag mb-4 inline-flex text-xs">Legal</span>
            <h1 className="font-display font-800 text-4xl text-ink-50 mb-3">Terms of Service</h1>
            <p className="text-ink-500 text-sm font-mono">Last updated: {LAST_UPDATED}</p>
          </div>

          <div className="card p-6 mb-10 border-acid/20 bg-acid/5">
            <p className="text-ink-200 text-sm leading-relaxed">
              <strong className="text-acid">Plain-language summary:</strong> Use Valcr fairly, don't abuse
              the service or try to resell it without permission, and understand that calculator results
              are estimates — always verify with a qualified professional before making major business
              decisions. Full details below.
            </p>
          </div>

          <div className="space-y-10">

            <Section title="1. Acceptance">
              <p>
                By accessing or using Valcr ("the Service") at <strong>valcr.site</strong>, you agree
                to these Terms of Service ("Terms"). If you do not agree, do not use the Service.
                These Terms form a binding agreement between you and Valcr.
              </p>
            </Section>

            <Section title="2. The Service">
              <p>
                Valcr provides a collection of financial and operational calculators targeted at
                e-commerce operators. The Service includes:
              </p>
              <ul>
                <li>Free, browser-based calculators available without an account.</li>
                <li>A Pro subscription tier offering saved calculations, PDF export, and shareable links.</li>
                <li>An embed widget allowing third-party websites to host Valcr calculators.</li>
              </ul>
              <p>
                We reserve the right to modify, suspend, or discontinue any part of the Service at
                any time with reasonable notice where possible.
              </p>
            </Section>

            <Section title="3. Accounts">
              <ul>
                <li>You must be at least 18 years old to create an account.</li>
                <li>You are responsible for maintaining the security of your account credentials.</li>
                <li>You must provide accurate information when creating your account.</li>
                <li>One person or legal entity may not maintain more than one free account.</li>
                <li>You are responsible for all activity that occurs under your account.</li>
              </ul>
            </Section>

            <Section title="4. Acceptable use">
              <p>You agree not to:</p>
              <ul>
                <li>Use the Service for any unlawful purpose or in violation of any regulations.</li>
                <li>Attempt to scrape, crawl, or systematically download content from Valcr.</li>
                <li>Attempt to reverse-engineer, decompile, or extract source code from the Service.</li>
                <li>Use automated tools (bots, scripts) to access or interact with the Service at scale.</li>
                <li>Resell, sublicense, or redistribute access to the Service without a written agreement with us.</li>
                <li>Attempt to circumvent subscription tiers, embed key verification, or rate limits.</li>
                <li>Upload or transmit malware, spam, or any content that could harm other users or our infrastructure.</li>
              </ul>
            </Section>

            <Section title="5. Subscriptions and payments">
              <p>
                Paid plans are billed monthly or annually as selected at checkout. Payments are
                processed by <strong>Paystack</strong>. By subscribing, you authorise Paystack to
                charge your payment method on a recurring basis.
              </p>
              <ul>
                <li><strong>Cancellation:</strong> you may cancel your subscription at any time. Cancellation takes effect at the end of your current billing period. You retain access to paid features until then.</li>
                <li><strong>Refunds:</strong> we offer a 7-day refund on first-time subscriptions if you are not satisfied. After 7 days, subscriptions are non-refundable. Contact <a href="mailto:billing@valcr.site" className="text-acid hover:underline">billing@valcr.site</a> to request a refund.</li>
                <li><strong>Price changes:</strong> we will give at least 30 days' notice before increasing subscription prices. Price increases do not apply to annual plans until renewal.</li>
                <li><strong>Failed payments:</strong> if a payment fails, we will retry up to 3 times over 7 days before suspending your account to the free tier.</li>
              </ul>
            </Section>

            <Section title="6. Embed widget">
              <p>
                Embed plans grant a licence to embed Valcr calculators on domains you register in
                your account dashboard. This licence is:
              </p>
              <ul>
                <li>Non-exclusive and non-transferable.</li>
                <li>Restricted to the number of calculators and domains specified in your plan.</li>
                <li>Revoked upon cancellation of your embed subscription.</li>
              </ul>
              <p>
                You may not use the embed widget to create a competing calculator product or service.
                If you embed Valcr calculators with branding removed (Business/Agency plans), you
                remain responsible for compliance with applicable laws, including privacy notices
                to your end users.
              </p>
            </Section>

            <Section title="7. Disclaimer of warranties">
              <p>
                <strong className="text-ink-200">Calculator results are estimates only.</strong>{' '}
                Valcr calculators are informational tools designed to help you think through financial
                decisions. They are not a substitute for professional accounting, legal, or financial
                advice. Results depend entirely on the accuracy of your inputs and the assumptions
                built into each model.
              </p>
              <p>
                The Service is provided "as is" and "as available" without warranties of any kind,
                express or implied. We do not warrant that the Service will be uninterrupted,
                error-free, or that results will be accurate for your specific situation.
              </p>
            </Section>

            <Section title="8. Limitation of liability">
              <p>
                To the maximum extent permitted by law, Valcr shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages arising from your use of
                or inability to use the Service. Our total liability for any claim is limited to
                the amount you paid us in the 12 months preceding the claim.
              </p>
            </Section>

            <Section title="9. Intellectual property">
              <p>
                The Valcr name, logo, calculator designs, and website content are owned by Valcr and
                protected by intellectual property laws. You may not use our branding without written
                permission. You retain ownership of any data you input into our calculators.
              </p>
            </Section>

            <Section title="10. Termination">
              <p>
                We may suspend or terminate your account for violations of these Terms, with or
                without notice depending on severity. You may delete your account at any time from
                your dashboard settings. Upon termination, your right to use the Service ceases
                immediately.
              </p>
            </Section>

            <Section title="11. Governing law">
              <p>
                These Terms are governed by the laws of Kenya. Any disputes shall be resolved in
                the courts of Nairobi, Kenya, unless otherwise required by applicable consumer
                protection laws in your jurisdiction.
              </p>
            </Section>

            <Section title="12. Changes to these terms">
              <p>
                We may update these Terms at any time. We will notify registered users of material
                changes by email at least 14 days before they take effect. Continued use of the
                Service after that date constitutes acceptance of the updated Terms.
              </p>
            </Section>

            <Section title="13. Contact">
              <p>
                Questions about these Terms:{' '}
                <a href="mailto:legal@valcr.site" className="text-acid hover:underline">legal@valcr.site</a>
              </p>
              <p>
                See also our <Link to="/privacy" className="text-acid hover:underline">Privacy Policy</Link>.
              </p>
            </Section>

          </div>
        </div>
      </div>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display font-700 text-xl text-ink-100 mb-4 pb-2 border-b border-ink-800">
        {title}
      </h2>
      <div className="space-y-3 text-ink-300 leading-relaxed text-sm [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:leading-relaxed [&_strong]:text-ink-200 [&_a]:text-acid">
        {children}
      </div>
    </section>
  )
}
