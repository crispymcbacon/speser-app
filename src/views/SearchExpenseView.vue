<script setup>
import { ref } from 'vue'
import { searchExpense } from '../lib/api.js'
import { useRouter } from 'vue-router'

let data = ref(null)
const searchQuery = ref('')
const router = useRouter()

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

const goBack = () => {
  router.back()
}

const goToDetail = (expense) => {
  const year = new Date(expense.date).getFullYear();
  const month = new Date(expense.date).getMonth() + 1;
  const id = expense.id;
  router.push({ name: 'expensedetail', params: { year, month, id } });
};

</script>

<template>
  <div>
    <div class="mt-2">
      <div class="px-4 grid grid-cols-5 items-center">
        <button @click="goBack">
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
        <h1 class="text-2xl font-bold col-span-3 text-center">Search expenses</h1>
        <div></div>
      </div>
      <div class="mt-6 px-4">
        <div class="text-lg font-semibold mb-2">Search by description:</div>
        <div class="flex">
          <input
            v-model="searchQuery"
            type="text"
            class="w-full px-4 input input-bordered"
            placeholder="Search..."
          />
          <button @click="search" class="px-4 btn uppercase">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" id="search"><path d="M46.599 40.236L36.054 29.691C37.89 26.718 39 23.25 39 19.5 39 8.73 30.27 0 19.5 0S0 8.73 0 19.5 8.73 39 19.5 39c3.75 0 7.218-1.11 10.188-2.943l10.548 10.545a4.501 4.501 0 0 0 6.363-6.366zM19.5 33C12.045 33 6 26.955 6 19.5S12.045 6 19.5 6 33 12.045 33 19.5 26.955 33 19.5 33z"></path></svg></button>
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
  </div>
</template>
