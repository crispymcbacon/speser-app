<template>
    <div class="hero-content text-center justify-center snap-center mt-32">
      <div class="max-w-md">
        <h1 class="text-4xl font-bold mt-2">404 Not Found</h1>
        <p class="py-4">The page you are looking for does not exist.</p>
        <button class="btn mt-4 min-w-32"><RouterLink active-class="active" to="/">Home</RouterLink></button>
      </div>
    </div>
  </template>

<script setup>
import { RouterLink} from 'vue-router'
</script>
