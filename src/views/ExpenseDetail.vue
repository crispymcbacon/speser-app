<template>
  <div class="mt-2 md:px-2">
    <!-- Loading -->
    <div v-if="loading" class="mx-auto flex justify-center h-[60vh]">
      <div class="text-lg font-semibold flex flex-row items-center">
        <IconLoader2 class="animate-spin mr-2" :size="28" stroke-width="2" />
        Loading...
      </div>
    </div>
    <!-- Content-->
    <div v-else>
      <!-- Header -->
      <div class="px-4 grid grid-cols-5 items-center md:px-6">
        <button @click="goBack" class="">
          <IconArrowLeft :size="24" stroke-width="2" />
        </button>
        <div class="text-xl font-bold text-center col-span-3">ID #{{ expense.id }}</div>
        <button @click="editExpense" class="items-end justify-end flex" v-if="isEditable">
          <IconEdit :size="24" stroke-width="2" />
        </button>
        <div v-else></div>
      </div>
      <!-- Expense -->
      <div class="px-4 max-w-lg mx-auto">
        <!-- Date, Description, Category, Owner -->
        <div class="px-2">
          <div class="flex flex-row items-center text-gray-500 py-1 mt-8">
            <IconCalendar :size="20" stroke-width="2" class="mr-2" />
            <div class="">{{ expense.date }}</div>
          </div>
          <div class="flex flex-row items-center py-1">
            <IconReceipt :size="20" stroke-width="2" class="mr-2" />
            <div class="text-lg font-bold">{{ expense.description }}</div>
          </div>
          <div class="flex flex-row items-center py-1">
            <IconCategory :size="20" stroke-width="2" class="mr-2" />
            <div
              :class="{
                'badge badge-neutral': expense.category_id === 1,
                'badge badge-primary text-base-200': expense.category_id !== 1
              }"
            >
              {{ expense.category_name }}
            </div>
          </div>
          <div class="flex flex-row items-center py-1 font-semibold">
            <IconUser :size="20" stroke-width="2" class="mr-2" />
            @{{ expense.owner_username }}
          </div>
        </div>
        <!-- Total Cost -->
        <div class="mt-4">
          <div class="py-1">Total Cost</div>
          <div class="text-3xl font-bold">€{{ expense.total_cost }}</div>
        </div>
        <!-- Users -->
        <div class="mt-1">
          <div class="flex flex-col">
            <div class="divider my-2"></div>
            <div v-for="(user, index) in expense.users" :key="index" class="flex flex-col">
              <div class="flex flex-row items-center">
                <div class="flex flex-col ml-2">
                  <div class="font-semibold">{{ user.first_name }} {{ user.last_name }}</div>
                  <div class="grow text-gray-500 text-sm">@{{ user.username }}</div>
                </div>
                <div class="grow text-lg text-right font-semibold mr-2">€{{ user.share }}</div>
              </div>
              <div class="divider my-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getExpense } from '@/lib/api'
import { useUserStore } from '@/lib/stores'
import {
  IconArrowLeft,
  IconEdit,
  IconCalendar,
  IconReceipt,
  IconCategory,
  IconUser,
  IconLoader2
} from '@tabler/icons-vue'

const route = useRoute() 
const router = useRouter()
const year = route.params.year
const month = route.params.month
const id = route.params.id
const loading = ref(true)
const expense = ref(null)
const isEditable = ref(false)

// Load expense
onMounted(async () => {
  try {
    expense.value = await getExpense(year, month, id) // Get expense
    expense.value = expense.value[0] // Get the first element of the array in case of multiple results

    const date = new Date(expense.value.date) // Convert date to Date object
    expense.value.date = date.toLocaleDateString('en-GB', { // get only day month and year from date
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })

    const userStore = useUserStore()
    if (parseInt(expense.value.user_id) === parseInt(userStore.user_id)) { // check if the expese is of the logged user
      isEditable.value = true // Show edit button
    }

    if (parseInt(expense.value.category_id) === 1) { // If the expense is a refund, adjust the shares of the users
      for (let i = 1; i < expense.value.users.length; i++) {
        expense.value.users[i].share = -parseFloat(expense.value.users[i].share)
      }
    }

    loading.value = false // Hide loading
  } catch (error) {
    console.error(error)
  }
})

// Go back
const goBack = () => {
  router.back()
}

// Edit expense
const editExpense = () => {
  router.push({ name: 'expenseedit', params: { year, month, id } })
}
</script>
