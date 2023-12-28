<template>
  <div class="flex mt-4">
    <div class="max-w-md w-full">
      <div class="px-4">
        <h1 class="text-4xl font-bold mb-6">Add Expense</h1>
      </div>
      <form @submit.prevent="submitForm" class="px-4 text-center">
        <div class="mb-2">
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
        <div class="mb-2">
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
        <div class="mb-2">
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text font-semibold">Category ID</span>
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
                {{ category.category_name }}
              </option>
            </select>
          </label>
          <div v-if="errors.category_id" class="text-red-500 text-sm text-right mt-1">
            {{ errors.category_id }}
          </div>
        </div>
        <div class="mb-2">
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
        <div class="mb-6">
          <div class="label">
            <span class="label-text font-semibold">Users</span>
          </div>
          <div class="form-control">
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
                <th>Username</th>
                <th>Share</th>
                <th>Action</th>
                <!-- New column -->
              </tr>
            </thead>
            <tbody v-if="users">
              <tr v-for="(user, index) in users" :key="index">
                <td>{{ user.username }}</td>
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
                      class="feather feather-trash-2"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path
                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m6 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"
                      ></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="errors.total_cost" class="text-red-500 text-sm text-right mt-1">
            {{ errors.total_cost }}
          </div>
        </div>
        <button @click="openDialog" type="button" class="btn w-full">Add User</button>
        <button type="submit" class="btn w-full mt-4">Add Expense</button>
      </form>
    </div>
  </div>

  <!-- Add DialogComponent -->
  <UserDialogComponent :isOpen="isDialogOpen" @close="handleClose" />
</template>

<script setup>
import { ref, defineEmits, onMounted, watch } from 'vue'
import { addExpense } from '../lib/api.js'
import { useToast } from 'vue-toastification'
import { useUserStore } from '../lib/stores.js'
import { validateExpenseInput } from '../lib/utils.js'
import { getCategories } from '../lib/api.js'
import UserDialogComponent from '../components/UserDialogComponent.vue'

// eslint-disable-next-line no-unused-vars
const emits = defineEmits(['loginSuccess', 'openSidebar'])

const user_id = ref('')
const date = ref('')
const description = ref('')
const category_id = ref('')
const total_cost = ref('')
const errors = ref({})
const users = ref([])
const shareEqually = ref(true)
const $toast = useToast()
const isRefund = ref(false)
const isDialogOpen = ref(false)
const categories = ref([])

// Track refund
watch(isRefund, (newVal) => {
  if (newVal) {
    total_cost.value = 0
    category_id.value = 1
    shareEqually.value = false
  }
})

// Define dialog state and content

// Define dialog actions

// Define a method to open the dialog
const openDialog = () => {
  isDialogOpen.value = true
}

// Watch for changes in users array, isRefund, and shareEqually
watch(
  [users, total_cost, isRefund, shareEqually],
  ([newUsers, newTotalCost, newIsRefund, newShareEqually]) => {
    if(newIsRefund){
      if(!newShareEqually && newUsers.length > 1){ // 1 because the disabled user is always present
        // Calculate the sum of shares for all users other than the disabled one
        let sumOfOtherShares = 0;
        for(let i = 1; i < newUsers.length; i++) {
          sumOfOtherShares += parseFloat(newUsers[i].share || 0);
        }
        console.log(sumOfOtherShares);
        // Update the share for the disabled user (expected to be at index 0)
        newUsers[0].share = (-sumOfOtherShares).toFixed(2);
        
      }

    } else {
      if (newShareEqually && newTotalCost && newUsers.length > 0) {
        const equalShare = (parseFloat(newTotalCost) / newUsers.length).toFixed(2);
        newUsers.forEach(user => user.share = equalShare);
      }
    }
  },
  { deep: true }
);

// When the component is mounted, get the user_id from the store
onMounted(() => {
  const userStore = useUserStore()
  user_id.value = userStore.user_id

  // Set the current date
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so we need to add 1
  const day = String(today.getDate()).padStart(2, '0');
  const output = today.getFullYear()+'-'+month+'-'+day;
  date.value = output;

  // Check if the user is not already in the list
  const userExists = users.value.some((existingUser) => existingUser.id === user_id.value)

  // Get Categories
  getCategories().then((response) => {
    categories.value = response
    // Remove the first category (id = 1) from the list, as it is the Refund category
    categories.value.shift()
  })

  if (!userExists) {
    // Add current user to the list
    users.value.push({ id: user_id.value, username: userStore.username, isDefault: true })
    console.log(users.value)
  }
})

const handleClose = (user) => {
  if (typeof user === 'object' && user && user.id) {
    const userExists = users.value.some((existingUser) => existingUser.id === user.id)

    if (!userExists) {
      // Add share property to the user
      //user.share = userShare.value
      users.value.push(user)
    } else {
      console.log('User already exists in the list')
      $toast.error('User already exists in the list', {
        hideProgressBar: true
      })
    }
  } else {
    console.log('No user selected')
  }
  isDialogOpen.value = false
}

const deleteUser = (index) => {
  if (users.value[index].isDefault) {
    console.log('Default user cannot be deleted')
    return
  }
  users.value.splice(index, 1)
}

async function submitForm() {
  console.log(total_cost.value)
  const result = await validateExpenseInput(
    date.value,
    category_id.value,
    total_cost.value,
    description.value,
  )
  if (result.status === 'validated') {
    // Calculate the sum of all user shares
    const sumOfShares = users.value.reduce((sum, user) => sum + parseFloat(user.share), 0)

    // Define an acceptable error margin
    const epsilon = 0.01

    // Compare the sum of shares with the total cost
    if (Math.abs(sumOfShares - parseFloat(total_cost.value)) > epsilon) {
      // Set an error message and return from the function
      $toast.error('The sum of shares does not equal the total cost.', {
        hideProgressBar: true
      })
      return
    }

    // Get user_id from store
    const userStore = useUserStore()
    user_id.value = parseInt(userStore.user_id)


    const expense = {
      user_id: user_id.value,
      date: date.value,
      description: description.value,
      category_id: category_id.value,
      total_cost: total_cost.value,
      // Include the shares of each user
      users: users.value.map((user) => ({ user_id: user.id, share: user.share }))
    }

    console.log(expense)

    try {
      const dateObject = new Date(date.value)
      const year = dateObject.getFullYear()
      const month = dateObject.getMonth() + 1 // JavaScript months are 0-indexed
      const response = await addExpense(
        year,
        month,
        expense.user_id,
        expense.description,
        expense.category_id,
        expense.total_cost,
        expense.users
      )
      console.log(response)

      // Add toast notification here
      const $toast = useToast()
      $toast.success('Expense added successfully!', {
        hideProgressBar: true
      })

      // Clear the inputs
      date.value = ''
      description.value = ''
      category_id.value = ''
      total_cost.value = ''
      users.value = [users.value[0]]
      users.value[0].share = 0 // Reset the share to 0
    } catch (error) {
      console.error(error)

      // Add toast notification for error here
      const $toast = useToast()
      $toast.error('Failed to add expense. Please try again.', {
        hideProgressBar: true
      })
    }
  } else {
    // Map the errors to the corresponding fields
    console.log(result.errors)
    errors.value = result.errors.reduce((acc, error) => {
      if (error.field === 'password') {
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
</script>
