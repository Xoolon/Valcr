import { useState } from 'react'
import { MessageSquare, X, Send, CheckCircle } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export function SupportWidget() {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const r = await fetch(`${API}/analytics/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (r.ok) {
        setSubmitted(true)
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setError('Could not connect. Please try again shortly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => { setOpen(true); setSubmitted(false) }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-acid rounded-full flex items-center justify-center shadow-lg hover:bg-acid-light transition-all hover:-translate-y-0.5"
        aria-label="Contact support"
      >
        <MessageSquare className="w-6 h-6 text-ink-950" />
      </button>

      {/* Overlay + modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative card w-full max-w-md p-6 border-ink-700 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display font-700 text-ink-50 text-lg">Contact Support</h3>
                <p className="text-xs text-ink-500 mt-0.5">We respond within 24 hours</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-ink-500 hover:text-ink-200 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-acid mx-auto mb-4" />
                <p className="font-display font-700 text-ink-50 mb-2">Message sent!</p>
                <p className="text-ink-400 text-sm">We will get back to you at {form.email || 'your email'} within 24 hours.</p>
                <button
                  onClick={() => setOpen(false)}
                  className="btn-secondary mt-6 text-sm"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      className="input-field text-sm"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      className="input-field text-sm"
                      placeholder="you@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Topic</label>
                  <select
                    value={form.subject}
                    onChange={(e) => set('subject', e.target.value)}
                    className="input-field text-sm"
                  >
                    <option value="">Select a topic...</option>
                    <option value="Embed widget not loading">Embed widget not loading</option>
                    <option value="Billing or subscription issue">Billing or subscription issue</option>
                    <option value="Calculator giving wrong results">Calculator giving wrong results</option>
                    <option value="Account or login issue">Account or login issue</option>
                    <option value="Feature request">Feature request</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                    rows={4}
                    className="input-field text-sm resize-none"
                    placeholder="Describe your issue in detail..."
                  />
                </div>
                {error && (
                  <p className="text-red-400 text-xs">{error}</p>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary w-full justify-center disabled:opacity-60"
                >
                  {loading ? 'Sending...' : <><Send className="w-4 h-4" />Send message</>}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}