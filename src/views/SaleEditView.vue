<template>
  <div class="p-6 max-w-xl mx-auto flex flex-col h-full">

    <!-- Actions -->
    <div class="flex justify-between items-center">
      <div class="flex gap-4 items-center mb-4">
        <Button type="submit" size="icon" variant="outline" @click="router.push(`/sale/${saleId}`)">
          <ChevronLeft />
        </Button>
        <h1 class="text-2xl font-semibold truncate">Editar venta</h1>
      </div>
    </div>

    <!-- Client -->
    <div @click="handleClientDialog"
      class="flex justify-between items-center gap-2 mb-4 cursor-pointer w-full border rounded-lg p-4 font-semibold"
      :class="{ 'text-red-400 border-dashed': !sale.client }">
      <span>{{ sale.client ? sale.client.name : 'Seleccionar cliente' }}</span>
      <ChevronRight />
    </div>

    <!-- List of products -->
    <div class="flex-1 min-h-0 flex flex-col">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold">Productos:</h3>
        <Button variant="outline" @click="handleProductDialog">
          <Plus /> Producto
        </Button>
      </div>

      <div class="flex-1 min-h-0 overflow-y-auto space-y-3">
        <ScrollArea class="h-full">
          <div v-for="product in sortedSelectedProducts" :key="product.id"
            class="p-3 flex justify-between items-center border-b rounded-md">
            <!-- Product info -->
            <div class="flex flex-col">
              <p class="font-semibold text-lg">{{ product.name }}</p>
              <p class="text-muted-foreground">1x ${{ formatPrice(product.price) }}</p>
              <p class="text-green-600 dark:text-green-500 font-semibold">
                ${{ formatPrice(product.price * product.quantity) }}
              </p>
            </div>

            <!-- Quantity controls -->
            <div class="flex items-center space-x-2">
              <Button size="icon" variant="outline" @click="removeProduct(product)">
                <Trash v-if="product.quantity == 1" />
                <Minus v-else />
              </Button>

              <span class="font-semibold border-b p-2 border-green-600 dark:border-green-500">
                {{ product.quantity }}
              </span>

              <Button size="icon" variant="outline" @click="addProduct(product)">
                <Plus />
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>


    <!-- Footer -->
    <div class="border-t pt-4">
      <div v-if="hasDiscount">
        <div class="flex justify-end gap-3 items-center">
          <p>Subtotal</p>
          <p>${{ formatPrice(totalPrice) }}</p>
        </div>
        <div class="flex justify-end gap-3 items-center">
          <p>Descuento ({{ discount }}%)</p>
          <p class="text-red-700 dark:text-red-300">-${{ formatPrice(totalPrice - totalPriceWithDiscount) }}</p>
        </div>
        <div class="flex justify-end gap-3 items-center mb-4 text-lg font-semibold">
          <p>Total</p>
          <p>${{ formatPrice(totalPriceWithDiscount) }}</p>
        </div>
      </div>
      <div v-else class="flex justify-end gap-3 items-center mb-4 text-lg font-semibold">
        <p>Total</p>
        <p>${{ formatPrice(totalPriceWithDiscount) }}</p>
      </div>
      <div class="flex gap-2">
        <Button class="flex-1 mt-2" size="lg" variant="outline"
          @click="router.push(`/sale/${saleId}`)">Cancelar</Button>
        <Button class="flex-1 mt-2" size="lg" @click="saveSale">Guardar cambios</Button>
      </div>
    </div>

    <!-- Dialogs -->
    <Dialog v-model:open="clientDialogOpen">
      <DialogContent class="max-w-2xl max-h-[80vh] flex flex-col">
        <!-- Header -->
        <DialogHeader>
          <DialogTitle>Seleccionar cliente</DialogTitle>
          <DialogDescription>
            Selecciona un cliente para continuar con la venta.
          </DialogDescription>
        </DialogHeader>
        <!-- Search input -->
        <div class="relative items-center">
          <Input v-model="clientSearchQuery" placeholder="Buscar..." class="pl-9" id="search" />
          <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
            <Search class="size-5 text-muted-foreground" />
          </span>
        </div>
        <div class="flex-1 min-h-0">
          <AlphabetScroll :items="filteredClients" label-key="name" id-key="id" :scrollAreaClass="'h-full max-h-96'">
            <template #item="{ item }">
              <div class="p-3 rounded-md cursor-pointer hover:bg-muted" @click="selectClient(item)">
                <p class="font-semibold">{{ item.name }}</p>
              </div>
            </template>
          </AlphabetScroll>
        </div>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="productsDialogOpen">
      <DialogContent class="max-w-2xl max-h-[80vh] flex flex-col">
        <!-- Header -->
        <DialogHeader>
          <DialogTitle>Agregar productos</DialogTitle>
          <DialogDescription class="flex gap-5">
            <p class="flex flex-col items-center text-center">
              <CircleMinus size="20" class="text-stone-400" />Significa que ya está el producto a la venta
            </p>
            <p class="flex flex-col items-center text-center">
              <CircleCheckBig size="20" class="text-green-600 dark:text-green-500" /> Significa que vas a agregar el
              producto al a venta
            </p>
          </DialogDescription>
        </DialogHeader>
        <!-- Search input -->
        <div class="relative items-center">
          <Input v-model="productSearchQuery" placeholder="Buscar..." class="pl-9" id="search" />
          <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
            <Search class="size-5 text-muted-foreground" />
          </span>
        </div>
        <div class="flex-1 min-h-0">
          <AlphabetScroll :items="filteredProducts" label-key="name" id-key="id" :scrollAreaClass="'h-full max-h-96'"
            letterHeaderClass="bg-background backdrop-blur-sm py-2 px-3 border-b">
            <template #item="{ item }">
              <div class="flex justify-between gap-3 p-3 rounded-md cursor-pointer" :class="{
                'border border-transparent': !productSelected(item.id),
                'bg-stone-100 dark:bg-stone-900 border': productSelected(item.id),
                'opacity-50': productOriginal(item.id)
              }" @click="selectProduct(item)">
                <div class="flex items-center gap-2">
                  <Circle v-if="!productSelected(item.id)" size="20" class="text-stone-400" />
                  <CircleMinus v-else-if="productOriginal(item.id)" size="20" class="text-stone-400" />
                  <CircleCheckBig v-else size="20" class="text-green-600 dark:text-green-500" />
                  <p class="font-semibold">{{ item.name }}</p>
                </div>
                <p class="font-semibold text-right text-nowrap text-green-600 dark:text-green-500">${{
                  formatPrice(item.price) }}</p>
              </div>
            </template>
          </AlphabetScroll>
        </div>
        <DialogFooter>
          <Button size="lg" @click="addProductsToSale">
            Agregar productos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useClientsStore } from '@/stores/clients'
