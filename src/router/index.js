import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '@/layouts/MainLayout.vue'

// Lazy-load views: on a low-end phone, parsing every view on startup is
// wasteful. These chunks are fetched (and parsed) only when their route is
// actually opened.
const ClientsView = () => import('@/views/ClientsView.vue')
const ClientFormView = () => import('@/views/ClientFormView.vue')
const FoodsView = () => import('@/views/FoodsView.vue')
const FoodFormView = () => import('@/views/FoodFormView.vue')
const SalesView = () => import('@/views/SalesView.vue')
const SaleFormView = () => import('@/views/SaleFormView.vue')
const SaleDetailView = () => import('@/views/SaleDetailView.vue')
const SaleEditView = () => import('@/views/SaleEditView.vue')

const routes = [
  {
    path: '/',
    // redirect: '/sales'
    component: MainLayout,
    children: [
      {
        path: '/',
        redirect: '/sales'
      },

      // Clients
      {
        path: 'clients',
        component: ClientsView,
        name: 'Clientes'
      },
      {
        path: '/clients/new',
        component: ClientFormView,
        name: 'Nuevo cliente'
      },
      {
        path: '/clients/edit/:id',
        component: ClientFormView,
        name: 'Editar cliente',
        props: true
      },

      // Foods
      {
        path: '/foods',
        component: FoodsView,
        name: 'Productos'
      },
      {
        path: '/foods/new',
        component: FoodFormView,
        name: 'Nuevo producto'
      },
      {
        path: '/foods/edit/:id',
        component: FoodFormView,
        name: 'Editar producto',
        props: true
      },

      // Sales
      {
        path: '/sales',
        component: SalesView,
        name: 'Ventas'
      },
    ]
  },

  {
    path: '/sales/new',
    component: SaleFormView,
    name: 'Nueva venta'
  },

  {
    path: '/sale/:id',
    component: SaleDetailView,
    name: 'Detalle venta',
    props: true
  },

  {
    path: '/sale/edit/:id',
    component: SaleEditView,
    name: 'Editar venta',
    props: true
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
