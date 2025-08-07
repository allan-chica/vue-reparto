<template>
  <div class="p-6 max-w-xl mx-auto">

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

    <ul class="space-y-2">
      <li v-for="product in filteredProducts" :key="product.id"
        class="flex justify-between items-center border p-3 rounded-md">
        <div class="text-lg font-semibold">
          <span>{{ product.name }}</span>
          <span v-if="product.price" class="text-green-600 dark:text-green-500"> - ${{ formatPrice(product.price)
            }}</span>
        </div>
        <div class="space-x-2">
          <Button size="icon" variant="outline" @click="router.push(`/foods/edit/${product.id}`)">
            <Pencil />
          </Button>

          <Button size="icon" variant="destructive" @click="dialogDelete(product)">
            <Trash2 />
          </Button>
        </div>
      </li>
    </ul>

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
