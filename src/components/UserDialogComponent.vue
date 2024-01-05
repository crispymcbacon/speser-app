<template>
  <div v-if="isOpen" class="fixed inset-0 flex justify-center items-center z-50">
    <div class="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div class="card bg-base-100 rounded shadow-xl w-full mx-4 max-w-3xl">
        <div class="card-body">
          <form @submit.prevent="submitForm">
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

            <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
            <div class="card-actions justify-end mt-4">
              <button class="btn flex-grow" type="button" @click="closeDialog">Close</button>
              <!-- <button class="btn flex-grow" type="submit">Add</button> -->
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, defineEmits } from 'vue'
import { searchUser } from '../lib/api.js'
import { useUserStore } from '../lib/stores.js'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

const { isOpen } = toRefs(props)

let username = ref('')
let errorMessage = ref('')

const searchQuery = ref('')
let searchResults = ref([]) // new ref for search results

const submitForm = async () => {
  // check if it is not the logged user
  const userStore = useUserStore()
  if (userStore.username === username.value) {
    errorMessage.value = 'You will be already on the expense!'
    return
  }
  const user = await searchUser(username.value)
  if (user && user.length > 0) {
    closeDialog(user[0])
    // empty the username field
  } else {
    errorMessage.value = 'User not found'
  }
}

const closeDialog = (user) => {
  username.value = ''
  emit('close', user)
}

const search = () => {
  const userStore = useUserStore()
  searchUser(searchQuery.value).then((res) => {
    searchResults.value = res.slice(0, 5) // store only the first 5 search results

    // remove the logged-in user from the search results
    const userIndex = searchResults.value.findIndex((user) => user.username === userStore.username)
    if (userIndex !== -1) {
      searchResults.value.splice(userIndex, 1)
    }
  })
}

const selectUser = (user) => {
  username.value = user.username // set username to the clicked username
  //searchQuery.value = user.username // set searchQuery to the clicked username
  //searchResults.value = [] // clear search results
  closeDialog(user)

  // clear search results
    searchResults.value = []
    searchQuery.value = ''
}
</script>
