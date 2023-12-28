<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div class="px-4 mt-4">
        <div class="flex flex-row justify-between">
          <h1 class="text-4xl font-bold mb-2">Expenses</h1>
          <button>
            <RouterLink active-class="active" to="/searchexpense" @click="isSidebarOpen = false">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" id="search"><path d="M46.599 40.236L36.054 29.691C37.89 26.718 39 23.25 39 19.5 39 8.73 30.27 0 19.5 0S0 8.73 0 19.5 8.73 39 19.5 39c3.75 0 7.218-1.11 10.188-2.943l10.548 10.545a4.501 4.501 0 0 0 6.363-6.366zM19.5 33C12.045 33 6 26.955 6 19.5S12.045 6 19.5 6 33 12.045 33 19.5 26.955 33 19.5 33z"></path></svg></RouterLink>
            
          </button>
        </div>
        <div class="mt-4">
          <div class="form-control">
            <label for="yearToggle" class="label cursor-pointer">
              <span class="label-text">Filter by Year</span>
              <input id="yearToggle" v-model="yearToggle" type="checkbox" class="toggle" />
            </label>
            <select id="year" v-model="selectedYear" :disabled="!yearToggle">
              <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
          <div class="form-control">
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
      <div class="overflow-x-auto">
        <table class="table table-zebra">
          <!-- head -->
          <thead>
            <tr>
              <th></th>
              <th>Description</th>
              <th class="hidden sm:table-cell">Date</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(expense, index) in data" :key="index" @click="goToDetail(expense)">
            <th>{{ index + 1 }}</th>
            <td>{{ expense.description }}</td>
            <td class="hidden sm:table-cell">
              {{ new Date(expense.date).toLocaleDateString() }}
            </td>
            <td>{{ expense.total_cost }}</td>
            <!-- <td :class="balanceColor(expense.balance)">{{ expense.balance }}</td> -->
          </tr>
          </tbody>
          
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getExpenses } from '../lib/api.js'
import { useRouter } from 'vue-router';

const loading = ref(true)
const data = ref(null)
const selectedYear = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth() + 1) // Months are 0-indexed
const yearToggle = ref(false)
const monthToggle = ref(false)

const years = ref(Array.from({ length: 5 }, (_, i) => selectedYear.value - i)) // Last 5 years
const months = ref(Array.from({ length: 12 }, (_, i) => i + 1)) // 12 months

const router = useRouter();

const fetchExpenses = async () => {
  loading.value = true
  data.value = await getExpenses(
    yearToggle.value ? selectedYear.value : undefined,
    monthToggle.value ? selectedMonth.value : undefined
  )
  loading.value = false
}

onMounted(fetchExpenses)

watch([selectedYear, selectedMonth, yearToggle, monthToggle], fetchExpenses)

const balanceColor = (balance) => {
  if (balance.includes('Debit')) {
    return 'text-red-500'
  } else if (balance.includes('Credit')) {
    return 'text-green-500'
  } else {
    return 'text-gray-500'
  }
}

const goToDetail = (expense) => {
  const year = new Date(expense.date).getFullYear();
  const month = new Date(expense.date).getMonth() + 1;
  const id = expense.id;
  router.push({ name: 'expensedetail', params: { year, month, id } });
};
</script>
