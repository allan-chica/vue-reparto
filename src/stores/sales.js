import { defineStore } from 'pinia'
import { db } from '@/lib/db'

// How many sales to keep in memory / fetch from IndexedDB at a time. The list
// only ever renders a slice of this, and old sales are fetched lazily.
const PAGE_SIZE = 100

export const useSalesStore = defineStore('sales', {
  state: () => ({
    sales: [],
    // Guard so multiple components mounting at once don't re-read IndexedDB
    loaded: false,
    // Total number of sales in the database (for the "Mostrando X de Y" count)
    total: 0,
    // Whether older sales still exist in IndexedDB beyond the loaded window
    hasMore: true,
    // Date of the oldest sale currently loaded; paging continues below it
    oldestLoadedDate: null
  }),

  actions: {
    async loadSales() {
      if (this.loaded) return
      this.loaded = true
      this.total = await db.count('sales')
      await this.loadOlderSales()
    },

    // Fetch the next page of sales (the newest unloaded ones) from IndexedDB.
    // Iterates the `date` index backwards, so each call loads the sales right
    // below the oldest one already in memory.
    async loadOlderSales() {
      if (!this.hasMore) return 0

      const existingIds = new Set(this.sales.map(s => s.id))

      // Inclusive upper bound + id dedupe: sales sharing the exact same
      // timestamp across a page boundary are re-read and skipped, never lost.
      const range = this.oldestLoadedDate == null
        ? null
        : IDBKeyRange.upperBound(this.oldestLoadedDate)

      const tx = db.transaction('sales')
      const index = tx.store.index('date')
      let cursor = await index.openCursor(range, 'prev')

      const fetched = []
      while (cursor && fetched.length < PAGE_SIZE) {
        if (!existingIds.has(cursor.value.id)) {
          fetched.push(cursor.value)
        }
        cursor = await cursor.continue()
      }

      if (fetched.length > 0) {
        this.sales.push(...fetched)
        this.oldestLoadedDate = fetched[fetched.length - 1].date
      }
      if (!cursor) this.hasMore = false

      return fetched.length
    },

    async addSale(sale) {
      const id = await db.add('sales', sale)
      this.sales.push({ ...sale, id })
      this.total++
      return id
    },

    async updateSale(updatedSale) {
      await db.put('sales', updatedSale)
      const index = this.sales.findIndex(p => p.id === updatedSale.id)
      if (index !== -1) this.sales[index] = updatedSale
    },

    async deleteSale(id) {
      await db.delete('sales', id)
      this.sales = this.sales.filter(c => c.id !== id)
      if (this.total > 0) this.total--
    },

    async getSaleById(id) {
      return await db.get('sales', id)
    },

    async markSalePaid(id, paymentType, details = null) {
      const sale = await this.getSaleById(id)
      if (!sale) throw new Error('Sale not found')

      sale.isPaid = true
      sale.payment = { type: paymentType, details }
      await this.updateSale(sale)
    },

    async markSaleUnpaid(id) {
      const sale = await this.getSaleById(id)
      if (!sale) throw new Error('Sale not found')

      sale.isPaid = false
      sale.payment = { type: null, details: null }
      await this.updateSale(sale)
    },
  },
})
