<template>
  <div v-if="isOpen" class="fixed inset-0 flex justify-center items-center z-50">
    <!-- Background -->
    <div class="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <!-- Card -->
      <div class="card bg-base-100 rounded shadow-xl w-full mx-4 max-w-3xl">
        <div class="card-body">
          <form>
            <h2 class="card-title mb-6">Search an user</h2>
            <input
              v-model="searchQuery"
              @input="search"
              type="text"
              class="w-full px-4 input input-bordered"
              placeholder="Search..."
              autocapitalize="none"
            />
            <!-- Dropdown list for search results -->
            <div v-if="searchResults.length > 0" class="dropdown dropdown-open w-full">
              <ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full">
                <li v-for="(user, index) in searchResults" :key="index" @click="selectUser(user)">
                  <a class="font-semibold">@{{ user.username }}</a>
                </li>
              </ul>
            </div>
            <!-- Error message -->
            <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
            <div class="card-actions justify-end mt-4">
              <button class="btn flex-grow" type="button" @click="closeDialog">Close</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, defineEmits, onMounted } from 'vue'
import { searchUser } from '@/lib/api.js'
import { useUserStore } from '@/lib/stores.js'

// Properties of the component
const props = defineProps({
  isOpen: {
    // if the dialog is open
    type: Boolean,
    required: true
  }
})

const { isOpen } = toRefs(props)
let loggedUsername = ref('')
let username = ref('')
let errorMessage = ref('')
const searchQuery = ref('')
let searchResults = ref([]) // new ref for search results

const emit = defineEmits(['close'])

onMounted(() => {
  searchResults.value = [] // clear search results
  const userStore = useUserStore()
  loggedUsername.value = userStore.username // store the logged user
})

// Search for users
const search = async () => {
  const res = await searchUser(searchQuery.value) // Search users
  searchResults.value = res.slice(0, 5) // store only the first 5 search results

  // remove the logged-in user from the search results
  const userIndex = searchResults.value.findIndex((user) => user.username === loggedUsername.value)
  if (userIndex !== -1) {
    searchResults.value.splice(userIndex, 1)
  }
}

// Select a user from the search results
const selectUser = (user) => {
  username.value = user.username // set username to the clicked username
  closeDialog(user) // pass the user to the parent component
}

// Close the dialog
const closeDialog = (user) => {
  // clear search results
  username.value = ''
  searchResults.value = []
  searchQuery.value = ''

  emit('close', user) // pass the user to the parent component
}
</script>
