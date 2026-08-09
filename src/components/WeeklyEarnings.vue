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
        class="flex items-center gap-3 rounded-lg p-2.5 bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300">
        <CircleOff size="20" />
        <div>
          <div class="text-red-700 dark:text-red-300 text-sm -mb-1">Sin pagar</div>
          <div class="text-lg font-bold">${{ formatPrice(weeklyNotPaid) }}</div>
        </div>
      </div>
      <div
        class="flex items-center gap-3 rounded-lg p-2.5 bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300">
        <Banknote size="20" />
        <div>
          <div class="text-green-700 dark:text-green-300 text-sm -mb-1">Efectivo</div>
          <div class="text-lg font-bold">${{ formatPrice(paymentSplit.cash) }}</div>
        </div>
      </div>
      <div
        class="flex items-center gap-3 rounded-lg p-2.5 bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
        <Wallet size="20" />
        <div>
          <div class="text-sky-700 dark:text-sky-300 text-sm -mb-1">Transferencia</div>
          <div class="text-lg font-bold">${{ formatPrice(paymentSplit.debt) }}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useSalesStore } from '@/stores/sales'
import { Banknote, ChartNoAxesCombined, CircleOff, Wallet } from 'lucide-vue-next'
import { formatPrice } from '@/lib/utils'

// State
const saleStore = useSalesStore()

// Single pass over all sales: filter to this week and accumulate every stat at
// once, instead of filtering + reducing the array three separate times.
const weeklyStats = computed(() => {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay()) // Sunday as start
  startOfWeek.setHours(0, 0, 0, 0)
  const endOfWeek = startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000

  const stats = { total: 0, notPaid: 0, cash: 0, debt: 0 }

  for (const sale of saleStore.sales) {
    if (!sale.date) continue

    const t = new Date(sale.date).getTime()
    if (t < startOfWeek.getTime() || t >= endOfWeek) continue

    stats.total += sale.total
    if (!sale.isPaid) {
      stats.notPaid += sale.total
      continue
    }

    if (sale.payment.type == 'cash') {
      stats.cash += sale.total
    } else if (sale.payment.type == 'debt') {
      stats.debt += sale.total
    } else if (sale.payment.type == 'mix') {
      stats.cash += sale.payment.details.cash || 0
      stats.debt += sale.payment.details.debt || 0
    }
  }

  return stats
})

const weeklyTotal = computed(() => weeklyStats.value.total)
const weeklyNotPaid = computed(() => weeklyStats.value.notPaid)
const paymentSplit = computed(() => ({ cash: weeklyStats.value.cash, debt: weeklyStats.value.debt }))

// Lifecycle hooks
onMounted(async () => {
  await saleStore.loadSales()
})

</script>
