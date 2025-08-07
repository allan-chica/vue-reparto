<template>
  <div class="p-6 max-w-xl mx-auto flex flex-col h-full">

    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Productos</h1>
      <Button type="submit" @click="router.push('/foods/new')">Nuevo Producto</Button>
    </div>

    <div class="relative mb-4 items-center">
      <Input v-model="searchQuery" placeholder="Buscar..." class="pl-9" id="search" />
      <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
        <Search class="size-5 text-muted-foreground" />
      </span>
    </div>

    <div class="flex-1 min-h-0">
      <AlphabetScroll :items="filteredProducts" label-key="name" id-key="id" scrollAreaClass="h-full"
        letter-header-class="bg-background/95 backdrop-blur-sm py-2 px-3">

        <template #item="{ item }">
          <div class="flex justify-between items-center border p-3 rounded-md">
            <p class="font-semibold">{{ item.name }} - <span class="text-green-600 dark:text-green-500">${{
              formatPrice(item.price)
                }}</span></p>
            <div class="space-x-2">
              <Button size="icon" variant="outline" @click="router.push(`/foods/edit/${item.id}`)">
                <Pencil />
              </Button>
              <Button size="icon" variant="destructive" @click="dialogDelete(item)">
                <Trash2 />
              </Button>
            </div>
          </div>
        </template>

        <template #empty>
          <div class="flex flex-col items-center justify-center py-12 text-center">
            <div class="text-muted-foreground">
              No hay productos registrados.
            </div>
          </div>
        </template>

      </AlphabetScroll>
    </div>

  </div>

  <AlertDialog v-model:open="openDialog">

    <AlertDialogTrigger as-child>
    </AlertDialogTrigger>

    <AlertDialogContent>

      <!-- Dialog header -->
      <AlertDialogHeader>
        <AlertDialogTitle>Eliminar producto</AlertDialogTitle>
        <AlertDialogDescription>
          ¿Estas seguro que querés eliminar el producto <b>{{ productToDelete.name }}</b>? Esto no se podrá recuperar.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <!-- Dialog footer -->
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction @click="deleteProduct(productToDelete.id)">
          Eliminar
        </AlertDialogAction>
      </AlertDialogFooter>

    </AlertDialogContent>

  </AlertDialog>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useProductsStore } from '@/stores/products'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Search } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import AlphabetScroll from '@/components/AlphabetScroll.vue'

const store = useProductsStore()
const router = useRouter()
const searchQuery = ref('')

const products = computed(() => store.products)
const openDialog = ref(false)
const productToDelete = ref(null)

const filteredProducts = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  const filtered = !query
    ? products.value
    : products.value.filter(product =>
      product.name.toLowerCase().includes(query)
    )

  return filtered.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  )
})

const dialogDelete = product => {
  productToDelete.value = product
  openDialog.value = true
}

const deleteProduct = id => {
  store.deleteProduct(id)
}

const formatPrice = price => {
  return new Intl.NumberFormat('es-AR').format(price)
}

// Mounted
onMounted(() => {
  store.loadProducts()
})
</script>
