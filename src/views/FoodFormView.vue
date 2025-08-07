<template>
  <div class="p-6 max-w-xl mx-auto">
    <div class="flex gap-4 items-center mb-4">
      <Button type="submit" size="icon" variant="outline" @click="router.back()">
        <ChevronLeft />
      </Button>
      <h1 class="text-2xl font-bold">{{ isEditing ? 'Editar' : 'Crear' }} producto</h1>
    </div>

    <form @submit.prevent="saveProduct" class="space-y-3 mb-6">
      <div class="flex flex-col gap-2">
        <Label for="name">Nombre<span class="text-red-400">*</span></Label>
        <Input id="name" v-model="form.name" />
        <span v-if="emptyName" class="text-sm text-red-400">El nombre es obligatorio</span>
      </div>
      <div class="flex flex-col gap-2">
        <Label for="price">Precio</Label>
        <Input id="price" v-model="form.price" type="number" />
        <span v-if="emptyPrice" class="text-sm text-red-400">El precio es obligatorio</span>
      </div>
      <Button type="submit">{{ isEditing ? 'Editar' : 'Crear' }} Producto</Button>
    </form>
  </div>
</template>

<script setup>
import { useProductsStore } from '@/stores/products'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'

const store = useProductsStore()
const router = useRouter()
const route = useRoute()

const form = ref({ name: '', price: '' })

const isEditing = computed(() => route.name === 'Editar producto')
const editingId = computed(() => route.params.id)
const emptyName = ref(false)
const emptyPrice = ref(false)

// Methods
const saveProduct = () => {
  if (form.value.name.trim() === '') {
    emptyName.value = true
    return
  }

  if (form.value.price === '' || form.value.price < 0) {
    emptyPrice.value = true
    return
  }

  if (isEditing.value) {
    store.updateProduct({ id: editingId.value, ...form.value })
  } else {
    store.addProduct({ ...form.value })
  }

  form.value.name = ''
  form.value.price = ''
  emptyName.value = false
  emptyPrice.value = false

  router.push('/foods')
}

onMounted(async () => {
  if (editingId.value) {
    const productFromDb = await store.getProductById(Number(editingId.value))
    if (productFromDb) {
      Object.assign(form.value, productFromDb)
    }
  }
})

</script>
