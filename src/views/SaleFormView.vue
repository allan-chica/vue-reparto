<template>
  <div class="px-6 pt-6 max-w-xl mx-auto">

    <div class="flex gap-4 items-center mb-4">
      <Button type="submit" size="icon" variant="outline" @click="router.back()">
        <ChevronLeft />
      </Button>
      <h1 class="text-2xl font-bold">{{ isEditing ? 'Editar' : 'Nueva' }} venta</h1>
    </div>

    <Dialog v-model:open="clientDialogOpen">
      <DialogTrigger as-child>
        <div
          class="flex justify-between items-center gap-2 mb-4 cursor-pointer w-full border rounded-lg p-4 font-semibold"
          :class="{ 'text-red-400 border-dashed': !selectedClient }">
          <span>{{ selectedClient ? selectedClient.name : 'Seleccionar cliente' }}</span>
          <ChevronRight />
        </div>
      </DialogTrigger>

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

        <!-- <ScrollArea class="h-96">
          <div class="space-y-2">
            <div v-if="!clients.length" class="text-center text-muted-foreground">
              No hay clientes registrados.
            </div>
            <ul v-else class="space-y-2">
              <li v-for="client in filteredClients" :key="client.id"
                class="flex justify-between items-center border p-3 rounded-md cursor-pointer hover:bg-muted"
                @click="selectClient(client)">
                <div class="text-lg">
                  <p class="font-semibold">{{ client.name }}</p>
                </div>
                <ChevronRight />
              </li>
            </ul>
          </div>
        </ScrollArea> -->

        <div class="flex-1 min-h-0">
          <AlphabetScroll :items="filteredClients" label-key="name" id-key="id" :scrollAreaClass="'h-full max-h-96'">
            <template #item="{ item }">
              <div class="p-3 rounded-md cursor-pointer hover:bg-muted" @click="selectClient(item)">
                <p class="font-semibold">{{ item.name }}</p>
              </div>
            </template>
            <template #empty>
              <div class="text-center text-muted-foreground py-8">
                <p>No hay clientes registrados.</p>
                <p class="text-sm mt-1">Agrega algunos clientes para empezar.</p>
              </div>
            </template>
          </AlphabetScroll>
        </div>

      </DialogContent>
    </Dialog>

    <div class="relative mb-4 items-center">
      <Input v-model="productSearchQuery" placeholder="Buscar..." class="pl-9" id="search" />
      <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
        <Search class="size-5 text-muted-foreground" />
      </span>
    </div>

    <!-- Products list -->
    <div class="flex-1 min-h-0">
      <AlphabetScroll :items="filteredProducts" label-key="name" id-key="id" :scrollAreaClass="'h-full max-h-96'">

        <template #item="{ item }">
          <div class="p-3 rounded-md flex justify-between items-center">
            <p class="font-semibold">{{ item.name }} - <span class="text-green-600 dark:text-green-500">${{
              formatPrice(item.price)
                }}</span></p>
            <div class="flex items-center space-x-2 mt-2">
              <Button size="icon" variant="outline" disabled>
                -
              </Button>

              <span class="text-sm border-b p-2">{{ 0 }}</span>

              <!-- TODO: Add to a list of products with the amount -->
              <Button size="icon" variant="outline">
                +
              </Button>
            </div>
          </div>
        </template>

        <template #empty>
          <div class="text-center text-muted-foreground py-8">
            <p>No hay productos.</p>
            <p class="text-sm mt-1">Agrega productos para empezar a vender.</p>
          </div>
        </template>
      </AlphabetScroll>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { ChevronLeft, ChevronRight, Search } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AlphabetScroll from '@/components/AlphabetScroll.vue'
import { useClientsStore } from '@/stores/clients'
import { useProductsStore } from '@/stores/products'

const router = useRouter()
const clientStore = useClientsStore()
const productStore = useProductsStore()

const clients = computed(() => clientStore.clients)
const clientSearchQuery = ref('')
const selectedClient = ref(null)
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
const clientDialogOpen = ref(false)

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

const isEditing = ref(false)

// Methods
const selectClient = client => {
  selectedClient.value = client
  clientDialogOpen.value = false
}

const formatPrice = price => {
  return new Intl.NumberFormat('es-AR').format(price)
}

onMounted(() => {
  clientStore.loadClients()
  productStore.loadProducts()
})
</script>
