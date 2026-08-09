<template>
  <div class="space-y-2">

    <h3 class="text-lg font-semibold">Datos semanales:</h3>

    <!-- Stats -->
    <div class="grid grid-cols-2 gap-2">
      <div
        class="flex items-center gap-3 rounded-lg p-2.5 bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
        <ChartNoAxesCombined size="20" />
        <div>
          <div class="text-orange-700 dark:text-orange-300 text-sm -mb-1">Total</div>
          <div class="text-lg font-bold">${{ formatPrice(weeklyTotal) }}</div>
        </div>
      </div>
      <div
        class="flex items-center gap-3 rounded-lg p-2.5 bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300">
        <Coins size="20" />
        <div>
          <div class="text-green-700 dark:text-green-300 text-sm -mb-1">Ganancia</div>
          <div class="text-lg font-bold">${{ formatPrice(ganancia) }}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useSalesStore } from '@/stores/sales'
import { ChartNoAxesCombined, Coins } from 'lucide-vue-next'
import { formatPrice } from '@/lib/utils'

// State
const saleStore = useSalesStore()

// Single pass over the loaded sales: keep only the current week's sales and
// sum their totals.
const weeklyStats = computed(() => {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay()) // Sunday as start
  startOfWeek.setHours(0, 0, 0, 0)
  const endOfWeek = startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000

  let total = 0

  for (const sale of saleStore.sales) {
    if (!sale.date) continue

    const t = new Date(sale.date).getTime()
    if (t < startOfWeek.getTime() || t >= endOfWeek) continue

    total += sale.total
  }

  return total
})

const weeklyTotal = computed(() => weeklyStats.value)

// Ganancia = 10% of the week's total
const ganancia = computed(() => weeklyTotal.value * 0.1)

// Lifecycle hooks
onMounted(() => {
  saleStore.loadSales()
})
</script>
