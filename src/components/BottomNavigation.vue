<template>
  <nav class="py-2 flex justify-evenly border border-stone-400 dark:border-stone-700 rounded-md m-2 w-full max-w-xl">
    <router-link to="/clients" class="p-2 rounded-sm transition-colors" :class="{
      'bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900':
        route.name == 'Clientes',
    }">
      <Users :size="32" />
    </router-link>
    <router-link to="/sales" class="p-2 rounded-sm transition-colors" :class="{
      'bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900': route.name == 'Ventas',
    }">
      <!-- Ventas -->
      <ChartNoAxesCombined :size="32" />
    </router-link>
    <router-link to="/foods" class="p-2 rounded-sm transition-colors" :class="{
      'bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900':
        route.name == 'Productos',
    }">
      <Package :size="32" />
    </router-link>
  </nav>
</template>

<script setup>
// Icons
import { ChartNoAxesCombined, Users, Package } from 'lucide-vue-next'

import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
</script>
