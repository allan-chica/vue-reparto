import { openDB } from "idb"

const DB_NAME = 'reparto'
const DB_VERSION = 3

export const db = await openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {

    // Clients
    if (!db.objectStoreNames.contains('clients')) {
      const store = db.createObjectStore('clients', { keyPath: 'id', autoIncrement: true })
      store.createIndex('name', 'name', { unique: false })
    }

    // Products
    if (!db.objectStoreNames.contains('products')) {
      const store = db.createObjectStore('products', { keyPath: 'id', autoIncrement: true })
      store.createIndex('name', 'name', { unique: false })
      store.createIndex('price', 'price', { unique: false })
    }

    // Sales
    if (!db.objectStoreNames.contains('sales')) {
      const store = db.createObjectStore('sales', { keyPath: 'id', autoIncrement: true })
      store.createIndex('date', 'date', { unique: false })
      store.createIndex('clientId', 'client.id', { unique: false })
    }
  }
})
