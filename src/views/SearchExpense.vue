<template>
  <div class="mt-2 md:px-2">
    <!-- Header -->
    <div class="px-4 grid grid-cols-5 items-center md:px-6">
      <button @click="goBack">
        <IconArrowLeft :size="24" stroke-width="2" />
      </button>
      <h1 class="text-2xl font-bold col-span-3 text-center lg:text-3xl">Search expenses</h1>
      <div></div>
    </div>
    <!-- Search -->
    <div class="mt-6 px-4 md:px-6">
      <div class="text-lg font-semibold mb-2">Search by description:</div>
      <div class="flex join">
        <input
          v-model="searchQuery"
          type="text"
          class="w-full px-4 input input-bordered join-item"
          placeholder="Search..."
          autocapitalize="none"
        />
        <button @click="search" class="px-4 btn uppercase join-item">
          <IconSearch :size="24" stroke-width="3" />
        </button>
      </div>
    </div>
    <!-- Loading -->
    <div v-if="loading" class="mx-auto flex justify-center h-[60vh]">
      <div class="text-lg font-semibold flex flex-row items-center">
        <IconLoader2 class="animate-spin mr-2" :size="28" stroke-width="2" />
        Loading...
      </div>
    </div>
    <!-- Not Found -->
    <div v-if="data && data.length === 0">
      <div class="px-4 mt-8 text-center">
        <h1 class="text-md text-gray-500 mb-2">Expense not found, search again.</h1>
      </div>
    </div>
    <!-- Expenses -->
    <div v-else-if="data">
      <div class="overflow-x-auto mt-2">
        <table class="table table-zebra">
          <!-- head -->
          <thead>
            <tr>
              <th></th>
              <th>Description</th>
              <th class="hidden sm:table-cell">Category</th>
              <th class="hidden sm:table-cell">Date</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <!-- body -->
          <tbody class="cursor-pointer">
            <tr v-for="(expense, index) in data" :key="index" @click="goToDetail(expense)">
              <th>{{ index + 1 }}</th>
              <th class="hidden sm:table-cell">
                <div
                  :class="{
                    'badge badge-neutral w-24': expense.category_id === 1,
                    'badge badge-primary w-24 text-base-200': expense.category_id !== 1
                  }"
                >
                  {{ expense.category_name }}
                </div>
              </th>
              <td>{{ expense.description }}</td>
              <td class="hidden sm:table-cell">
                {{ new Date(expense.date).toLocaleDateString() }}
              </td>
              <td
                class="font-semibold"
                :class="{ 'text-gray-500': parseInt(expense.total_cost) === 0 }"
              >
                €{{ expense.total_cost }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { searchExpense } from '@/lib/api.js'
import { useRouter } from 'vue-router'
import { IconArrowLeft, IconSearch, IconLoader2 } from '@tabler/icons-vue'

const loading = ref(false)
const data = ref(null)
const searchQuery = ref('')
const router = useRouter()

// Search expense
const search = async () => {
  loading.value = true
  const res = await searchExpense(searchQuery.value) // Search expense
  res.length > 0 ? (data.value = res) : (data.value = []) // If expense found, show it
  loading.value = false
}

// Go back
const goBack = () => {
  router.back()
}

// Go to expense detail
const goToDetail = (expense) => {
  const year = new Date(expense.date).getFullYear()
  const month = new Date(expense.date).getMonth() + 1
  const id = expense.id
  router.push({ name: 'expensedetail', params: { year, month, id } })
}
</script>
