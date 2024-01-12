<template>
  <div class="px-4 mt-2 md:px-6">
    <!-- Header -->
    <div class="flex flex-row justify-between">
      <h1 class="text-4xl font-bold mb-2 lg:text-5xl">New Expense</h1>
    </div>
  </div>
  <!-- Form -->
  <div class="flex mt-4">
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
          <div class="mb-2 w-1/2">
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
          <div class="mb-2 w-1/2">
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
                <th class="sm:w-1/2">Username</th>
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
        <!-- Submit -->
        <div class="px-4">
          <button type="submit" class="btn w-full mt-4 items-center py-7 content-center text-base">
            <IconPlus :size="28" stroke-width="2" />
            Add Expense
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Add DialogComponent -->
  <UserDialogComponent :isOpen="isDialogOpen" @close="handleClose" />
</template>

<script setup>
import { ref, defineEmits, onMounted, watch } from 'vue'
import { addExpense, getCategories } from '@/lib/api.js'
import { useToast } from 'vue-toastification'
import { useUserStore } from '@/lib/stores.js'
import { validateExpenseInput } from '@/lib/utils.js'
import { IconUserPlus, IconTrash, IconPlus } from '@tabler/icons-vue'
import UserDialogComponent from '@/components/UserDialogComponent.vue'

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
const categories = ref([])

onMounted(async () => {
  try {
    const userStore = useUserStore()
    user_id.value = parseInt(userStore.user_id) // Get user_id from store

    // Set the current date
    const today = new Date()
    const month = String(today.getMonth() + 1).padStart(2, '0') // Months are 0-indexed, so we need to add 1
    const day = String(today.getDate()).padStart(2, '0')
    date.value = today.getFullYear() + '-' + month + '-' + day

    categories.value = await getCategories() // Get categories
    categories.value.shift() // Remove the first category (id = 1) from the list, as it is the Refund category

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

// Add the expense
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
      users: users.value.map((user) => ({ user_id: user.id, share: user.share })) // Map the users to the corresponding user_id and share
    }

    try {
      const dateObject = new Date(date.value)
      const year = dateObject.getFullYear()
      const month = dateObject.getMonth() + 1 // JavaScript months are 0-indexed

      await addExpense(
        // Add the expense
        year,
        month,
        expense.user_id,
        expense.description,
        expense.category_id,
        expense.total_cost,
        expense.users
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
    } catch (error) {
      console.error(error)
      toast.error('Failed to add expense. Please try again.', {
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

// Define a method to open the dialog
const openDialog = () => {
  isDialogOpen.value = true
}

// Define a method to handle the dialog close event
const handleClose = (user) => {
  if (typeof user === 'object' && user && user.id) {
    // Check if the user is not null
    const userExists = users.value.some((existingUser) => existingUser.id === user.id) // Check if the user is not already in the list
    if (!userExists) {
      // If not, add the user to the list
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
