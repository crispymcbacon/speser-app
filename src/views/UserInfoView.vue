<script setup>
import { ref, onMounted } from 'vue'
import { getUserInfo } from '../lib/api.js'
import { useRouter } from 'vue-router'
import { IconRun } from '@tabler/icons-vue'
const loading = ref(true)
const user = ref(null)
const router = useRouter()

// eslint-disable-next-line no-unused-vars
const emit = defineEmits(['login', 'logout'])

onMounted(async () => {
  user.value = await getUserInfo()
  console.log(user.value)
  loading.value = false
})

const logout = () => {
  emit('logout')
  router.push({ name: 'signin' })
}
</script>

<template>
  <div class="px-4 mt-2">
    <!-- Header -->
    <div class="flex flex-row justify-between">
      <h1 class="text-4xl font-bold mb-2">User settings</h1>
    </div>
  </div>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else class="px-4 mt-4">
      <div class="label">
        <span class="label-text font-semibold">Logged user</span>
      </div>
      <div class="flex flex-row items-center mt-2">
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
    </div>
  </div>
  <div class="px-4 text-center mt-2">
    <button class="btn mt-4" @click="logout"><IconRun />Sign Out</button>
  </div>
</template>
