<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getExpense } from '../lib/api'

const route = useRoute()
const router = useRouter()
const year = route.params.year
const month = route.params.month
const id = route.params.id

const loading = ref(true)
const expense = ref(null)

const goBack = () => {
  router.back()
}

onMounted(async () => {
  try {
    expense.value = await getExpense(year, month, id)
    expense.value = expense.value[0]
    console.log(expense.value)
    loading.value = false

    // get only day month and year from date
    const date = new Date(expense.value.date)
    expense.value.date = date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch (error) {
    console.error(error)
    loading.value = false
  }
})
</script>

<template>
  <div class="p-4 rounded-xl shadow-md mx-2">
    <button @click="goBack" class="">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-arrow-left"
      >
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
    </button>
    <div v-if="loading" class="text-center">
      <div class="spinner"></div>
      Loading...
    </div>
    <div v-else>
      <div class="text-right text-gray-500">Date: {{ expense.date }}</div>
      <div class="font-semibold py-1">Description:</div>
      <div class="">{{ expense.description }}</div>
      <div class="py-2 font-semibold">
        Category: <span class="badge badge-neutral">{{ expense.category_name }}</span>
      </div>
      <div class="flex justify-between items-center">
        <div class="font-semibold flex-1">Total Cost:</div>
        <div class="text-3xl font-bold">€{{ expense.total_cost }}</div>
      </div>
    </div>
  </div>
</template>
