<script setup>
import { useUserStore } from '../lib/stores.js'
import { ref, onMounted } from 'vue'
import { getBalance } from '../lib/api.js'
const userStore = useUserStore()

const loading = ref(true)
const data = ref(null)

onMounted(async () => {
  const balanceData = await getBalance()
  data.value = balanceData
  loading.value = false
})
</script>

<template>
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-2xl font-bold mt-2">Welcome back, {{ userStore.first_name }}!</h1>
      <div>
        <div v-if="loading">Loading...</div>
        <div v-else class="px-4 mt-4">
          <div class="flex flex-row">
            <div class="stat text-center">
              <div class="stat-title">You own</div>
              <div class="stat-value text-red-700">€{{ data.debitBalance }}</div>
            </div>
            <div class="stat text-center">
              <div class="stat-title">You are owed</div>
              <div class="stat-value text-green-700">€{{ data.creditBalance }}</div>
            </div>
          </div>
        </div>
      </div>
      <p class="py-4">
        You can manage family expenses, share costs with others, track financial balances and
        more.<br />
        Open the sidebar to access all the functionalities
      </p>
      <button class="btn mt-4" @click="$emit('openSidebar')">Open for me</button>
    </div>
  </div>
</template>
