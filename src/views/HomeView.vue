<template>
  <div class="px-4 mt-2 md:px-6">
    <!-- Header -->
    <div class="flex flex-row justify-between">
      <h1 class="text-4xl font-bold mb-2 lg:text-5xl">Home</h1>
    </div>
  </div>
  <!-- Loading -->
  <div v-if="loading" class="mx-auto flex justify-center h-[60vh]">
      <div class="text-lg font-semibold flex flex-row items-center">
        <IconLoader2 class="animate-spin mr-2" :size="28" stroke-width="2" />
        Loading...
      </div>
    </div>
    <!-- Content -->
  <div v-else class="hero-content text-center">
    <div class="max-w-lg">
      <h1 class="text-2xl font-bold mt-2 lg:text-3xl">Welcome back, {{ userStore.first_name }}!</h1>
      <div>
        <div  class="px-4 mt-4">
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
      </p>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/lib/stores.js'
import { ref, onMounted } from 'vue'
import { getBalance } from '@/lib/api.js'
import { IconLoader2 } from '@tabler/icons-vue'

const userStore = useUserStore() // Get user info from store
const loading = ref(true)
const data = ref(null)

// eslint-disable-next-line no-unused-vars
const emits = defineEmits(['login', 'logout'])

onMounted(async () => {
  data.value = await getBalance() // Get balance data
  loading.value = false
})
</script>