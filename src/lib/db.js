import { openDB } from "idb"

export const db = await openDB('reparto', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('clients')) {
      db.createObjectStore('clients', { keyPath: 'id', autoIncrement: true })
    }
  }
})
