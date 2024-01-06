<template>
  <div class="px-4 mt-2 md:px-6">
    <!-- Header -->
    <div class="flex flex-row justify-between">
      <h1 class="text-4xl font-bold mb-2 lg:text-5xl">Your Expenses</h1>
      <button class="px-2">
        <RouterLink active-class="active" to="/searchexpense">
          <IconSearch :size="28" stroke-width="3" />
        </RouterLink>
      </button>
    </div>
    <!-- Filters -->
    <div class="mt-4">
      <div class="flex flex-row space-x-4">
        <!-- Filer Year-->
        <div class="form-control grow">
          <label for="yearToggle" class="label cursor-pointer">
            <span class="label-text">Filter by Year</span>
            <input id="yearToggle" v-model="yearToggle" type="checkbox" class="toggle" />
          </label>
          <select id="year" v-model="selectedYear" :disabled="!yearToggle">
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
        <!-- Filer Month-->
        <div class="form-control grow">
          <label for="monthToggle" class="label cursor-pointer">
            <span class="label-text">Filter by Month</span>
            <input id="monthToggle" v-model="monthToggle" type="checkbox" class="toggle" />
          </label>
          <select id="month" v-model="selectedMonth" :disabled="!monthToggle">
            <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>
  <!-- Loading -->
  <div v-if="loading" class="mx-auto flex justify-center h-[60vh]">
    <div class="text-lg font-semibold flex flex-row items-center">
      <IconLoader2 class="animate-spin mr-2" :size="28" stroke-width="2" />
      Loading...
    </div>
  </div>
  <!-- Expenses -->
  <div v-else>
    <div class="overflow-x-auto mt-4">
      <table class="table table-zebra">
        <!-- head -->
        <thead>
          <tr>
            <th></th>
            <th class="hidden sm:table-cell">Category</th>
            <th>Description</th>
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
              :class="{ 'text-gray-500': parseInt(expense.total_cost) === 0 }"
              class="font-semibold"
            >
              €{{ expense.total_cost }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getExpenses } from '@/lib/api.js'
import { useRouter } from 'vue-router'
import { IconSearch, IconLoader2 } from '@tabler/icons-vue'

const loading = ref(true)
const data = ref(null)
const selectedYear = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth() + 1) // Months are 0-indexed
const yearToggle = ref(false)
const monthToggle = ref(false)
const years = ref(Array.from({ length: 5 }, (_, i) => selectedYear.value - i)) // Calculate last 5 years
const months = ref(Array.from({ length: 12 }, (_, i) => i + 1)) // Calculate 12 months
const router = useRouter()

// eslint-disable-next-line no-unused-vars
const emits = defineEmits(['login', 'logout'])

// Fetch expenses
const fetchExpenses = async () => {
  loading.value = true
  data.value = await getExpenses( // Get expenses
    yearToggle.value ? selectedYear.value : undefined, // If yearToggle not toggled, pass undefined
    monthToggle.value ? selectedMonth.value : undefined // If monthToggle not toggled, pass undefined
  )
  loading.value = false
}

onMounted(async () => {
  await fetchExpenses()
})

// If yearToggle or monthToggle changes, fetch expenses
watch([selectedYear, selectedMonth, yearToggle, monthToggle], fetchExpenses)

// Go to expense detail
const goToDetail = (expense) => {
  const year = new Date(expense.date).getFullYear()
  const month = new Date(expense.date).getMonth() + 1
  const id = expense.id
  router.push({ name: 'expensedetail', params: { year, month, id } })
}
</script>
