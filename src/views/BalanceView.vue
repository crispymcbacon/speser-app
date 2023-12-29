<template>
  <div class="px-4 mt-2 md:px-6">
    <!-- Header -->
    <div class="flex flex-row justify-between">
      <h1 class="text-4xl font-bold mb-2">Balance</h1>
      <button class="px-2">
        <RouterLink active-class="active" to="/balancetouser">
          <IconUserSearch :size="28" stroke-width="2" />
        </RouterLink>
      </button>
    </div>
  </div>
  <div v-if="loading">Loading...</div>
  <div v-else>
    <!-- Stats -->
    <div>
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
    <!-- Expenses -->
    <div class="overflow-x-auto">
      <table class="table table-zebra">
        <!-- head -->
        <thead>
          <tr>
            <th></th>
            <th>Description</th>
            <th class="hidden sm:table-cell">Date</th>
            <th>Total Cost</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(expense, index) in data.expenses" :key="index" @click="goToDetail(expense)">
            <th>{{ index + 1 }}</th>
            <td>{{ expense.description }}</td>
            <td class="hidden sm:table-cell">
              {{ new Date(expense.date).toLocaleDateString() }}
            </td>
            <td>{{ expense.total_cost }}</td>
            <td :class="balanceColor(expense.balance)">{{ expense.balance }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBalance } from '../lib/api.js'
import { useRouter } from 'vue-router'
import { IconUserSearch } from '@tabler/icons-vue'

const loading = ref(true)
const data = ref(null)
const router = useRouter()

// eslint-disable-next-line no-unused-vars
const emits = defineEmits(['login', 'logout'])

onMounted(async () => {
  const balanceData = await getBalance()
  data.value = balanceData
  loading.value = false
})

function balanceColor(balance) {
  balance = balance.toString()
  if (balance.includes('Debit') || balance.includes('Paid')) {
    return 'text-red-600'
  } else if (balance.includes('Credit') || balance.includes('Received')) {
    return 'text-green-600'
  } else {
    return 'text-gray-500'
  }
}

function balanceText(balance) {
  balance = balance.toString()
  if (balance.includes('Debit') || balance.includes('Credit') || balance.includes('Refund')) {
    return balance
  } else {
    return 'Done'
  }
}

const goToDetail = (expense) => {
  console.log(expense)
  const year = new Date(expense.date).getFullYear()
  const month = new Date(expense.date).getMonth() + 1
  const id = expense.expense_id
  router.push({ name: 'expensedetail', params: { year, month, id } })
}
</script>
