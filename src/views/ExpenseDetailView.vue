<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getExpense } from '../lib/api'
import { useUserStore } from '../lib/stores.js'

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
      <button @click="editExpense" class="" v-if="isEditable">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 16 16"
          id="edit"
        >
          <path
            fill="#212121"
            d="M12.2417871,6.58543288 L6.27024769,12.5583865 C5.94985063,12.8787836 5.54840094,13.1060806 5.1088198,13.2159758 L2.81782051,13.7887257 C2.45163027,13.8802732 2.11993389,13.5485768 2.21148144,13.1823866 L2.78423127,10.8913873 C2.89412655,10.4518062 3.12142351,10.0503565 3.44182056,9.72995942 L9.41336001,3.75700576 L12.2417871,6.58543288 Z M13.6567078,2.3434993 C14.4377564,3.12454789 14.4377564,4.39087785 13.6567078,5.17192643 L12.9488939,5.8783261 L10.1204668,3.04989898 L10.8282807,2.3434993 C11.6093293,1.56245072 12.8756592,1.56245072 13.6567078,2.3434993 Z"
          ></path>
        </svg>
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
