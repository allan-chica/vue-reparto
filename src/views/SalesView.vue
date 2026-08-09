<template>
  <div class="p-6 max-w-xl mx-auto flex flex-col h-full">

    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Ventas</h1>
      <Button type="submit" @click="router.push('/sales/new')">Nueva Venta</Button>
    </div>

    <div class="mb-4">
      <WeeklyEarnings />
    </div>

    <div class="flex-1 min-h-0">
      <ScrollArea class="h-full">
        <div v-for="group in groupedSalesArray" :key="group.day">

          <!-- Sticky date header -->
          <div class="sticky top-0 bg-background/95 backdrop-blur-sm py-2 px-3 border-b">
            <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {{ group.day }}
            </h3>
          </div>

          <div v-for="sale in group.sales" :key="sale.id" @click="router.push(`/sale/${sale.id}`)"
            class="p-3 hover:bg-muted rounded-md cursor-pointer mb-2 flex justify-between items-center" :class="{
              'border-l-3 border-red-700 dark:border-red-300': !sale.isPaid, // No pagado
              'border-l-3 border-sky-700 dark:border-sky-300': isPaidStatus(sale, 'debt'), // Transferencia
              'border-l-3 border-green-700 dark:border-green-300': isPaidStatus(sale, 'cash'), // Efectivo
              'border-l-3 border-orange-700 dark:border-orange-300': isPaidStatus(sale, 'mix') // Mixto
            }">
            <div class="flex-1 flex gap-3 items-center">
              <StatusIcon :sale="sale" />
              <div>
                <p class="text-lg font-semibold">{{ sale.client.name }}</p>
                <p class="text-muted-foreground">{{ formatSaleTime(sale.date) }}</p>
              </div>
            </div>

            <div class="bg-stone-100 dark:bg-stone-900 p-2 rounded-md">
              <p class="font-semibold">${{ formatPrice(sale.total) }}</p>
            </div>
          </div>

        </div>

        <!-- Pagination: only render a slice of sales at a time -->
        <div v-if="hasMore" class="py-4 flex flex-col items-center gap-2">
          <p class="text-sm text-muted-foreground">
            Mostrando {{ visibleSales.length }} de {{ sortedSales.length }} ventas
          </p>
          <Button variant="outline" @click="loadMore">Cargar más</Button>
        </div>
      </ScrollArea>
    </div>

  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSalesStore } from '@/stores/sales'
import { computed, onMounted, ref } from 'vue'
import StatusIcon from '@/components/StatusIcon.vue'
import WeeklyEarnings from '@/components/WeeklyEarnings.vue'
import { formatPrice, formatSaleDay, formatSaleTime } from '@/lib/utils'

const router = useRouter()
const saleStore = useSalesStore()

const sales = computed(() => saleStore.sales)

// Render only the first PAGE_SIZE sales; the rest load on demand. This keeps
// the DOM small (hundreds of sales would otherwise become hundreds of nodes,
// which is what made scrolling/tapping laggy on low-end phones).
const PAGE_SIZE = 50
const visibleCount = ref(PAGE_SIZE)

const sortedSales = computed(() => {
  // Sort newest first
  return [...sales.value].sort((a, b) => b.date - a.date)
})

const visibleSales = computed(() => sortedSales.value.slice(0, visibleCount.value))

const groupedSalesArray = computed(() => {
  // Group only the visible slice by day
  const groups = visibleSales.value.reduce((acc, sale) => {
    const day = formatSaleDay(sale.date)
    if (!acc[day]) {
      acc[day] = []
    }
    acc[day].push(sale)
    return acc
  }, {})

  return Object.entries(groups).map(([day, sales]) => ({
    day,
    sales
  }))
})

const hasMore = computed(() => visibleCount.value < sortedSales.value.length)

const loadMore = () => {
  visibleCount.value += PAGE_SIZE
}

// Methods
const isPaidStatus = (sale, status) => {
  return sale.isPaid && sale.payment.type === status
}

onMounted(() => {
  saleStore.loadSales()
})
</script>
