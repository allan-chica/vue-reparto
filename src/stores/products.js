import { defineStore } from 'pinia'
import { db } from '@/lib/db'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
  }),

  actions: {
    async loadProducts() {
      this.products = await db.getAll('products')
    },

    async addProduct(product) {
      const id = await db.add('products', product)
      this.products.push({ ...product, id })
    },

    async updateProduct(updatedProduct) {
      await db.put('products', updatedProduct)
      const index = this.products.findIndex(p => p.id === updatedProduct.id)
      if (index !== -1) this.products[index] = updatedProduct
    },

    async deleteProduct(id) {
      await db.delete('products', id)
      this.products = this.products.filter(c => c.id !== id)
    },

    async getProductById(id) {
      return await db.get('products', id)
    }
  },
})
