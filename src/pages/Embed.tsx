import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Code2, Copy, Check, Globe, Shield, Zap, Key, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { SEOHead } from '@/components/SEOHead'
import { CALCULATORS } from '@/calculators'
import { useAuthStore } from '@/store'

export function EmbedPage() {
  const [selectedSlug, setSelectedSlug] = useState('shopify-profit-margin')
  const [theme, setTheme] = useState('dark')
  const [copied, setCopied] = useState(false)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)
  const { user } = useAuthStore()



  const embedCode = `<script src="https://cdn.valcr.site/widget.js"
  data-calc="${selectedSlug}"
  data-theme="${theme}"
  data-lead-capture="false"
  data-embed-key="YOUR_EMBED_KEY_HERE">
</script>`

  const copyCode = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const FAQS = [
    {
      q: 'What is the CDN and why is it used?',
      a: 'CDN stands for Content Delivery Network. Instead of hosting the widget.js file yourself, you load it from cdn.valcr.site — a globally distributed network of servers. This means the script loads fast for visitors anywhere in the world, you always get the latest version automatically, and we handle uptime. You just paste one line of code.'
    },
    {
      q: 'What is an embed key and how do I get one?',
      a: 'An embed key (like emb_live_abc123...) is a unique token tied to your account. It tells our servers which calculators you\'ve licensed to embed and which domains are allowed to use them. To get yours: (1) sign up or log in, (2) upgrade to an Embed plan, (3) go to your Dashboard → Embed Keys tab, (4) click "Generate key" and add your domain. Your key appears there immediately.'
    },
    {
      q: 'Why does the code say YOUR_EMBED_KEY_HERE?',
      a: 'That\'s a placeholder. The code builder on this page shows you the correct format, but you must replace YOUR_EMBED_KEY_HERE with your actual key from the dashboard. If you paste the placeholder as-is, the widget will refuse to load — this is intentional so random people can\'t abuse your key quota.'
    },
    {
      q: 'What happens if someone uses my embed key on a domain I didn\'t approve?',
      a: 'Nothing — the widget won\'t load. Every embed key is tied to a list of allowed domains you control. If a request comes from an unlisted domain, the widget silently fails. You can update your allowed domains from the dashboard at any time.'
    },
    {
      q: 'Can I customise the look of the embedded calculator?',
      a: 'On the Starter Embed plan the Valcr branding is visible. On Business and Agency plans you can remove branding and set a custom accent colour to match your site. Custom CSS overrides are available on Agency.'
    },
    {
      q: 'Do embedded calculators work on mobile?',
      a: 'Yes. The widget is fully responsive and renders correctly on all screen sizes. It adapts its layout for narrow containers automatically.'
    },
  ]

  const BENEFITS = [
    { icon: <Zap className="w-5 h-5" />, title: 'One line of code', desc: 'Drop a single script tag. No iframe, no build step, no dependencies.' },
    { icon: <Shield className="w-5 h-5" />, title: 'Domain whitelisting', desc: 'Your embed key only works on domains you approve — nobody else can use it.' },
    { icon: <Globe className="w-5 h-5" />, title: 'CDN-hosted widget', desc: 'Loads from cdn.valcr.site — fast globally, always the latest version, zero maintenance.' },
  ]

  return (
    <>
      <SEOHead
        title="Embed Valcr Calculators on Your Website | Valcr"
        description="Add any Valcr calculator to your website with one line of code. White-label, theme-aware, domain-restricted embed widget for e-commerce and content sites."
        canonicalPath="/embed"
        keywords={['embed calculator website', 'embeddable calculator', 'white label calculator', 'calculator widget']}
      />

      <div className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-12">
            <span className="section-tag mb-4 inline-flex"><Code2 className="w-3 h-3" />Embed Widget</span>
            <h1 className="font-display font-800 text-5xl text-ink-50 leading-tight mb-4">
              Add calculators to<br />your website.
            </h1>
            <p className="text-ink-300 text-xl max-w-xl">
              One line of code. Loads from our CDN. Renders directly into your page,
              respects your colour theme, and captures leads for you.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {BENEFITS.map((b) => (
              <div key={b.title} className="card p-5">
                <div className="w-9 h-9 bg-acid/10 border border-acid/20 rounded-lg flex items-center justify-center text-acid mb-3">{b.icon}</div>
                <h3 className="font-display font-700 text-ink-100 text-sm mb-1">{b.title}</h3>
                <p className="text-ink-400 text-sm">{b.desc}</p>
              </div>
            ))}
          </div>

          {/* How it works — step by step */}
          <div className="card p-8 mb-8">
            <h2 className="font-display font-700 text-ink-50 text-xl mb-6 flex items-center gap-2">
              <Key className="w-5 h-5 text-acid" /> How to get your embed key
            </h2>
            <ol className="space-y-4">
              {[
                { step: '01', title: 'Sign up or log in', desc: 'Create a free Valcr account at valcr.site/signup.' },
                { step: '02', title: 'Upgrade to an Embed plan', desc: 'Go to Pricing and choose Starter ($49/mo), Business ($99/mo), or Agency ($249/mo). Payment via Paystack — cards and M-Pesa accepted.' },
                { step: '03', title: 'Generate your embed key', desc: 'In your Dashboard, click the "Embed Keys" tab. Click "Generate new key", give it a name, and add your domain (e.g. mystore.com). Your key appears instantly.' },
                { step: '04', title: 'Paste the code', desc: 'Copy the snippet below, replace YOUR_EMBED_KEY_HERE with your actual key, and paste it anywhere in your HTML — the calculator renders right there.' },
              ].map(({ step, title, desc }) => (
                <li key={step} className="flex gap-4">
                  <span className="w-8 h-8 shrink-0 bg-acid/10 border border-acid/20 rounded-lg flex items-center justify-center text-xs font-mono font-700 text-acid">{step}</span>
                  <div>
                    <p className="font-display font-700 text-ink-100 text-sm mb-0.5">{title}</p>
                    <p className="text-ink-400 text-sm">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Code builder */}
          <div className="card p-8 mb-8">
            <h2 className="font-display font-700 text-ink-50 text-xl mb-6">Build your embed code</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="label">Calculator</label>
                <select value={selectedSlug} onChange={(e) => setSelectedSlug(e.target.value)}
                  className="input-field appearance-none cursor-pointer">
                  {CALCULATORS.filter((c) => c.category === 'ecommerce').map((c) => (
                    <option key={c.slug} value={c.slug} className="bg-ink-800">{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Theme</label>
                <select value={theme} onChange={(e) => setTheme(e.target.value)}
                  className="input-field appearance-none cursor-pointer">
                  <option value="dark" className="bg-ink-800">Dark</option>
                  <option value="light" className="bg-ink-800">Light</option>
                  <option value="auto" className="bg-ink-800">Auto (match system)</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <pre className="bg-ink-800 border border-ink-700 rounded-xl p-5 text-sm font-mono text-ink-200 overflow-x-auto leading-relaxed">
                <code>{embedCode}</code>
              </pre>
              <button onClick={copyCode}
                className="absolute top-3 right-3 p-2 bg-ink-700 hover:bg-ink-600 rounded-lg text-ink-300 hover:text-ink-100 transition-all"
                title="Copy code">
                {copied ? <Check className="w-4 h-4 text-acid" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="mt-4 p-3 bg-ink-800/60 border border-ink-700 rounded-xl">
              <p className="text-xs text-ink-400 leading-relaxed">
                <span className="text-acid font-700">Important:</span> Replace{' '}
                <code className="text-ink-200 bg-ink-700 px-1.5 py-0.5 rounded">YOUR_EMBED_KEY_HERE</code>{' '}
                with the actual key from your Dashboard. The widget will not load with the placeholder.
                Your key looks like: <code className="text-acid bg-ink-700 px-1.5 py-0.5 rounded">emb_live_a1b2c3d4e5f6...</code>
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-12">
            <h2 className="font-display font-700 text-ink-50 text-xl mb-5 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-acid" /> Frequently asked questions
            </h2>
            <div className="space-y-2">
              {FAQS.map((faq, i) => (
                <div key={i} className="card overflow-hidden">
                  <button
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-ink-800/40 transition-colors"
                  >
                    <span className="font-display font-700 text-ink-100 text-sm">{faq.q}</span>
                    {faqOpen === i ? <ChevronUp className="w-4 h-4 text-ink-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-ink-500 shrink-0" />}
                  </button>
                  {faqOpen === i && (
                    <div className="px-5 pb-5 text-ink-400 text-sm leading-relaxed border-t border-ink-800 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="card p-8 text-center border-acid/20">
            <h2 className="font-display font-800 text-2xl text-ink-50 mb-3">Ready to embed?</h2>
            <p className="text-ink-400 mb-6 max-w-md mx-auto">
              Get your embed key in under 2 minutes. Paystack accepts cards and M-Pesa.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/signup?plan=embed-starter" className="btn-primary">
                <Zap className="w-4 h-4" /> Starter — $49/mo
              </Link>
              <Link to="/pricing" className="btn-secondary">See all embed plans</Link>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
