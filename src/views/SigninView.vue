<template>
  <div class="flex mt-4">
    <!-- Header -->
    <div class="max-w-md w-full mx-auto">
      <div class="px-4">
        <h1 class="text-4xl font-bold mb-6 lg:text-5xl">Signin</h1>
      </div>
    <!-- Form -->
      <form @submit.prevent="login" class="px-4 text-center">
        <div class="mb-2">
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text">Username</span>
            </div>
            <input
              v-model="username"
              type="text"
              id="username"
              placeholder="myuser"
              class="input input-bordered w-full"
              autocapitalize="none"
            />
          </label>
        </div>
        <div class="mb-6">
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text">Password</span>
            </div>
            <input
              v-model="password"
              type="password"
              id="password"
              placeholder="****"
              class="input input-bordered w-full"
            />
          </label>
        </div>
        <button type="submit" class="btn w-full">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { signin } from '@/lib/api.js'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const emit = defineEmits(['login'])

const username = ref('')
const password = ref('')
const router = useRouter()
const toast = useToast()

// Login
const login = async () => {
  try {
    const response = await signin(username.value, password.value) // Signin

    if (response.status === 'success') {
      emit('login') // Emit event after successful login
      router.push({ name: 'home' }) // Redirect to home
    } else {
      toast.error('Wrong username or password', { // Show error toast
        hideProgressBar: true
      })
    }
  } catch (error) {
    console.error(error)
  }
}
</script>
