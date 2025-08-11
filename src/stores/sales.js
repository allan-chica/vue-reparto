import { defineStore } from 'pinia'
import { db } from '@/lib/db'

export const useSalesStore = defineStore('sales', {
  state: () => ({
    sales: [],
  }),

  actions: {
    async loadSales() {
      this.sales = await db.getAll('sales')
    },

    async addSale(sale) {
      const id = await db.add('sales', sale)
      this.sales.push({ ...sale, id })
    },

    async updateSale(updatedSale) {
      await db.put('sales', updatedSale)
      const index = this.sales.findIndex(p => p.id === updatedSale.id)
      if (index !== -1) this.sales[index] = updatedSale
    },

    async deleteSale(id) {
      await db.delete('sales', id)
      this.sales = this.sales.filter(c => c.id !== id)
    },

    async getSaleById(id) {
      return await db.get('sales', id)
    }
  },
})
