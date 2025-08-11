import { defineStore } from 'pinia'
import { db } from '@/lib/db'

export const useClientsStore = defineStore('clients', {
  state: () => ({
    clients: []
  }),

  actions: {
    async loadClients() {
      this.clients = await db.getAll('clients')
    },

    async addClient(client) {
      const id = await db.add('clients', client)
      this.clients.push({ ...client, id })
    },

    async updateClient(updatedClient) {
      await db.put('clients', updatedClient)
      const index = this.clients.findIndex(c => c.id === updatedClient.id)
      if (index !== -1) this.clients[index] = updatedClient
    },

    async deleteClient(id) {
      await db.delete('clients', id)
      this.clients = this.clients.filter(c => c.id !== id)
    },

    async getClientById(id) {
      return await db.get('clients', id)
    }
  },
})
