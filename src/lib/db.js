import { openDB } from "idb"

export const db = await openDB('reparto', 2, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('clients')) {
      db.createObjectStore('clients', { keyPath: 'id', autoIncrement: true })
    }

    if (!db.objectStoreNames.contains('products')) {
      db.createObjectStore('products', { keyPath: 'id', autoIncrement: true })
    }
  }
})
