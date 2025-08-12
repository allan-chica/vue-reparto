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
