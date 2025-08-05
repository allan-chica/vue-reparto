<template>
  <div class="p-6 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Clientes</h1>

    <form @submit.prevent="saveClient" class="space-y-2 mb-6">
      <Input v-model="form.name" placeholder="Nombre..." />
      <Input v-model="form.phone" placeholder="Telefono..." />
      <Button type="submit">{{ isEditing ? 'Editar' : 'Agregar' }} Cliente</Button>
    </form>

    <ul class="space-y-2">
      <li v-for="client in clients" :key="client.id" class="flex justify-between items-center border p-3 rounded">
        <div>
          <p class="font-semibold">{{ client.name }}</p>
          <p class="text-sm text-stone-500">{{ client.phone }}</p>
        </div>
        <div class="space-x-2">
          <Button variant="outline" @click="editClient(client)">Editar</Button>
          <Button variant="destructive" @click="deleteClient(client.id)">Eliminar</Button>
        </div>
      </li>
    </ul>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useClientsStore } from '@/stores/clients'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const store = useClientsStore()
const form = ref({ name: '', phone: '' })
const isEditing = ref(false)
const editingId = ref(null)

const clients = computed(() => store.clients)

// Methods
const saveClient = () => {
  if (!form.value.name) return

  if (isEditing.value) {
    store.updateClient({ id: editingId.value, ...form.value })
    isEditing.value = false
    editingId.value = null
  } else {
    store.addClient({ ...form.value })
  }

  form.value.name = ''
  form.value.phone = ''
}

const editClient = client => {
  form.value = { name: client.name, phone: client.phone }
  isEditing.value = true
  editingId.value = client.id
}

const deleteClient = id => {
  store.deleteClient(id)
}

// Mounted
onMounted(() => {
  store.loadClients()
})
</script>
