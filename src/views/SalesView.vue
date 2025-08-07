<template>
  <div class="p-6 max-w-xl mx-auto">

    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Ventas</h1>
      <Button type="submit" @click="router.push('/sales/new')">Nueva Venta</Button>
    </div>

  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
