<template>

  <Dialog :open="isOpen" @update:open="$emit('update:isOpen', $event)">
    <DialogContent class="max-w-lg">
      <!-- Header -->
      <DialogHeader>
        <DialogTitle class="text-lg font-semibold">Recibo</DialogTitle>
        <DialogDescription>Acá podes descargar y compartir el recibo</DialogDescription>
      </DialogHeader>

      <!-- HTML Preview -->
      <div ref="receipt-ref" class="p-6 w-[350px] receipt bg-white text-black border">
        <h2 class="text-xl font-bold mb-4">Recibo de Venta</h2>
        <p><strong>Cliente:</strong> {{ sale.client?.name }}</p>
        <p><strong>Fecha:</strong> {{ date }}</p>
        <hr class="my-4" />

        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th class="border px-2 py-1 text-left">Producto</th>
              <th class="border px-2 py-1 text-right">Cant.</th>
              <th class="border px-2 py-1 text-right">Precio</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in sortedProducts" :key="product.id">
              <td class="border px-2 py-1">{{ product.name }}</td>
              <td class="border px-2 py-1 text-right">{{ product.quantity }}</td>
              <td class="border px-2 py-1 text-right">
                ${{ formatPrice(product.price * product.quantity) }}
              </td>
            </tr>
          </tbody>
        </table>

        <hr class="my-4" />
        <p class="text-right font-bold text-lg">Total: ${{ formatPrice(sale.total) }}</p>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <Button variant="outline" :disabled="loadingAction" @click="downloadReceipt">
          <span v-if="loadingAction === 'download'">Generando...</span>
          <span v-else>Descargar</span>
        </Button>

        <Button variant="default" :disabled="loadingAction" @click="shareReceipt">
          <span v-if="loadingAction === 'share'">Generando...</span>
          <span v-else>Compartir</span>
        </Button>
      </div>

    </DialogContent>
  </Dialog>

</template>

<script setup>
import { ref, computed, useTemplateRef } from 'vue'
import html2canvas from 'html2canvas-pro'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

// Props
const props = defineProps({
  isOpen: Boolean,
  sale: {
    type: Object,
    default: () => ({ client: {}, products: [], total: 0 })
  }
})

// State
// const open = ref(props.modelValue)
// watch(() => props.modelValue, val => open.value = val)
// watch(open, val => emit('update:modelValue', val))

const receiptRef = useTemplateRef('receipt-ref')
const loadingAction = ref(null)

const sortedProducts = computed(() => {
  return [...props.sale.products].sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase()
    ))
})

const formatPrice = price => new Intl.NumberFormat('es-AR').format(price)

const date = computed(() => {
  const dateObj = new Date(props.sale.date)
  return dateObj.toLocaleString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const generateReceiptImage = async () => {
  if (!receiptRef.value) return null
  const canvas = await html2canvas(receiptRef.value, { scale: 2 })
  return canvas.toDataURL('image/jpeg', 0.95)
}

const downloadReceipt = async () => {
  loadingAction.value = 'download'
  try {
    const image = await generateReceiptImage()
    if (!image) return

    const link = document.createElement('a')
    link.href = image
    link.download = `recibo-${new Date().toISOString()}.jpg`
    link.click()
  } finally {
    loadingAction.value = null
  }
}

const shareReceipt = async () => {
  loadingAction.value = 'share'
  try {
    const image = await generateReceiptImage()
    if (!image) return
    const response = await fetch(image)
    const blob = await response.blob()
    const file = new File([blob], `recibo-${new Date().toISOString()}.jpg`, { type: 'image/jpeg' })

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: 'Recibo de Venta',
        text: `Recibo de venta para ${props.sale.client?.name || 'Cliente'}`,
        files: [file]
      })
    }

  } catch (err) {
    console.error('Error sharing', err)
  } finally {
    loadingAction.value = null
  }
}
</script>
