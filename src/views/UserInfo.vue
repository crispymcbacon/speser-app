<template>
  <div class="px-4 mt-2 md:px-6">
    <!-- Header -->
    <div class="flex flex-row justify-between">
      <h1 class="text-4xl font-bold mb-2 lg:text-5xl">User settings</h1>
    </div>
  </div>
  <!-- Loading -->
  <div v-if="loading" class="mx-auto flex justify-center h-[60vh]">
    <div class="text-lg font-semibold flex flex-row items-center">
      <IconLoader2 class="animate-spin mr-2" :size="28" stroke-width="2" />
      Loading...
    </div>
  </div>
  <!-- User info -->
  <div v-else class="px-4 mt-4 md:px-6">
    <div class="label md:justify-center md:mb-4">
      <span class="label-text font-semibold">Logged user</span>
    </div>
    <div class="flex flex-row items-center mt-2 md:justify-center">
      <div class="avatar placeholder">
        <div class="bg-neutral text-neutral-content rounded-full w-24">
          <span class="text-3xl">{{ user.first_name.charAt(0) + user.last_name.charAt(0) }}</span>
        </div>
      </div>
      <div class="flex flex-col ml-4">
        <div class="flex flex-row">
          <div class="font-bold">{{ user.first_name }}</div>
          <div class="font-bold ml-1">{{ user.last_name }}</div>
        </div>
        <div class="text-gray-500">@{{ user.username }}</div>
      </div>
    </div>
    <!-- Sign out -->
    <div class="px-4 text-center mt-2 md:mt-8">
      <button class="btn mt-4" @click="logout"><IconRun />Sign Out</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserInfo } from '@/lib/api.js'
import { IconRun, IconLoader2 } from '@tabler/icons-vue'

const loading = ref(true)
const user = ref(null)
const router = useRouter()

// eslint-disable-next-line no-unused-vars
const emit = defineEmits(['login', 'logout'])

onMounted(async () => {
  user.value = await getUserInfo() // Get user info
  loading.value = false // Hide loading
})

// Logout
const logout = () => {
  emit('logout')
  router.push({ name: 'signin' })
}
</script>
