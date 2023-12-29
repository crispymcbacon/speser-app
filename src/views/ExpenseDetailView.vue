<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getExpense } from '../lib/api'
import { useUserStore } from '../lib/stores.js'
import { IconArrowLeft, IconEdit } from '@tabler/icons-vue'

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
  <div class="p-4 rounded-xl shadow-md mx-2">
    <div class="flex justify-between items-center">
      <button @click="goBack" class="">
        <IconArrowLeft :size="24" stroke-width="2" />
      </button>
      <button @click="editExpense" class="" v-if="isEditable">
        <IconEdit :size="24" stroke-width="2" />
      </button>
    </div>
    <div v-if="loading" class="text-center">
      <div class="spinner"></div>
      Loading...
    </div>
    <div class="mt-4" v-else>
      <div class="text-right text-gray-500">Date: {{ expense.date }}</div>
      <div class="font-semibold py-1">Description:</div>
      <div class="">{{ expense.description }}</div>
      <div class="py-2 font-semibold">
        Category:
        <span
          :class="{
            'badge badge-neutral': expense.category_id === 1,
            'badge badge-primary': expense.category_id !== 1
          }"
          >{{ expense.category_name }}</span
        >
      </div>
      <div class="flex justify-between items-center">
        <div class="font-semibold flex-1">Total Cost:</div>
        <div class="text-3xl font-bold">€{{ expense.total_cost }}</div>
      </div>
      <div class="font-semibold py-1">Users:</div>
      <table class="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Share</th>
          </tr>
        </thead>
        <tbody v-if="expense.users">
          <tr v-for="(user, index) in expense.users" :key="index">
            <td class="text-base">{{ user.username }}</td>
            <td class="text-base">{{ user.share }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
