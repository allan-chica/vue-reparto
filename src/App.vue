<template>
  <Toaster position="top-center" />

  <router-view></router-view>

</template>

<script setup>
import { useColorMode } from '@vueuse/core'
// import { RouterView } from 'vue-router'

import { Toaster } from './components/ui/sonner'
import 'vue-sonner/style.css'

useColorMode()
</script>