import { useProductsStore } from '@/stores/products'
import { useSalesStore } from '@/stores/sales'
import { computed, onMounted, ref } from 'vue'
import { ChevronLeft, ChevronRight, Circle, CircleCheckBig, CircleMinus, Minus, Plus, Search, Trash } from 'lucide-vue-next'
import AlphabetScroll from '@/components/AlphabetScroll.vue'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

// Setup
const router = useRouter()
const route = useRoute()
const clientStore = useClientsStore()
const productStore = useProductsStore()
const saleStore = useSalesStore()

const saleId = computed(() => route.params.id)
const sale = ref({})
const totalPrice = computed(() => {
  return sale.value.products?.reduce((total, product) => {
    return total + (product.price * product.quantity)
  }, 0)
})

const sortedSelectedProducts = computed(() => {
  return sale.value.products
    ? [...sale.value.products].sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    )
    : []
})

// Setup -> Client
const clientDialogOpen = ref(false)
const clients = computed(() => clientStore.clients)
const clientSearchQuery = ref('')
const filteredClients = computed(() => {
  const query = clientSearchQuery.value.toLowerCase().trim()
  const filtered = !query
    ? clients.value
    : clients.value.filter(client =>
      client.name.toLowerCase().includes(query)
    )

  return filtered.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  )
})

