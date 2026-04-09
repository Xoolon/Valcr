// src/pages/admin/BlogAdmin.tsx
// Dedicated admin page for creating, editing, and managing blog posts.
// Accessible at /admin/blog — NOT embedded in the main Admin page.
// Add <Route path="/admin/blog" element={<BlogAdminPage />} /> to App.tsx
// Add <Route path="/admin/blog/:slug" element={<BlogAdminPage />} /> for editing.

import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, Plus, Trash2, Eye, EyeOff, Save,
  ExternalLink, Search, Clock, BarChart2, Pencil,
  CheckCircle, AlertCircle, X, ChevronDown, ChevronUp,
} from 'lucide-react'
import { SEOHead } from '@/components/SEOHead'
import { useAuthStore } from '@/store'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const CALCULATOR_OPTIONS = [
  { value: '', label: 'None (no calculator CTA)' },
  { value: 'shopify-profit-margin', label: 'Shopify Profit Margin' },
  { value: 'true-landed-cost', label: 'True Landed Cost' },
  { value: 'roas-calculator', label: 'ROAS Calculator' },
  { value: 'customer-acquisition-cost', label: 'Customer Acquisition Cost' },
  { value: 'amazon-fba-calculator', label: 'Amazon FBA Calculator' },
  { value: 'break-even-units', label: 'Break-Even Units' },
  { value: 'cash-flow-runway', label: 'Cash Flow Runway' },
  { value: 'subscription-ltv', label: 'Subscription LTV' },
  { value: 'inventory-reorder-point', label: 'Inventory Reorder Point' },
  { value: 'pricing-strategy', label: 'Pricing Strategy' },
  { value: 'refund-rate-impact', label: 'Refund Rate Impact' },
  { value: 'bundle-pricing-optimizer', label: 'Bundle Pricing Optimizer' },
  { value: 'influencer-roi-calculator', label: 'Influencer ROI Calculator' },
  { value: 'chargeback-impact', label: 'Chargeback Impact' },
  { value: 'shipping-cost-optimizer', label: 'Shipping Cost Optimizer' },
  { value: 'wholesale-margin-calculator', label: 'Wholesale Margin' },
  { value: 'etsy-fee-calculator', label: 'Etsy Fee Calculator' },
  { value: 'profit-per-sku', label: 'Profit Per SKU' },
  { value: 'ad-spend-budget-calculator', label: 'Ad Spend Budget' },
  { value: 'email-marketing-roi', label: 'Email Marketing ROI' },
]

const CATEGORIES = [
  'Updates', 'Margins', 'Advertising', 'Inventory', 'Subscriptions',
  'Amazon', 'Payments', 'Operations', 'Finance', 'Product',
]

const AUTO_READ_TIME = (content: string): string => {
  const words = content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length
  const mins = Math.max(1, Math.round(words / 200))
  return `${mins} min read`
}

// ── Toolbar for the rich editor ───────────────────────────────────────────────
function Toolbar({ onInsert }: { onInsert: (html: string, wrap?: boolean) => void }) {
  const btn = (label: string, html: string, wrap = false) => (
    <button type="button" onClick={() => onInsert(html, wrap)}
      className="px-2 py-1 text-xs font-mono text-ink-400 hover:text-acid hover:bg-acid/10 rounded transition-colors"
      title={label}>
      {label}
    </button>
  )
  return (
    <div className="flex flex-wrap gap-0.5 p-2 bg-ink-800 rounded-t-xl border border-ink-700 border-b-0">
      {btn('H2', '<h2></h2>', true)}
      {btn('H3', '<h3></h3>', true)}
      {btn('p', '<p></p>', true)}
      {btn('bold', '<strong></strong>', true)}
      {btn('em', '<em></em>', true)}
      {btn('ul', '<ul>\n  <li></li>\n</ul>', false)}
      {btn('ol', '<ol>\n  <li></li>\n</ol>', false)}
      {btn('li', '<li></li>', true)}
      {btn('link', '<a href="URL">text</a>', false)}
      {btn('valcr.site', '<a href="https://valcr.site">valcr.site</a>', false)}
      <div className="w-px h-5 bg-ink-700 mx-1 self-center" />
      <span className="text-xs font-mono text-ink-700 self-center px-1">
        HTML — paste content directly
      </span>
    </div>
  )
}

