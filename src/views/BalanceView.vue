<template>
  <div class="px-4 mt-2 md:px-6">
    <!-- Header -->
    <div class="flex flex-row justify-between">
      <h1 class="text-4xl font-bold mb-2 lg:text-5xl">Balance</h1>
      <button class="px-2">
        <RouterLink active-class="active" to="/balancetouser">
          <IconUserSearch :size="28" stroke-width="2" />
        </RouterLink>
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
  <!-- Content -->
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
            <th class="hidden sm:table-cell">Category</th>
            <th class="hidden sm:table-cell">Owner</th>
            <th>Description</th>
            <th class="hidden sm:table-cell">Date</th>
            <th>Total Cost</th>
            <th>Balance</th>
          </tr>
        </thead>
        <!-- body -->
        <tbody class="cursor-pointer">
          <tr v-for="(expense, index) in data.expenses" :key="index" @click="goToDetail(expense)">
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
            <th :class="{ 'text-gray-400': expense.is_own_expense }" class="hidden sm:table-cell">
              @{{ expense.owner_username }}
            </th>
            <td>{{ expense.description }}</td>
            <td class="hidden sm:table-cell">
              {{ new Date(expense.date).toLocaleDateString() }}
            </td>
            <td class="font-semibold">€{{ expense.total_cost }}</td>
            <td :class="balanceColor(expense.balance)">{{ expense.balance }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBalance } from '@/lib/api.js'
import { useRouter } from 'vue-router'
import { IconUserSearch, IconLoader2 } from '@tabler/icons-vue'

const loading = ref(true)
const data = ref(null)
const router = useRouter()

// eslint-disable-next-line no-unused-vars
const emits = defineEmits(['login', 'logout'])

onMounted(async () => {
  try {
    data.value = await getBalance() // Get balance data
    loading.value = false
  } catch (error) {
    console.error('Failed to fetch balance:', error)
  }
})

// Color the balance text
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

// Go to expense detail
const goToDetail = (expense) => {
  const year = new Date(expense.date).getFullYear()
  const month = new Date(expense.date).getMonth() + 1
  const id = expense.expense_id
  router.push({ name: 'expensedetail', params: { year, month, id } })
}
</script>
