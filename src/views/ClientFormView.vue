<template>
  <div class="p-6 max-w-xl mx-auto">
    <div class="flex gap-4 items-center mb-4">
      <Button type="submit" size="icon" variant="outline" @click="router.back()">
        <ChevronLeft />
      </Button>
      <h1 class="text-2xl font-bold">{{ isEditing ? 'Editar' : 'Crear' }} cliente</h1>
    </div>

    <form @submit.prevent="saveClient" class="space-y-3 mb-6">
      <div class="flex flex-col gap-2">
        <Label for="name">Nombre<span class="text-red-400">*</span></Label>
        <Input id="name" v-model="form.name" />
        <span v-if="emptyName" class="text-sm text-red-400">El nombre es obligatorio</span>
      </div>
      <div class="flex flex-col gap-2">
        <Label for="phone">Telefono</Label>
        <Input id="phone" v-model="form.phone" type="number" />
      </div>
      <Button type="submit">{{ isEditing ? 'Editar' : 'Crear' }} Cliente</Button>
    </form>
  </div>
</template>

<script setup>
import { useClientsStore } from '@/stores/clients'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'

const store = useClientsStore()
const router = useRouter()
const route = useRoute()

const form = ref({ name: '', phone: '' })

const isEditing = computed(() => route.name === 'Editar cliente')
const editingId = computed(() => route.params.id)
const emptyName = ref(false)

// Methods
const saveClient = () => {
  if (!form.value.name) {
    emptyName.value = true
    return
  }

  if (isEditing.value) {
    store.updateClient({ id: editingId.value, ...form.value })
  } else {
    store.addClient({ ...form.value })
  }

  form.value.name = ''
  form.value.phone = ''
  emptyName.value = false

  router.push('/clients')
}

onMounted(async () => {
  if (editingId.value) {
    const clientFromDb = await store.getClientById(Number(editingId.value))
    if (clientFromDb) {
      Object.assign(form.value, clientFromDb)
    }
  }
})

</script>
