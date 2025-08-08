<template>
  <div class="flex flex-col items-center h-full">
    <div class="flex-1 w-full min-h-0">
      <router-view></router-view>
    </div>

    <BottomNavigation />
  </div>
</template>

<script setup>
import BottomNavigation from '@/components/BottomNavigation.vue'
</script>
