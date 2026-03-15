import { SEOHead } from '@/components/SEOHead'

const LAST_UPDATED = 'March 2025'

export function PrivacyPage() {
  return (
    <>
      <SEOHead
        title="Privacy Policy | Valcr"
        description="Valcr privacy policy — how we collect, use, and protect your data."
        canonicalPath="/privacy"
      />

      <div className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <span className="section-tag mb-4 inline-flex text-xs">Legal</span>
            <h1 className="font-display font-800 text-4xl text-ink-50 mb-3">Privacy Policy</h1>
            <p className="text-ink-500 text-sm font-mono">Last updated: {LAST_UPDATED}</p>
          </div>

          <div className="prose-valcr space-y-10">

            <Section title="1. Who we are">
              <p>
                Valcr ("we", "us", "our") operates the website at <strong>valcr.site</strong> and
                provides embeddable calculator tools for e-commerce operators. References to "the Service"
                mean the Valcr website, calculators, embed widget, and any related tools we make available.
              </p>
              <p>
                For questions about this policy, contact us at:{' '}
                <a href="mailto:privacy@valcr.site" className="text-acid hover:underline">privacy@valcr.site</a>
              </p>
            </Section>

            <Section title="2. What data we collect">
              <SubHeading>2a. Data you give us directly</SubHeading>
              <ul>
                <li><strong>Account data:</strong> name, email address, and password (hashed, never stored in plain text) when you create an account.</li>
                <li><strong>Payment data:</strong> billing information is processed by Paystack and is never stored on our servers. We only receive a customer ID and subscription status from Paystack.</li>
                <li><strong>Calculator inputs:</strong> if you are a Pro user and choose to save a calculation, the input values and results are stored against your account. Free users' calculator inputs are never sent to our servers — all computation runs in your browser.</li>
              </ul>

              <SubHeading>2b. Data collected automatically</SubHeading>
              <ul>
                <li><strong>Usage analytics:</strong> we use privacy-focused analytics (no cross-site tracking, no fingerprinting) to understand which calculators are used most and how people navigate the site.</li>
                <li><strong>Log data:</strong> standard server logs including IP address, browser type, referring URL, and pages visited. Logs are retained for 30 days and then deleted.</li>
                <li><strong>Cookies:</strong> we set a session cookie to keep you logged in and a single analytics cookie. We do not use advertising cookies or third-party tracking pixels.</li>
              </ul>

              <SubHeading>2c. Embed widget data</SubHeading>
              <p>
                When a Valcr calculator widget is embedded on a third-party website, the widget loads
                from our CDN. We may log the embed key, calculator slug, and a timestamp for billing
                and abuse prevention. We do not have access to the inputs users enter into embedded
                calculators unless the site owner has enabled lead capture, in which case they are
                responsible for their own privacy disclosure to their users.
              </p>
            </Section>

            <Section title="3. How we use your data">
              <ul>
                <li>To provide and maintain the Service — including account management and saved calculations.</li>
                <li>To process payments and manage subscriptions through Paystack.</li>
                <li>To send transactional emails (account confirmation, password reset, subscription receipts). We do not send marketing email without your explicit opt-in.</li>
                <li>To detect and prevent abuse, fraud, and violations of our Terms of Service.</li>
                <li>To improve the Service — understanding usage patterns helps us prioritise which calculators to build next.</li>
              </ul>
              <p>We do not sell your data. We do not share your data with advertisers.</p>
            </Section>

            <Section title="4. Data sharing">
              <p>We share data with third parties only in these circumstances:</p>
              <ul>
                <li><strong>Paystack:</strong> payment processing. Subject to Paystack's own privacy policy.</li>
                <li><strong>SendGrid:</strong> transactional email delivery. Only your email address is shared.</li>
                <li><strong>Sentry:</strong> error monitoring. Error reports may include anonymised stack traces. No personal data is intentionally included.</li>
                <li><strong>Legal requirements:</strong> if required by law, court order, or to protect our rights and the safety of our users.</li>
              </ul>
            </Section>

            <Section title="5. Data retention">
              <ul>
                <li>Account data is retained for as long as your account is active.</li>
                <li>Saved calculations are retained until you delete them or close your account.</li>
                <li>Server logs are deleted after 30 days.</li>
                <li>When you close your account, all personal data is deleted within 30 days.</li>
              </ul>
            </Section>

            <Section title="6. Your rights">
              <p>You have the right to:</p>
              <ul>
                <li><strong>Access</strong> the personal data we hold about you.</li>
                <li><strong>Correct</strong> inaccurate data.</li>
                <li><strong>Delete</strong> your account and all associated data.</li>
                <li><strong>Export</strong> your saved calculations in JSON or CSV format.</li>
                <li><strong>Object</strong> to processing in certain circumstances.</li>
              </ul>
              <p>
                To exercise any of these rights, email{' '}
                <a href="mailto:privacy@valcr.site" className="text-acid hover:underline">privacy@valcr.site</a>.
                We will respond within 30 days.
              </p>
            </Section>

            <Section title="7. Security">
              <p>
                Passwords are hashed using bcrypt before storage. All data in transit is encrypted
                using TLS. We use industry-standard practices for securing our infrastructure.
                No system is perfectly secure — if you discover a vulnerability, please report it
                responsibly to <a href="mailto:security@valcr.site" className="text-acid hover:underline">security@valcr.site</a>.
              </p>
            </Section>

            <Section title="8. Children">
              <p>
                Valcr is not directed at children under 13. We do not knowingly collect personal
                data from children. If you believe a child has provided us with personal data,
                contact us and we will delete it.
              </p>
            </Section>

            <Section title="9. Changes to this policy">
              <p>
                We may update this policy from time to time. We will notify registered users of
                material changes by email at least 14 days before they take effect. The "Last updated"
                date at the top of this page reflects the most recent revision.
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

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="font-display font-700 text-ink-200 text-sm uppercase tracking-widest mt-5 mb-2">{children}</h3>
}
