<script setup>
import { ref } from 'vue'
import { searchExpense } from '../lib/api.js'
import { useRouter } from 'vue-router'
import { IconArrowLeft, IconSearch } from '@tabler/icons-vue'

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
    <div class="mt-2 md:px-2">
      <div class="px-4 grid grid-cols-5 items-center">
        <button @click="goBack">
          <IconArrowLeft :size="24" stroke-width="2" />
        </button>
        <h1 class="text-2xl font-bold col-span-3 text-center">Search expenses</h1>
        <div></div>
      </div>
      <div class="mt-6 px-4">
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
