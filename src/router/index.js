import { createRouter, createWebHistory } from 'vue-router'

import ClientsView from '@/views/ClientsView.vue'
import FoodsView from '@/views/FoodsView.vue'
import SalesView from '@/views/SalesView.vue'

const routes = [
  { path: '/', redirect: '/sales' },
  { path: '/clients', component: ClientsView, name: 'Clientes' },
  { path: '/foods', component: FoodsView, name: 'Productos' },
  { path: '/sales', component: SalesView, name: 'Ventas' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
