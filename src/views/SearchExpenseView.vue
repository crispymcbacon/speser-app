<script setup>
import { ref } from 'vue'
import { searchExpense } from '../lib/api.js'

let data = ref(null)
const searchQuery = ref('')

// const balanceColor = (balance) => {
//   if (balance.includes('Debit')) {
//     return 'text-red-500'
//   } else if (balance.includes('Credit')) {
//     return 'text-green-500'
//   } else {
//     return 'text-gray-500'
//   }
// }

const search = () => {    
    searchExpense(searchQuery.value).then((res) => {
        console.log(res)
        if (res.length > 0) {
        data.value = res
        } else {
        data.value = []
        }
    })
}
</script>

<template>
  <div>
    <div class="px-4 mt-4">
      <h1 class="text-4xl font-bold mb-6">Search expenses</h1>
      <div class="text-lg font-semibold mb-2">
        Search by description:
      </div>
      <div class="flex">
        <input
          v-model="searchQuery"
          type="text"
          class="w-full px-4 input input-bordered"
          placeholder="Search..."
        />
        <button
          @click="search"
          class="px-4 btn uppercase"
        >
          Search
        </button>
      </div>
    </div>
    <div v-if="data && data.length === 0">
      <div class="px-4 mt-8 text-center">
        <h1 class="text-md text-gray-500 mb-2">Expense not found, search again.</h1>
      </div>
    </div>
    <div v-else-if="data">
      <div class="overflow-x-auto mt-2">
        <table class="table table-zebra">
          <!-- head -->
          <thead>
            <tr>
              <th></th>
              <th>Description</th>
              <th class="hidden sm:table-cell">Date</th>
              <th>Total Cost</th>
              <!-- <th>Balance</th> -->
            </tr>
          </thead>
          <tbody>
            <!-- dynamic rows -->
            <tr v-for="(expense, index) in data" :key="index">
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