// ── Post list view ────────────────────────────────────────────────────────────
function PostList() {
  const { token } = useAuthStore()
  const navigate = useNavigate()
  const h = { Authorization: `Bearer ${token}` }

  const [posts, setPosts] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = async (q = '') => {
    setLoading(true)
    const p = new URLSearchParams({ limit: '50', offset: '0', ...(q && { search: q }) })
    const r = await fetch(`${API}/blog/admin/all?${p}`, { headers: h })
    if (r.ok) { const d = await r.json(); setPosts(d.posts); setTotal(d.total) }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleSearch = (v: string) => { setSearch(v); load(v) }

  const togglePublish = async (post: any) => {
    await fetch(`${API}/blog/${post.slug}`, {
      method: 'PATCH', headers: { ...h, 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_published: !post.is_published }),
    })
    load(search)
  }

  const deletePost = async (slug: string) => {
    if (!confirm(`Delete "${slug}" permanently? This cannot be undone.`)) return
    setDeleting(slug)
    await fetch(`${API}/blog/${slug}`, { method: 'DELETE', headers: h })
    setDeleting(null)
    load(search)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-700 text-ink-50 text-xl">All Posts</h2>
          <p className="text-ink-500 text-sm mt-0.5">{total} total</p>
        </div>
        <button onClick={() => navigate('/admin/blog/new')} className="btn-primary">
          <Plus className="w-4 h-4" />New Post
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-600 pointer-events-none" />
        <input type="text" placeholder="Search posts…" value={search}
          onChange={e => handleSearch(e.target.value)}
          className="input-field pl-9 text-sm" />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4].map(i => <div key={i} className="card p-4 animate-pulse h-16" />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="card p-12 text-center border-dashed border-ink-700">
          <Pencil className="w-8 h-8 text-ink-700 mx-auto mb-3" />
          <p className="text-ink-400 mb-4">No posts yet. Write your first one.</p>
          <button onClick={() => navigate('/admin/blog/new')} className="btn-primary">
            <Plus className="w-4 h-4" />New Post
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-800">
                <th className="text-left p-4 text-xs font-mono text-ink-600 uppercase tracking-widest">Title</th>
                <th className="text-left p-4 text-xs font-mono text-ink-600 uppercase tracking-widest hidden sm:table-cell">Category</th>
                <th className="text-left p-4 text-xs font-mono text-ink-600 uppercase tracking-widest hidden sm:table-cell">Status</th>
                <th className="text-right p-4 text-xs font-mono text-ink-600 uppercase tracking-widest">Views</th>
                <th className="text-right p-4 text-xs font-mono text-ink-600 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="border-b border-ink-800/50 hover:bg-ink-800/20 transition-colors">
                  <td className="p-4">
                    <p className="font-display font-700 text-ink-100 text-sm truncate max-w-xs">{post.title}</p>
                    <p className="text-xs text-ink-600 font-mono mt-0.5">/blog/{post.slug}</p>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className="text-xs font-mono text-acid bg-acid/10 border border-acid/20 px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className={`flex items-center gap-1.5 text-xs font-mono ${post.is_published ? 'text-acid' : 'text-ink-500'}`}>
                      {post.is_published
                        ? <><CheckCircle className="w-3.5 h-3.5" />Published</>
                        : <><AlertCircle className="w-3.5 h-3.5" />Draft</>}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="flex items-center justify-end gap-1 text-xs text-ink-500 font-mono">
                      <BarChart2 className="w-3 h-3" />{(post.views || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => navigate(`/admin/blog/${post.slug}`)}
                        className="p-1.5 text-ink-600 hover:text-acid transition-colors" title="Edit">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => togglePublish(post)}
                        className="p-1.5 text-ink-600 hover:text-sky-400 transition-colors"
                        title={post.is_published ? 'Unpublish' : 'Publish'}>
                        {post.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      {post.is_published && (
                        <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                          className="p-1.5 text-ink-600 hover:text-ink-200 transition-colors" title="View live">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button onClick={() => deletePost(post.slug)} disabled={deleting === post.slug}
                        className="p-1.5 text-ink-600 hover:text-red-400 transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Post editor ───────────────────────────────────────────────────────────────
function PostEditor() {
  const { slug } = useParams<{ slug?: string }>()
  const isNew = slug === 'new'
  const { token } = useAuthStore()
  const navigate = useNavigate()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const h = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const [form, setForm] = useState({
    title: '', subtitle: '', excerpt: '', category: 'Updates',
    content: '', calculator_slug: '', calculator_cta: '',
    keywords: '', read_time: '', author_name: 'Glen Norman Alexander',
    is_published: false,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(!isNew)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [seoOpen, setSeoOpen] = useState(false)

  // Load existing post for editing
  useEffect(() => {
    if (isNew || !slug || !token) return
    fetch(`${API}/blog/${slug}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) setForm({
          title: d.title || '',
          subtitle: d.subtitle || '',
          excerpt: d.excerpt || '',
          category: d.category || 'Updates',
          content: d.content || '',
          calculator_slug: d.calculator_slug || '',
          calculator_cta: d.calculator_cta || '',
          keywords: (d.keywords || []).join(', '),
          read_time: d.read_time || '',
          author_name: d.author_name || 'Glen Norman Alexander',
          is_published: d.is_published || false,
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug, isNew, token])

  const f = (k: string) => (e: any) => {
    const val = e.target?.type === 'checkbox' ? e.target.checked : (e.target?.value ?? e)
    setForm(prev => {
      const next = { ...prev, [k]: val }
      // Auto-calculate read time from content
      if (k === 'content' && !prev.read_time) {
        next.read_time = AUTO_READ_TIME(val)
      }
      return next
    })
  }

  // Toolbar insert helper
  const handleInsert = (html: string, wrap = false) => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = form.content.substring(start, end)
    let insert = html
    if (wrap && selected) {
      // Wrap selected text in the tag
      const tag = html.match(/<([a-z0-9]+)/)?.[1] || ''
      if (tag) insert = `<${tag}>${selected}</${tag}>`
    }
    const newContent = form.content.substring(0, start) + insert + form.content.substring(end)
    setForm(prev => ({ ...prev, content: newContent }))
    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + insert.length, start + insert.length)
    }, 10)
  }

  const save = async (publish?: boolean) => {
    if (!form.title.trim()) { setError('Title is required'); return }
    if (!form.excerpt.trim()) { setError('Excerpt is required'); return }
    if (!form.content.trim()) { setError('Content is required'); return }
    setSaving(true); setError(''); setSaved(false)

    const payload = {
      title: form.title,
      subtitle: form.subtitle || undefined,
      excerpt: form.excerpt,
      category: form.category,
      content: form.content,
      calculator_slug: form.calculator_slug || undefined,
      calculator_cta: form.calculator_cta || undefined,
      keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean),
      read_time: form.read_time || AUTO_READ_TIME(form.content),
      author_name: form.author_name,
      is_published: publish !== undefined ? publish : form.is_published,
    }

    try {
      let res
      if (isNew) {
        res = await fetch(`${API}/blog`, {
          method: 'POST', headers: h, body: JSON.stringify(payload)
        })
      } else {
        res = await fetch(`${API}/blog/${slug}`, {
          method: 'PATCH', headers: h, body: JSON.stringify(payload)
        })
      }
      if (!res.ok) {
        const d = await res.json()
        setError(d.detail || 'Save failed')
      } else {
        const d = await res.json()
        setSaved(true)
        if (isNew) navigate(`/admin/blog/${d.slug}`, { replace: true })
        else setForm(prev => ({ ...prev, is_published: d.is_published }))
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (e: any) {
      setError(e.message || 'Network error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="space-y-4">
      {[1,2,3].map(i => <div key={i} className="card p-6 animate-pulse h-16" />)}
    </div>
  )

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="font-display font-700 text-ink-50 text-xl">
          {isNew ? 'New Post' : `Editing: ${form.title || slug}`}
        </h2>
        <div className="flex items-center gap-3 flex-wrap">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-acid">
              <CheckCircle className="w-4 h-4" />Saved
            </span>
          )}
          {error && (
            <span className="flex items-center gap-1.5 text-sm text-red-400">
              <AlertCircle className="w-4 h-4" />{error}
            </span>
          )}
          {!isNew && !form.is_published && (
            <button onClick={() => save(true)} disabled={saving} className="btn-primary text-sm">
              <Eye className="w-4 h-4" />{saving ? 'Publishing…' : 'Publish'}
            </button>
          )}
          {!isNew && form.is_published && (
            <button onClick={() => save(false)} disabled={saving} className="btn-secondary text-sm">
              <EyeOff className="w-4 h-4" />Unpublish
            </button>
          )}
          <button onClick={() => save()} disabled={saving} className="btn-secondary text-sm">
            <Save className="w-4 h-4" />{saving ? 'Saving…' : 'Save draft'}
          </button>
          {!isNew && form.is_published && (
            <a href={`/blog/${slug}`} target="_blank" rel="noopener noreferrer"
              className="btn-secondary text-sm">
              <ExternalLink className="w-4 h-4" />View live
            </a>
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="label">Title *</label>
        <input type="text" className="input-field font-display text-lg"
          placeholder="How to Calculate Your True Shopify Profit Margin"
          value={form.title} onChange={f('title')} />
        <p className="text-xs text-ink-600 mt-1.5">
          Slug: /blog/{form.title ? form.title.toLowerCase().replace(/[^\w\s-]/g,'').replace(/[\s_]+/g,'-').substring(0,60) : '(generated from title)'}
        </p>
      </div>

      {/* Excerpt */}
      <div>
        <label className="label">Excerpt * <span className="text-ink-700 normal-case">(shown on blog list cards and in Google search)</span></label>
        <textarea rows={2} className="input-field resize-none"
          placeholder="A 1–3 sentence description that makes someone want to read the article."
          value={form.excerpt} onChange={f('excerpt')} />
        <p className="text-xs text-ink-600 mt-1">{form.excerpt.length} / 300 recommended</p>
      </div>

      {/* Content editor */}
      <div>
        <label className="label">Content * <span className="text-ink-700 normal-case">(HTML supported — use toolbar for quick tags)</span></label>
        <Toolbar onInsert={handleInsert} />
        <textarea
          ref={textareaRef}
          rows={30}
          className="input-field font-mono text-sm rounded-t-none border-t-0 resize-y"
          placeholder={`<h2>Section Title</h2>\n<p>Your content here. Use HTML tags for formatting.</p>\n\n<h3>Sub-section</h3>\n<p>More content...</p>\n<ul>\n  <li>Item one</li>\n  <li>Item two</li>\n</ul>`}
          value={form.content}
          onChange={f('content')}
          spellCheck={false}
        />
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-xs text-ink-600">
            {form.content.replace(/<[^>]+>/g,'').split(/\s+/).filter(Boolean).length} words ·{' '}
            {AUTO_READ_TIME(form.content)}
          </p>
          <button type="button" onClick={() => setPreviewOpen(!previewOpen)}
            className="text-xs text-acid hover:underline flex items-center gap-1">
            {previewOpen ? <><ChevronUp className="w-3 h-3"/>Hide preview</> : <><Eye className="w-3 h-3"/>Preview</>}
          </button>
        </div>
      </div>

      {/* Inline preview */}
      {previewOpen && form.content && (
        <div className="card p-6 border-acid/20">
          <p className="text-xs font-mono text-acid uppercase tracking-widest mb-4">Preview</p>
          <div className="prose-valcr" dangerouslySetInnerHTML={{ __html: form.content }} />
        </div>
      )}

      {/* Metadata row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="label">Category</label>
          <select value={form.category} onChange={f('category')} className="input-field text-sm">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Read time</label>
          <input type="text" className="input-field text-sm"
            placeholder="Auto-calculated"
            value={form.read_time} onChange={f('read_time')} />
        </div>
        <div>
          <label className="label">Author</label>
          <input type="text" className="input-field text-sm"
            value={form.author_name} onChange={f('author_name')} />
        </div>
      </div>

      {/* Calculator CTA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Calculator CTA (optional)</label>
          <select value={form.calculator_slug} onChange={f('calculator_slug')} className="input-field text-sm">
            {CALCULATOR_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label">CTA button text</label>
          <input type="text" className="input-field text-sm"
            placeholder="Calculate your Shopify profit margin"
            value={form.calculator_cta} onChange={f('calculator_cta')}
            disabled={!form.calculator_slug} />
        </div>
      </div>

      {/* SEO section (collapsible) */}
      <div className="card p-5">
        <button type="button" onClick={() => setSeoOpen(!seoOpen)}
          className="flex items-center justify-between w-full text-left">
          <span className="font-display font-700 text-ink-100 text-sm">SEO Settings</span>
          {seoOpen ? <ChevronUp className="w-4 h-4 text-ink-500" /> : <ChevronDown className="w-4 h-4 text-ink-500" />}
        </button>
        {seoOpen && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="label">
                Subtitle / Meta description{' '}
                <span className="text-ink-700 normal-case">(overrides excerpt in search results if set)</span>
              </label>
              <textarea rows={2} className="input-field resize-none text-sm"
                placeholder="Slightly more detailed version of the excerpt for search engines."
                value={form.subtitle} onChange={f('subtitle')} />
            </div>
            <div>
              <label className="label">
                Keywords <span className="text-ink-700 normal-case">(comma-separated)</span>
              </label>
              <input type="text" className="input-field text-sm"
                placeholder="shopify profit margin, how to calculate shopify fees, true margin calculator"
                value={form.keywords} onChange={f('keywords')} />
              <p className="text-xs text-ink-600 mt-1">
                Use the exact phrases people search for. Check Google autocomplete.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Status */}
      <div className="card p-4 border-ink-700 flex items-center justify-between">
        <div>
          <p className="text-sm font-display font-700 text-ink-100">
            Status: <span className={form.is_published ? 'text-acid' : 'text-ink-400'}>
              {form.is_published ? 'Published' : 'Draft'}
            </span>
          </p>
          <p className="text-xs text-ink-600 mt-0.5">
            {form.is_published
              ? `Live at valcr.site/blog/${slug}`
              : 'Only visible to admins until published'}
          </p>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <div onClick={() => setForm(p => ({ ...p, is_published: !p.is_published }))}
            className={`w-11 h-6 rounded-full transition-colors relative ${form.is_published ? 'bg-acid' : 'bg-ink-700'}`}>
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${form.is_published ? 'translate-x-5' : 'translate-x-1'}`} />
          </div>
          <span className="text-sm text-ink-200">{form.is_published ? 'Published' : 'Draft'}</span>
        </label>
      </div>

      {/* Bottom save */}
      <div className="flex gap-3 pt-2">
        <button onClick={() => save()} disabled={saving} className="btn-primary">
          <Save className="w-4 h-4" />{saving ? 'Saving…' : isNew ? 'Create post' : 'Save changes'}
        </button>
        {!form.is_published && (
          <button onClick={() => save(true)} disabled={saving} className="btn-secondary">
            <Eye className="w-4 h-4" />Save & Publish
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main page — switches between list and editor ──────────────────────────────
export function BlogAdminPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { slug } = useParams<{ slug?: string }>()
  const isEditing = !!slug

  if (!user?.isAdmin) {
    return (
      <div className="pt-28 pb-20 px-4 text-center">
        <p className="text-ink-400 mb-4">Admin access required.</p>
        <Link to="/" className="btn-primary">Go home</Link>
      </div>
    )
  }

  return (
    <>
      <SEOHead title="Blog Admin | Valcr" description="Blog admin." noIndex />
      <div className="pt-20 pb-20 px-4 sm:px-6 min-h-screen">
        <div className="max-w-5xl mx-auto">

          {/* Header nav */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/admin" className="flex items-center gap-2 text-sm text-ink-500 hover:text-ink-200 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />Admin
            </Link>
            <span className="text-ink-700">/</span>
            {isEditing ? (
              <>
                <button onClick={() => navigate('/admin/blog')}
                  className="text-sm text-ink-500 hover:text-ink-200 transition-colors">
                  Blog
                </button>
                <span className="text-ink-700">/</span>
                <span className="text-sm text-ink-300">{slug === 'new' ? 'New Post' : slug}</span>
              </>
            ) : (
              <span className="text-sm text-ink-300">Blog</span>
            )}
          </div>

          {isEditing ? <PostEditor /> : <PostList />}
        </div>
      </div>
    </>
  )
}
