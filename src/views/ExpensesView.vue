<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div class="px-4 mt-4">
        <h1 class="text-4xl font-bold mb-2">Expenses</h1>
        <div>
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
  router.push({ name: 'ExpenseDetail', params: { year, month, id } });
};
</script>
