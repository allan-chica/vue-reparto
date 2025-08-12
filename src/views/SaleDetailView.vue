<template>
  <div class="p-6 max-w-xl mx-auto flex flex-col h-full">

    <!-- Actions -->
    <div class="flex justify-between items-center">
      <div class="flex gap-4 items-center mb-4">
        <Button type="submit" size="icon" variant="outline" @click="router.back()">
          <ChevronLeft />
        </Button>
        <h1 class="text-2xl font-semibold truncate">Detalles</h1>
      </div>

      <div class="flex gap-2">
        <Button size="icon" variant="outline" @click="isReceiptOpen = true">
          <Printer />
        </Button>
        <Button size="icon" variant="outline">
          <Pencil />
        </Button>
        <Button size="icon" variant="destructive" @click="viewDeleteDialog = true">
          <Trash2 />
        </Button>
      </div>
    </div>

    <!-- Header -->
    <div>
      <!-- Info -->
      <div class="flex gap-3 items-center justify-between mb-3">
        <!-- Status and name -->
        <div class="flex gap-3 items-center">
          <p class="text-xl font-semibold">{{ sale.client?.name || 'Cliente desconocido' }}</p>
        </div>

        <!-- Date and time -->
        <p class="text-muted-foreground">{{ date }}</p>
      </div>

      <!-- Payment management -->
      <div @click="viewPaymentDialog = true"
        class="flex justify-between items-center gap-2 mb-4 cursor-pointer w-full border rounded-lg p-4 font-semibold"
        :class="{ 'text-red-400 border-dashed': !sale.isPaid }">
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <StatusIcon class="w-fit" :sale="sale" />
            <span>{{ paymentText }}</span>
          </div>
          <div v-if="sale.payment?.type == 'mix'" class="mt-2">
            <p class="text-sm font-normal text-muted-foreground">${{ formatPrice(sale.payment.details.cash) }} en
              efectivo</p>
            <p class="text-sm font-normal text-muted-foreground">${{ formatPrice(sale.payment.details.debt) }} por
              transferencia</p>
          </div>
        </div>
        <ChevronRight />
      </div>
    </div>

    <!-- List -->
    <div class="flex-1 min-h-0 flex flex-col">
      <h3 class="text-lg font-semibold">Productos:</h3>
      <div class="flex-1 min-h-0">
        <ScrollArea class="h-full">
          <div v-for="product in sale.products" :key="product.id"
            class="p-3 flex justify-between items-center border-b rounded-md">
            <div class="flex flex-col">
              <p class="font-semibold text-lg">{{ product.name }}</p>
            </div>
            <div>
              <p class="text-muted-foreground">1x ${{ formatPrice(product.price) }}</p>
              <p class="text-green-600 dark:text-green-500 font-semibold text-lg">
                ${{ formatPrice(product.price * product.quantity) }}
              </p>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>

    <!-- Footer -->
    <div class="border-t pt-4 flex items-center justify-between">
      <Button size="lg" variant="outline" @click="isReceiptOpen = true">
        <Printer /> Ver recibo
      </Button>
      <div class="flex justify-between items-center text-lg font-semibold gap-1.5">
        <p>Total:</p>
        <p>${{ formatPrice(sale.total) }}</p>
      </div>
    </div>

    <AlertDialog v-model:open="viewPaymentDialog">
      <AlertDialogContent class="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle class="text-lg font-semibold">Venta completada</AlertDialogTitle>
          <AlertDialogDescription>La venta se gaurdó correctamente.</AlertDialogDescription>
        </AlertDialogHeader>

        <div>
          <!-- Paid switch -->
          <div class="flex items-center gap-3">
            <Switch v-model="isPaid" />
            <span>Pagado</span>
          </div>

          <!-- Tabs for payment type -->
          <div v-if="isPaid" class="w-full mt-6">
            <Tabs v-model="paymentType" class="w-full">
              <TabsList class="w-full">
                <TabsTrigger value="cash">
                  <Banknote /> Efectivo
                </TabsTrigger>
                <TabsTrigger value="debt">
                  <Wallet /> Transferencia
                </TabsTrigger>
                <TabsTrigger value="mix">
                  <Split /> Mixto
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cash" class="flex justify-center items-center gap-3 mt-4">
                <StatusIcon :sale="{ isPaid: true, payment: { type: 'cash' } }" />
                <p>El pago fue realizado completamente en
                  efectivo.
                </p>
              </TabsContent>

              <TabsContent value="debt" class="flex justify-center items-center gap-3 mt-4">
                <StatusIcon :sale="{ isPaid: true, payment: { type: 'debt' } }" />
                <p>El pago fue realizado completamente por
                  transferencia.</p>
              </TabsContent>

              <TabsContent value="mix" class="flex gap-3 w-full">
                <div class="flex-1 flex gap-3 mt-4">
                  <div class="flex-1 flex flex-col gap-2">
                    <Label class="text-sm font-medium" for="mixedCash">Efectivo</Label>
                    <Input id="mixedCash" type="number" v-model="mixedCash" placeholder="Monto"
                      class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <div class="flex-1 flex flex-col gap-2">
                    <Label class="text-sm font-medium" for="mixedDebt">Transferencia</Label>
                    <Input id="mixedDebt" type="number" v-model="mixedDebt" placeholder="Monto"
                      class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div class="flex mt-4 gap-3">
          <Button class="flex-1" size="lg" variant="outline" @click="viewPaymentDialog = false">Cancelar</Button>
          <Button class="flex-1" size="lg" @click="savePayment">Guardar</Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>

    <AlertDialog v-model:open="viewDeleteDialog">

      <AlertDialogContent>

        <!-- Dialog header -->
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar venta</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estas seguro que querés eliminar ésta venta? Esto no se podrá recuperar.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <!-- Dialog footer -->
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction @click="deletePayment">
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>

      </AlertDialogContent>

    </AlertDialog>

    <ReceiptDialog :sale="sale" :is-open="isReceiptOpen" @update:isOpen="isReceiptOpen = false" />
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ChevronLeft, Pencil, Trash2, Printer, ChevronRight } from 'lucide-vue-next'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSalesStore } from '@/stores/sales'
import StatusIcon from '@/components/StatusIcon.vue'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TabsContent from '@/components/ui/tabs/TabsContent.vue'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Wallet, Banknote, Split } from 'lucide-vue-next'
import ReceiptDialog from '@/components/ReceiptDialog.vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import AlertDialogFooter from '@/components/ui/alert-dialog/AlertDialogFooter.vue'
import AlertDialogCancel from '@/components/ui/alert-dialog/AlertDialogCancel.vue'
import AlertDialogAction from '@/components/ui/alert-dialog/AlertDialogAction.vue'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const router = useRouter()
const route = useRoute()
const saleStore = useSalesStore()

