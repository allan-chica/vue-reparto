import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// --- Cached Intl formatters -------------------------------------------------
// Instantiating Intl formatters is expensive (especially on low-end devices),
// so create each one once and reuse it everywhere instead of calling
// `new Intl.NumberFormat()` / `toLocaleDateString()` per item per render.
const priceFormatter = new Intl.NumberFormat('es-AR')

const saleDayFormatter = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
})

const saleTimeFormatter = new Intl.DateTimeFormat('es-ES', {
  hour: '2-digit',
  minute: '2-digit'
})

const fullDateFormatter = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})

const receiptDateFormatter = new Intl.DateTimeFormat('es-AR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
})

export const formatPrice = price => priceFormatter.format(price)

export const formatSaleDay = date => saleDayFormatter.format(new Date(date))

export const formatSaleTime = date => saleTimeFormatter.format(new Date(date))

export const formatFullDate = date => fullDateFormatter.format(new Date(date))

export const formatReceiptDate = date => receiptDateFormatter.format(new Date(date))

// --- List helpers -----------------------------------------------------------
// Filter + sort a list of `{ name }` items. Always works on a copy: the
// previous pattern `filtered.sort(...)` mutated the Pinia store's array when
// the query was empty, which corrupted state and caused extra re-renders.
export function searchAndSortByName(items, query) {
  const q = (query || '').toLowerCase().trim()
  const filtered = !q
    ? [...items]
    : items.filter(item => item.name.toLowerCase().includes(q))

  return filtered.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  )
}
