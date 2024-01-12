<template>
  <div class="mt-2 md:px-2">
    <!-- Header -->
    <div class="px-4 grid grid-cols-5 items-center md:px-6">
      <button @click="goBack">
        <IconArrowLeft :size="24" stroke-width="2" />
      </button>
      <h1 class="text-2xl font-bold col-span-3 text-center">Edit expense</h1>
      <div></div>
    </div>
    <!-- Loading -->
    <div v-if="loading" class="mx-auto flex justify-center h-[60vh]">
      <div class="text-lg font-semibold flex flex-row items-center">
        <IconLoader2 class="animate-spin mr-2" :size="28" stroke-width="2" />
        Loading...
      </div>
    </div>
    <!-- Search input -->
    <div v-else class="flex mt-4">
      <div class="max-w-lg w-full mx-auto">
        <form @submit.prevent="submitForm">
          <!-- Total Cost-->
          <div class="mb-2 px-4">
            <label class="form-control w-full">
              <div class="label">
                <span class="label-text font-semibold">Total Cost</span>
              </div>
              <label for="refundToggle" class="label cursor-pointer">
                <span class="label-text">This is a refund</span>
                <input id="refundToggle" v-model="isRefund" type="checkbox" class="toggle" />
              </label>
              <input
                v-model="total_cost"
                :disabled="isRefund"
                type="number"
                id="total_cost"
                placeholder="Total Cost"
                class="input input-bordered w-full"
              />
            </label>
            <div v-if="errors.total_cost" class="text-red-500 text-sm text-right mt-1">
              {{ errors.total_cost }}
            </div>
          </div>
          <!-- Date & Category -->
          <div class="flex flex-row space-x-4 px-4">
            <!-- Date -->
            <div class="mb-2 grow">
              <label class="form-control w-full">
                <div class="label">
                  <span class="label-text font-semibold">Date</span>
                </div>
                <input
                  v-model="date"
                  type="date"
                  id="date"
                  placeholder="Date"
                  class="input input-bordered w-full"
                />
              </label>
              <div v-if="errors.date" class="text-red-500 text-sm text-right mt-1">
                {{ errors.date }}
              </div>
            </div>
            <!-- Category -->
            <div class="mb-2 grow">
              <label class="form-control w-full">
                <div class="label">
                  <span class="label-text font-semibold">Category</span>
                </div>
                <select
                  v-model="category_id"
                  id="category_id"
                  class="select select-bordered w-full"
                  :disabled="isRefund"
                >
                  <option value="" disabled selected>Select Category</option>
                  <option
                    v-for="category in categories"
                    :value="category.category_id"
                    :key="category.category_id"
                  >
                    {{ category.category_id === 1 ? 'Refund' : category.category_name }}
                  </option>
                </select>
              </label>
              <div v-if="errors.category_id" class="text-red-500 text-sm text-right mt-1">
                {{ errors.category_id }}
              </div>
            </div>
          </div>
          <!-- Description -->
          <div class="mb-2 px-4">
            <label class="form-control w-full">
              <div class="label">
                <span class="label-text font-semibold">Description</span>
              </div>
              <textarea
                v-model="description"
                type="text"
                id="description"
                placeholder="Description"
                class="zinput zinput-bordered w-full textarea textarea-bordered"
              ></textarea>
            </label>
            <div v-if="errors.description" class="text-red-500 text-sm text-right mt-1">
              {{ errors.description }}
            </div>
          </div>
          <!-- Users -->
          <div class="mb-6">
            <div class="label px-4">
              <span class="label-text font-semibold">Users</span>
            </div>
            <div class="form-control px-4">
              <label for="shareEqually" class="label cursor-pointer">
                <span class="label-text">Share expense equally</span>
                <input
                  id="shareEqually"
                  v-model="shareEqually"
                  type="checkbox"
                  class="toggle"
                  checked
                />
              </label>
            </div>
            <table class="table" @click.stop>
              <!-- head -->
              <thead>
                <tr>
                  <th class="w-1/2">Username</th>
                  <th>Share</th>
                  <th>Action</th>
                </tr>
              </thead>
              <!-- body -->
              <tbody v-if="users">
                <tr v-for="(user, index) in users" :key="index">
                  <td class="text-base font-semibold pl-4">&nbsp;@{{ user.username }}</td>
                  <td>
                    <input
                      class="input input-bordered w-full"
                      type="number"
                      step="0.01"
                      v-model="user.share"
                      :readonly="shareEqually"
                      :disabled="isRefund && index === 0"
                    />
                  </td>
                  <td>
                    <button @click="deleteUser(index)" v-if="!user.isDefault" class="btn">
                      <IconTrash :size="24" stroke-width="2" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- Add User Button -->
            <div class="text-center px-4">
              <button @click="openDialog" type="button" class="btn mt-2 my-1">
                <IconUserPlus :size="24" stroke-width="2" />Add User
              </button>
            </div>
          </div>
          <!-- Submit Button -->
          <div class="px-4">
            <button
              type="submit"
              class="btn w-full mt-4 items-center py-7 content-center text-base"
            >
              <IconEdit :size="24" stroke-width="2" />
              Edit Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Add DialogComponent -->
  <UserDialogComponent :isOpen="isDialogOpen" @close="handleClose" />
