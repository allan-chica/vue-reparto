<template>
  <div class="space-y-2">

    <h3 class="text-lg font-semibold">Datos semanales:</h3>

    <!-- Stats -->
    <!-- <div class="grid grid-cols-2 gap-2">
      <div class="flex items-center gap-2 rounded-lg p-2.5 border">
        <div
          class="rounded-full p-2 flex items-center justify-center bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
          <ChartNoAxesCombined size="16" />
        </div>
        <div>
          <div class="text-muted-foreground text-sm">Total</div>
          <div class="text-lg font-bold">${{ formatPrice(weeklyTotal) }}</div>
        </div>
      </div>
      <div class="flex items-center gap-2 rounded-lg p-2.5 border">
        <div
          class="rounded-full p-2 flex items-center justify-center bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300">
          <CircleOff size="16" />
        </div>
        <div>
          <div class="text-muted-foreground text-sm">Sin pagar</div>
          <div class="text-lg font-bold">${{ formatPrice(weeklyNotPaid) }}</div>
        </div>
      </div>
      <div class="flex items-center gap-2 rounded-lg p-2.5 border">
        <div
          class="rounded-full p-2 flex items-center justify-center bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300">
          <Banknote size="16" />
        </div>
        <div>
          <div class="text-muted-foreground text-sm">Efectivo</div>
          <div class="text-lg font-bold">${{ formatPrice(paymentSplit.cash) }}</div>
        </div>
      </div>
      <div class="flex items-center gap-2 rounded-lg p-2.5 border">
        <div
          class="rounded-full p-2 flex items-center justify-center bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
          <Wallet size="16" />
        </div>
        <div>
          <div class="text-muted-foreground text-sm">Transferencia</div>
          <div class="text-lg font-bold">${{ formatPrice(paymentSplit.debt) }}</div>
        </div>
      </div>
    </div> -->

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

// State
const saleStore = useSalesStore()

const weeklySales = computed(() => saleStore.sales.filter(sale => sale.date && isThisWeek(sale.date)))

const weeklyTotal = computed(() => {
  return weeklySales.value.reduce((sum, sale) => {
    if (!sale.isPaid) return sum
    return sum + sale.total
  }, 0)
})

const weeklyNotPaid = computed(() => {
  return weeklySales.value.reduce((sum, sale) => {
    if (sale.isPaid) return sum
    return sum + sale.total
  }, 0)
})

// const earnings = computed(() => weeklyTotal.value * 0.1)

const paymentSplit = computed(() => {
  let cash = 0
  let debt = 0

  weeklySales.value.forEach(sale => {
    if (!sale.isPaid) return

    if (sale.payment.type == 'cash') {
      cash += sale.total
    } else if ((sale.payment.type == 'debt')) {
      debt += sale.total
    } else if ((sale.payment.type == 'mix')) {
      cash += sale.payment.details.cash || 0
      debt += sale.payment.details.debt || 0
    }
  })

  return { cash, debt }
})

// Methods
const isThisWeek = date => {
  const d = new Date(date)
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay()) // Sunday as start
  startOfWeek.setHours(0, 0, 0, 0)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 7)

  return d >= startOfWeek && d < endOfWeek
}

const formatPrice = price => {
  return new Intl.NumberFormat('es-AR').format(price)
}

// Lifecycle hooks
onMounted(async () => {
  await saleStore.loadSales()
})

</script>
