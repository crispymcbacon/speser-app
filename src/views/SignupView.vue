<template>
  <div class="flex mt-4">
    <!-- Header -->
    <div class="max-w-md w-full mx-auto">
      <div class="px-4">
        <h1 class="text-4xl font-bold mb-6 lg:text-5xl">Signup</h1>
      </div>
      <!-- Form -->
      <form @submit.prevent="register" class="px-4 text-center">
        <!-- First name field with errors -->
        <div class="mb-2">
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text">First Name</span>
            </div>
            <input
              v-model="firstName"
              type="text"
              id="firstName"
              placeholder="Mario"
              class="input input-bordered w-full"
            />
          </label>
          <div v-if="errors.firstName" class="text-red-500 text-sm text-right mt-1">
            {{ errors.firstName }}
          </div>
        </div>
        <!-- Last name field with errors -->
        <div class="mb-2">
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text">Last Name</span>
            </div>
            <input
              v-model="lastName"
              type="text"
              id="lastName"
              placeholder="Rossi"
              class="input input-bordered w-full"
            />
          </label>
          <div v-if="errors.lastName" class="text-red-500 text-sm text-right mt-1">
            {{ errors.lastName }}
          </div>
        </div>
        <!-- Username field with errors -->
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
          <div v-if="errors.username" class="text-red-500 text-sm text-right mt-1">
            {{ errors.username }}
          </div>
        </div>
        <!-- Password field with errors -->
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
          <div
            v-if="errors.password"
            class="text-red-500 text-sm text-right mt-1"
            v-html="errors.password.join('<br />')"
          ></div>
        </div>
        <!-- Submit button -->
        <button type="submit" class="btn w-full">Register</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { signup } from '@/lib/api.js'
import { validateRegistrationInput } from '@/lib/utils.js'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

let firstName = ref('')
let lastName = ref('')
let username = ref('')
let password = ref('')
let errors = ref({})
const router = useRouter()
const toast = useToast()

// Register
const register = async () => {
  const result = await validateRegistrationInput(
    // Validate input
    username.value,
    firstName.value,
    lastName.value,
    password.value
  )

  if (result.status === 'validated') {
    const response = await signup(username.value, firstName.value, lastName.value, password.value) // Signup

    if (response.status === 'success') {
      router.push('/signin') // Redirect to signin
      toast.success('Done! Now you can login', {
        // Show success toast
        hideProgressBar: true
      })
    } else {
      toast.error(`${response.message}`, {
        // Show error toast
        hideProgressBar: true
      })
    }
  } else {
    errors.value = result.errors.reduce((acc, error) => {
      // Set errors
      if (error.field === 'password') {
        // Password field can have multiple errors
        if (!acc[error.field]) {
          acc[error.field] = []
        }
        acc[error.field].push(error.message)
      } else {
        acc[error.field] = error.message
      }
      return acc
    }, {})
  }
}
</script>