// Setup -> Products
const productsDialogOpen = ref(false)
const products = computed(() => productStore.products)
const productSearchQuery = ref('')
const filteredProducts = computed(() => {
  const query = productSearchQuery.value.toLowerCase().trim()
  const filtered = !query
    ? products.value
    : products.value.filter(product =>
      product.name.toLowerCase().includes(query)
    )

  return filtered.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  )
})
const dialogSelectedProducts = ref([])

// Setup -> Discount
const discount = ref(0)
const hasDiscount = computed(() => {
  if (!discount.value) return
  return discount.value > 0
})
const totalPriceWithDiscount = computed(() => totalPrice.value - (totalPrice.value * (discount.value / 100)))

// Methods

// Methods -> Client dialog
const handleClientDialog = async () => {
  if (clients.value.length == 0) {
    await clientStore.loadClients()
  }
  clientDialogOpen.value = true
}

const selectClient = client => {
  sale.value.client = client
  clientDialogOpen.value = false
}

// Methods -> Products dialog
const handleProductDialog = async () => {
  if (products.value.length == 0) {
    await productStore.loadProducts()
  }
  dialogSelectedProducts.value = sale.value.products.map(p => ({ id: p.id, original: true }))
  productsDialogOpen.value = true
}

const selectProduct = product => {
  if (productOriginal(product.id)) return

  if (!productSelected(product.id)) {
    dialogSelectedProducts.value.push({ id: product.id, original: false })
  } else {
    dialogSelectedProducts.value = dialogSelectedProducts.value.filter(p => p.id !== product.id)
  }
}

const productSelected = id => Boolean(dialogSelectedProducts.value.find(p => p.id == id))
const productOriginal = id => {
  const product = dialogSelectedProducts.value.find(p => p.id == id)
  if (!product) return false
  return product.original
}

const addProductsToSale = () => {
  dialogSelectedProducts.value = dialogSelectedProducts.value.filter(p => p.original == false)

  dialogSelectedProducts.value.forEach(p => {
    const product = products.value.find(prod => prod.id == p.id)
    sale.value.products = [...sale.value.products, { ...product, quantity: 1 }]
  })

  dialogSelectedProducts.value = []
  productsDialogOpen.value = false
}

// Methods -> Products
const addProduct = product => {
  const existingProduct = sale.value.products.find(p => p.id === product.id)
  if (existingProduct) {
    existingProduct.quantity++
  } else {
    sale.value.products.push({
      ...product,
      quantity: 1
    })
  }
}

const removeProduct = product => {
  const existingProduct = sale.value.products.find(p => p.id === product.id)
  if (existingProduct) {
    if (existingProduct.quantity > 1) {
      existingProduct.quantity--
    } else {
      sale.value.products = sale.value.products.filter(p => p.id !== product.id)
    }
  }
}

// Methods -> Save
const saveSale = async () => {
  sale.value.total = hasDiscount.value ? totalPriceWithDiscount.value : totalPrice.value
  await saleStore.updateSale(JSON.parse(JSON.stringify(sale.value)))
  router.push(`/sale/${saleId.value}`)
}

// Methods -> Helper
const formatPrice = price => {
  return new Intl.NumberFormat('es-AR').format(price)
}

// Lifecycle hooks
onMounted(async () => {
  const dbSale = await saleStore.getSaleById(Number(saleId.value))

  if (dbSale) {
    Object.assign(sale.value, dbSale)
    discount.value = sale.value.client.discount
  } else {
    router.push('/sales')
  }
})
</script>