const saleId = computed(() => route.params.id)
const sale = ref({})
const isReceiptOpen = ref(false)

const viewPaymentDialog = ref(false)
const viewDeleteDialog = ref(false)

// Local state for tabs
const isPaid = ref(false)
const paymentType = ref('cash') // 'cash' | 'debt' | 'mix'
const mixedCash = ref('')
const mixedDebt = ref('')

const date = computed(() => {
  return new Date(sale.value.date).toLocaleString('es-ES', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const paymentText = computed(() => {
  if (sale.value.isPaid) {
    if (sale.value.payment.type == 'debt') {
      return 'Pagado con transferencia'
    } else if (sale.value.payment.type == 'cash') {
      return 'Pagado con efectivo'
    } else {
      return 'Pagado con efectivo y transferencia'
    }
  } else {
    return 'Sin pagar'
  }
})

// Sync inputs in mixed mode
watch(mixedCash, newVal => {
  if (paymentType.value == 'mix') {
    const total = sale.value.total || 0
    mixedDebt.value = Math.max(total - Number(newVal || 0), 0)
  }
})

watch(mixedDebt, newVal => {
  if (paymentType.value == 'mix') {
    const total = sale.value.total || 0
    mixedCash.value = Math.max(total - Number(newVal || 0), 0)
  }
})

// Methods
const savePayment = async () => {
  sale.value.isPaid = isPaid.value

  if (!isPaid.value) { // Not paid
    sale.value.payment = { type: null, details: null }
  } else {
    const details = paymentType.value === 'mix'
      ? { cash: Number(mixedCash.value), debt: Number(mixedDebt.value) }
      : null
    sale.value.payment = { type: paymentType.value, details }
  }

  await saleStore.updateSale(JSON.parse(JSON.stringify(sale.value)))

  // Close dialog
  viewPaymentDialog.value = false
}

const deletePayment = async () => {
  await saleStore.deleteSale(sale.value.id)
  router.push('/sales')
}

const formatPrice = price => {
  return new Intl.NumberFormat('es-AR').format(price)
}

onMounted(async () => {
  const dbSale = await saleStore.getSaleById(Number(saleId.value))

  if (dbSale) {
    Object.assign(sale.value, dbSale)

    isPaid.value = sale.value.isPaid
    if (sale.value.payment?.type) paymentType.value = sale.value.payment.type
    if (sale.value.payment?.details) {
      mixedCash.value = sale.value.payment.details.cash || ''
      mixedDebt.value = sale.value.payment.details.debt || ''
    }

  } else {
    router.push('/sales')
  }
})
</script>
