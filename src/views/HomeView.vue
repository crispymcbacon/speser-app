<script setup>
import { useUserStore } from '../lib/stores.js'
const userStore = useUserStore()
</script>

<template>
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-2xl font-bold mt-2">Welcome back, {{ userStore.first_name }}!</h1>
      <p class="py-4">You can manage family expenses, share costs with others, track financial balances and more.<br> Open the sidebar to access all the functionalities</p>
      <button class="btn mt-4" @click="$emit('openSidebar')">Open for me</button>
    </div>
  </div>
</template>
