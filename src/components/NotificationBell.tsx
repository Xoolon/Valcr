import { useState, useEffect, useRef } from 'react'
import { Bell, X, Check, CheckCheck, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store'
import clsx from 'clsx'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

interface Notif {
  id: string; title: string; message: string; type: string
  is_read: boolean; action_url: string | null; created_at: string
}

const DOT: Record<string, string> = {
  info: 'bg-sky-400', success: 'bg-acid',
  warning: 'bg-amber-400', error: 'bg-red-400', support: 'bg-purple-400',
}

export function NotificationBell() {
  const { token, isAuthenticated } = useAuthStore()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Notif[]>([])
  const [unread, setUnread] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchNotifs = async () => {
    if (!token || document.visibilityState === 'hidden') return
    try {
      const r = await fetch(`${API}/notifications/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (r.ok) {
        const d = await r.json()
        setItems(d.notifications || [])
        setUnread(d.unread_count || 0)
      }
    } catch { /* silent */ }
  }

  useEffect(() => {
    if (!isAuthenticated) return
    fetchNotifs()
    // Poll every 5 minutes only (not 60s) — reduces DB connections significantly
    intervalRef.current = setInterval(fetchNotifs, 5 * 60 * 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isAuthenticated, token])

  // Close on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const markRead = async (id: string) => {
    try {
      await fetch(`${API}/notifications/${id}/read`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` },
      })
      setItems(p => p.map(n => n.id === id ? { ...n, is_read: true } : n))
      setUnread(p => Math.max(0, p - 1))
    } catch {}
  }

  const markAll = async () => {
    try {
      await fetch(`${API}/notifications/read-all`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` },
      })
      setItems(p => p.map(n => ({ ...n, is_read: true })))
      setUnread(0)
    } catch {}
  }

  const del = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await fetch(`${API}/notifications/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      })
      setItems(p => p.filter(n => n.id !== id))
    } catch {}
  }

  if (!isAuthenticated) return null

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen(!open); if (!open) fetchNotifs() }}
        className="relative p-2 text-ink-400 hover:text-ink-100 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-acid text-ink-950 text-[10px] font-800 rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 sm:w-96 bg-ink-900 border border-ink-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-ink-800">
            <p className="font-display font-700 text-ink-50 text-sm">Notifications</p>
            {unread > 0 && (
              <button onClick={markAll} className="flex items-center gap-1 text-xs text-acid hover:text-acid/80">
                <CheckCheck className="w-3.5 h-3.5" />Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="w-8 h-8 text-ink-700 mx-auto mb-2" />
                <p className="text-ink-500 text-sm">No notifications yet</p>
              </div>
            ) : (
              items.map(n => (
                <div
                  key={n.id}
                  onClick={() => !n.is_read && markRead(n.id)}
                  className={clsx('px-4 py-3 border-b border-ink-800/60 cursor-default',
                    !n.is_read && 'bg-ink-800/40')}
                >
                  <div className="flex items-start gap-3">
                    <span className={clsx('w-2 h-2 rounded-full mt-1.5 shrink-0', DOT[n.type] || 'bg-sky-400')} />
                    <div className="flex-1 min-w-0">
                      <p className={clsx('text-sm font-600 leading-snug', n.is_read ? 'text-ink-400' : 'text-ink-100')}>
                        {n.title}
                      </p>
                      <p className="text-xs text-ink-500 mt-0.5 line-clamp-2">{n.message}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-[10px] text-ink-700 font-mono">
                          {new Date(n.created_at).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-1">
                          {n.action_url && (
                            <Link to={n.action_url} onClick={() => setOpen(false)} className="text-acid hover:text-acid/80">
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                          {!n.is_read && (
                            <button onClick={(e) => { e.stopPropagation(); markRead(n.id) }} className="text-ink-600 hover:text-acid">
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                          <button onClick={(e) => del(n.id, e)} className="text-ink-600 hover:text-red-400">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}