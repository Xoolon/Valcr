/**
 * Internal promotion system.
 * Admin triggers promotions from the admin panel.
 * Users who opted into marketing emails receive them via Brevo.
 * In-app promotions show as notification cards in the notification bell.
 */

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export interface PromotionPayload {
  title: string
  body: string
  cta_label: string
  cta_url: string
  target: 'all' | 'free' | 'pro' | 'email_only'
  send_email: boolean
  send_notification: boolean
}

export async function sendPromotion(payload: PromotionPayload, token: string): Promise<void> {
  await fetch(`${API}/admin/promotions/send`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}