</template>

<script setup>
import { ref, defineEmits, onMounted, watch } from 'vue'
import { updateExpense } from '../lib/api.js'
import { useToast } from 'vue-toastification'
import { useUserStore } from '../lib/stores.js'
import { validateExpenseInput } from '../lib/utils.js'
import { getCategories } from '../lib/api.js'
import UserDialogComponent from '../components/UserDialogComponent.vue'
import { useRoute, useRouter } from 'vue-router'
import { getExpense } from '../lib/api'
import { IconArrowLeft, IconTrash, IconUserPlus, IconEdit, IconLoader2 } from '@tabler/icons-vue'

// eslint-disable-next-line no-unused-vars
const emits = defineEmits(['login', 'logout'])

const user_id = ref('')
const date = ref('')
const description = ref('')
const category_id = ref('')
const total_cost = ref('')
const errors = ref({})
const users = ref([])
const shareEqually = ref(true)
const toast = useToast()
const isRefund = ref(false)
const isDialogOpen = ref(false)
const route = useRoute()
const router = useRouter()
const year = route.params.year
const month = route.params.month
const id = route.params.id
const expense = ref(null)
const loading = ref(true)
const categories = ref([])

// When the component is mounted, get the user_id from the store
onMounted(async () => {
  const userStore = useUserStore()
  user_id.value = userStore.user_id // Get user_id from store

  try {
    categories.value = await getCategories() // Get categories
    categories.value.shift() // Remove the first category (id = 1) from the list, as it is the Refund category

    expense.value = await getExpense(year, month, id) // Get expense

    if (expense.value && expense.value.length > 0) {
      // If expense found
      expense.value = expense.value[0] // Get the first element of the array

      if (parseInt(expense.value.user_id) !== parseInt(user_id.value)) {
        // Check if the expense is of the logged user
        router.push({ name: 'notfound' })
      }

      // Convert the date
      const newdate = new Date(expense.value.date)
      date.value = new Date(Date.UTC(newdate.getFullYear(), newdate.getMonth(), newdate.getDate()))
        .toISOString()
        .split('T')[0]

      // Fill the input values with the fetched expense data
      description.value = expense.value.description
      category_id.value = expense.value.category_id
      total_cost.value = expense.value.total_cost
      isRefund.value = total_cost.value === 0 ? true : false
      shareEqually.value = false

      // Populate users
      users.value = expense.value.users.map((user) => ({
        id: user.id,
        username: user.username,
        share: user.share,
        isDefault: parseInt(user.id) === parseInt(userStore.user_id)
      }))
    }

    const userExists = users.value.some(
      // Check if the user is not already in the list
      (existingUser) => parseInt(existingUser.id) === parseInt(user_id.value)
    )
    if (!userExists) {
      // If not, add the user to the list
      users.value.push({ id: user_id.value, username: userStore.username, isDefault: true })
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})

// Track refund checkbox
watch(isRefund, (newVal) => {
  if (newVal) {
    // If is a refund
    total_cost.value = 0
    category_id.value = 1 // Set category to Refund
    shareEqually.value = false
  } else{
    // Remove the category Refund from categories
    if (categories.value[0].category_name === 'Refund') {
        categories.value.shift()
        category_id.value = ''
      }
  }
})

// Track shareEqually checkbox
watch(
  [users, total_cost, isRefund, shareEqually],
  ([newUsers, newTotalCost, newIsRefund, newShareEqually]) => {
    if (newIsRefund) {
      // If is a refund, calculate the shares
      if (!newShareEqually && newUsers.length > 1) {
        // 1 because the logged user is always present
        // Calculate the sum of shares for all users other than the logged one
        let sumOfOtherShares = 0
        for (let i = 1; i < newUsers.length; i++) {
          sumOfOtherShares += parseFloat(newUsers[i].share || 0)
        }
        // Update the share for the logged user (expected to be the first one)
        newUsers[0].share = (-sumOfOtherShares).toFixed(2) // Negative because it is a refund
      }

      // Force Refund to categories with category_id = 1
      const refundCategory = {
        category_id: 1,
        category_name: 'Refund'
      }
      categories.value.unshift(refundCategory)
    } else {
      // If is not a refund, calculate the equal share
      if (newShareEqually && newTotalCost && newUsers.length > 0) {
        // 0 because the logged user is always present
        const equalShare = (parseFloat(newTotalCost) / newUsers.length).toFixed(2) // Calculate the equal share
        newUsers.forEach((user) => (user.share = equalShare)) // Update the share for all users
      }
      // Remove the category Refund from categories
      if (categories.value[0].category_name === 'Refund') {
        categories.value.shift()
      }
    }
  },
  { deep: true } // Watch nested properties of objects (users)
)

// Define a method to delete a user from the list
const deleteUser = (index) => {
  users.value.splice(index, 1)
}

// Edit the expense
async function submitForm() {
  const result = await validateExpenseInput(
    // Validate the input
    date.value,
    category_id.value,
    total_cost.value,
    description.value
  )
  if (result.status === 'validated') {
    const sumOfShares = users.value.reduce((sum, user) => sum + parseFloat(user.share), 0) // Calculate the sum of all user shares

    const epsilon = 0.01 // Define an acceptable error margin (es. case 3.333)
    if (Math.abs(sumOfShares - parseFloat(total_cost.value)) > epsilon) {
      // Compare the sum of shares with the total cost
      toast.error('The sum of shares does not equal the total cost.', {
        hideProgressBar: true
      })
      return
    }

    const expense = {
      // Create the expense object
      user_id: user_id.value,
      date: date.value,
      description: description.value,
      category_id: category_id.value,
      total_cost: total_cost.value,
      users: users.value.map((user) => ({ user_id: user.id, share: user.share })),
      expense_id: parseInt(id)
    }

    try {
      const dateObject = new Date(date.value)
      const year = dateObject.getFullYear()
      const month = dateObject.getMonth() + 1 // JavaScript months are 0-indexed

      await updateExpense(
        // Update the expense
        year,
        month,
        expense.expense_id,
        expense.user_id,
        expense.description,
        expense.category_id,
        expense.total_cost,
        expense.users,
        date.value
      )

      toast.success('Expense added successfully!', {
        hideProgressBar: true
      })

      // Clear the inputs
      date.value = ''
      description.value = ''
      category_id.value = ''
      total_cost.value = ''
      users.value = [users.value[0]]
      users.value[0].share = 0

      // Redirect to the expense detail page, passing the year, month, and id as params
      router.push({ name: 'expensedetail', params: { year, month, id: expense.expense_id } })
    } catch (error) {
      console.error(error)
      toast.error('Failed to edit expense. Please try again.', {
        hideProgressBar: true
      })
    }
  } else {
    // Map the errors to the corresponding fields
    errors.value = result.errors.reduce((acc, error) => {
      if (error.field === 'password') {
        // handle password error
        if (!acc[error.field]) {
          acc[error.field] = []
        }
        acc[error.field].push(error.message)
      } else {
        acc[error.field] = error.message
      }
      return acc
    }, {})
  }
}

// Go back
const goBack = () => {
  router.back()
}

// Define a method to open the dialog
const openDialog = () => {
  isDialogOpen.value = true
}

// Define a method to handle the dialog close
const handleClose = (user) => {
  if (typeof user === 'object' && user && user.id) {
    const userExists = users.value.some((existingUser) => existingUser.id === user.id)

    if (!userExists) {
      // Add share property to the user
      //user.share = userShare.value
      users.value.push(user)
    } else {
      toast.error('User already exists in the list', {
        hideProgressBar: true
      })
    }
  }
  isDialogOpen.value = false
}
</script>
