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

      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Seleccionar cliente</DialogTitle>
          <DialogDescription>
            Selecciona un cliente para continuar con la venta.
          </DialogDescription>
        </DialogHeader>

        <div class="relative items-center">
          <Input v-model="clientSearchQuery" placeholder="Buscar..." class="pl-9" id="search" />
          <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
            <Search class="size-5 text-muted-foreground" />
          </span>
        </div>

        <ScrollArea class="h-96">
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
        </ScrollArea>

      </DialogContent>
    </Dialog>

    <div class="relative mb-4 items-center">
      <Input v-model="searchQuery" placeholder="Buscar..." class="pl-9" id="search" />
      <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
        <Search class="size-5 text-muted-foreground" />
      </span>
    </div>

    <!-- Products list -->
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { useClientsStore } from '@/stores/clients'
import { useProductsStore } from '@/stores/products'

const router = useRouter()
const clientStore = useClientsStore()
const productStore = useProductsStore()

// const products = computed(() => productStore.products)

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

const isEditing = ref(false)
const searchQuery = ref('')

// Methods
const selectClient = client => {
  selectedClient.value = client
  clientDialogOpen.value = false
}

onMounted(() => {
  clientStore.loadClients()
  productStore.loadProducts()
})
</script>
