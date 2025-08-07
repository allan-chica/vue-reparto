import { createRouter, createWebHistory } from 'vue-router'

import ClientsView from '@/views/ClientsView.vue'
import ClientFormView from '@/views/ClientFormView.vue'
import FoodsView from '@/views/FoodsView.vue'
import FoodFormView from '@/views/FoodFormView.vue'
import SalesView from '@/views/SalesView.vue'

const routes = [
  { path: '/', redirect: '/sales' },
  { path: '/clients', component: ClientsView, name: 'Clientes' },
  { path: '/clients/new', component: ClientFormView, name: 'Nuevo cliente' },
  { path: '/clients/edit/:id', component: ClientFormView, name: 'Editar cliente', props: true },
  { path: '/foods', component: FoodsView, name: 'Productos' },
  { path: '/foods/new', component: FoodFormView, name: 'Nuevo producto' },
  { path: '/foods/edit/:id', component: FoodFormView, name: 'Editar producto', props: true },
  { path: '/sales', component: SalesView, name: 'Ventas' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
