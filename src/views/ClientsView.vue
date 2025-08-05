<template>
  <div class="p-6 max-w-xl mx-auto">

    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Clientes</h1>
      <Button type="submit" @click="router.push('/clients/new')">Nuevo Cliente</Button>
    </div>

    <div class="relative mb-4 items-center">
      <Input v-model="searchQuery" placeholder="Buscar..." class="pl-9" />
      <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
        <Search class="size-5 text-muted-foreground" />
      </span>
    </div>

    <ul class="space-y-2">
      <li v-for="client in filteredClients" :key="client.id"
        class="flex justify-between items-center border p-3 rounded-md">
        <div>
          <p class="font-semibold">{{ client.name }}</p>
          <p class="text-sm text-stone-500">{{ client.phone }}</p>
        </div>
        <div class="space-x-2">
          <Button size="icon" variant="outline" @click="router.push(`/clients/edit/${client.id}`)">
            <Pencil />
          </Button>
          <Button size="icon" variant="destructive" @click="deleteClient(client.id)">
            <Trash2 />
          </Button>
        </div>
      </li>
    </ul>

  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useClientsStore } from '@/stores/clients'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Search } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const store = useClientsStore()
const router = useRouter()
const searchQuery = ref('')

const clients = computed(() => store.clients)

const filteredClients = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  const filtered = !query
    ? clients.value
    : clients.value.filter(client =>
      client.name.toLowerCase().includes(query)
    )

  return filtered.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  )
})

const deleteClient = id => {
  store.deleteClient(id)
}

// Mounted
onMounted(() => {
  store.loadClients()
})
</script>
