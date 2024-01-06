<template>
  <div class="mt-2 md:px-2">
    <!-- Header -->
    <div class="px-4 grid grid-cols-5 items-center md:px-6">
      <button @click="goBack">
        <IconArrowLeft :size="24" stroke-width="2" />
      </button>
      <h1 class="text-2xl font-bold col-span-3 text-center lg:text-3xl">Balance to user</h1>
      <div></div>
    </div>
    <!-- Search -->
    <div class="mt-6 px-4 md:px-6">
      <div class="text-lg font-semibold mb-2">Search by username:</div>
      <div class="flex flex-col">
        <input
          v-model="searchQuery"
          @input="search"
          type="text"
          class="w-full px-4 input input-bordered"
          placeholder="Search..."
          autocapitalize="none"
        />
        <!-- Dropdown list -->
        <div v-if="searchResults.length > 0" class="dropdown dropdown-open w-full">
          <ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full">
            <li v-for="(user, index) in searchResults" :key="index" @click="selectUser(user)">
              <a class="font-semibold">@{{ user.username }}</a>
            </li>
          </ul>
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
    <!-- Not Found -->
    <div v-if="data && data.length === 0">
      <div class="px-4 mt-8 text-center">
        <h1 class="text-md text-gray-500 mb-2">User not found, search again.</h1>
      </div>
    </div>
    <!-- Expenses -->
    <div v-else-if="data && data.expenses">
      <!-- Balance to user -->
      <div class="px-4 mt-4">
        <div>
          Balance respect to: <span class="font-bold">@{{ username }}</span>
        </div>
        <div class="text-3xl font-bold my-2" :class="balanceColor(data.totalBalance)">
          <span>{{ data.totalBalance }}</span>
        </div>
      </div>
      <!-- Table -->
      <div class="overflow-x-auto mt-2">
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
          <!-- body -->
          <tbody class="cursor-pointer">
            <tr v-for="(expense, index) in data.expenses" :key="index" @click="goToDetail(expense)">
              <th>{{ index + 1 }}</th>
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
              <td :class="balanceColor(expense.balance)">{{ expense.balance }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { searchUser, getBalanceToUser } from '@/lib/api.js'
import { useUserStore } from '@/lib/stores.js'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { IconArrowLeft } from '@tabler/icons-vue'

const data = ref(null)
const logged_username = ref('')
const username = ref('')
const searchQuery = ref('')
const toast = useToast()
const searchResults = ref([]) // new ref for search results
const router = useRouter()

onMounted(() => {
  const userStore = useUserStore()
  logged_username.value = userStore.username // get logged-in username
})

// Add balance color
function balanceColor(balance) {
  balance = balance.toString()
  if (balance.includes('Debit') || balance.includes('Paid') || balance.includes('You owe')) {
    return 'text-red-600'
  } else if (
    balance.includes('Credit') ||
    balance.includes('Received') ||
    balance.includes('You are owed')
  ) {
    return 'text-green-600'
  } else {
    return 'text-gray-500'
  }
}

// Add balance label
const balanceLabel = (balance) => {
  if (balance < 0) {
    return 'You owe €' + -balance
  } else if (balance > 0) {
    return 'You are owed €' + balance
  } else {
    return 'Done'
  }
}

// Search user for the dropdown list
const search = async () => {
  const res = await searchUser(searchQuery.value) // search user
  searchResults.value = res.slice(0, 5) // store only the first 5 search results

  // remove the logged-in user from the search results
  const userIndex = searchResults.value.findIndex((user) => user.username === logged_username.value)
  if (userIndex !== -1) {
    searchResults.value.splice(userIndex, 1)
  }
}

const selectUser = async (user) => {
  try {
    username.value = user.username // set username to the clicked username
    searchQuery.value = user.username // set searchQuery to the clicked username
    searchResults.value = [] // clear search results

    if (searchQuery.value === logged_username.value) { // if the selected user is the logged-in user
      toast.error('You cannot search for the logged-in user.', {
        hideProgressBar: true
      })
      return
    }

    const res = await getBalanceToUser(user.id) // get balance to user
    if (res.length === 0) { // check if the user has expenses
      data.value = []
    } else {
      data.value = res
      data.value.totalBalance = balanceLabel(res.totalBalance)
    }
  } catch (error) {
    console.error(error)
    toast.error('An error occurred while selecting the user.', {
      hideProgressBar: true
    })
  }
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
