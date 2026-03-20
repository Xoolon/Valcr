const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
const SESSION_URL = `${API}/telemetry/session`
const INGEST_URL = `${API}/telemetry/events`
const BATCH_INTERVAL_MS = 2000

interface EventPayload {
  event_type: string
  calculator_slug?: string
  field_name?: string
  field_value?: number
  change_count_in_session?: number
  input_snapshot?: Record<string, number | string>
  output_snapshot?: Record<string, unknown>
  time_on_field_ms?: number
  output_view_duration_ms?: number
  referrer?: string
  page_url?: string
  embed_key?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

class TelemetryClient {
  private queue: EventPayload[] = []
  private timer: ReturnType<typeof setTimeout> | null = null
  private optedOut = false

  constructor() {
    this.optedOut = document.cookie.includes('valcr_optout=1')
    if (!this.optedOut) this.initSession()
  }

  private async initSession() {
    try {
      await fetch(SESSION_URL, { method: 'POST', credentials: 'include' })
    } catch {}
  }

  private getToken(): string | null {
    try {
      const raw = localStorage.getItem('valcr-auth')
      return raw ? JSON.parse(raw)?.state?.token || null : null
    } catch { return null }
  }

  emit(event: Partial<EventPayload>): void {
    if (this.optedOut) return
    const params = new URLSearchParams(window.location.search)
    this.queue.push({
      ...event,
      referrer: document.referrer || undefined,
      page_url: window.location.href,
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined,
    } as EventPayload)
    if (!this.timer) {
      this.timer = setTimeout(() => { this.flush(); this.timer = null }, BATCH_INTERVAL_MS)
    }
  }

  async flush(): Promise<void> {
    if (!this.queue.length || this.optedOut) return
    const batch = [...this.queue]
    this.queue = []
    const token = this.getToken()
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    try {
      await fetch(INGEST_URL, {
        method: 'POST', headers, credentials: 'include',
        body: JSON.stringify({ events: batch }), keepalive: true,
      })
    } catch {}
  }

  /**
   * Called on logout — clears the anonymous_id cookie so the next
   * account logged in on this browser gets a completely fresh session.
   * Without this, all accounts on the same browser share one session profile.
   */
  resetSession(): void {
    this.queue = []
    // Expire the cookie immediately
    document.cookie = 'valcr_aid=; max-age=0; path=/; samesite=lax'
    // Re-init will happen next time emit() is called or page loads
    if (!this.optedOut) {
      setTimeout(() => this.initSession(), 500)
    }
  }

  optOut(): void {
    this.optedOut = true
    this.queue = []
    document.cookie = 'valcr_optout=1; max-age=31536000; path=/; samesite=lax'
  }
}

export const telemetryClient = new TelemetryClient()

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') telemetryClient.flush()
})