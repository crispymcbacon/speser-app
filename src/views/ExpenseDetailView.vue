<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getExpense } from '../lib/api'
import { useUserStore } from '../lib/stores.js'
import { IconArrowLeft, IconEdit, IconCalendar, IconReceipt, IconCategory } from '@tabler/icons-vue'

const route = useRoute()
const router = useRouter()
const year = route.params.year
const month = route.params.month
const id = route.params.id

const loading = ref(true)
const expense = ref(null)

const user_id = ref('')
const isEditable = ref(false)

const goBack = () => {
  router.back()
}

onMounted(async () => {
  try {
    expense.value = await getExpense(year, month, id)
    expense.value = expense.value[0]
    console.log(expense.value)
    loading.value = false

    // get only day month and year from date
    const date = new Date(expense.value.date)
    expense.value.date = date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })

    // check if the expese is of the logged user
    const userStore = useUserStore()
    user_id.value = userStore.user_id
    if (parseInt(expense.value.user_id) === parseInt(user_id.value)) {
      isEditable.value = true
    }

    // If the expense is a refund, adjust the shares of the users
    if (parseInt(expense.value.category_id) === 1) {
      for (let i = 1; i < expense.value.users.length; i++) {
        expense.value.users[i].share = -parseFloat(expense.value.users[i].share)
      }
    }
  } catch (error) {
    console.error(error)
    loading.value = false
  }
})

const editExpense = () => {
  router.push({ name: 'expenseedit', params: { year, month, id } })
}
</script>

<template>
  <div class="px-4 mx-2">
    <div v-if="loading" class="text-center">
      <div class="spinner"></div>
      Loading...
    </div>
    <div v-else>
      <div class="flex justify-between items-center mt-4">
        <button @click="goBack" class="">
          <IconArrowLeft :size="24" stroke-width="2" />
        </button>
        <div class="text-xl font-bold text-center">ID #{{ expense.id }}</div>
        <button @click="editExpense" class="" v-if="isEditable">
          <IconEdit :size="24" stroke-width="2" />
        </button>
      </div>
      <div class="flex flex-row items-center text-gray-500 py-1 mt-8">
        <IconCalendar :size="20" stroke-width="2" class="mr-2" />
        <div class="">{{ expense.date }}</div>
      </div>
      <div class="flex flex-row items-center py-1">
        <IconReceipt :size="20" stroke-width="2" class="mr-2" />
        <div class="text-lg font-bold">{{ expense.description }}</div>
      </div>
      <div class="flex flex-row items-center py-1 text-gray-500">
        <IconCategory :size="20" stroke-width="2" class="mr-2" />
        <div
          :class="{
            'badge badge-neutral': expense.category_id === 1,
            'badge badge-primary': expense.category_id !== 1
          }"
        >
          {{ expense.category_name }}
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
</template>
