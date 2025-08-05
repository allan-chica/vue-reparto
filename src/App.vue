<template>
  <div class="flex flex-col items-center h-full">
    <div class="flex-1 w-full">
      <router-view></router-view>
    </div>

    <BottomNavigation />
  </div>
</template>

<script setup>
import { useColorMode } from '@vueuse/core'
import { RouterView } from 'vue-router'
import BottomNavigation from '@/components/BottomNavigation.vue'

useColorMode()
</script>
