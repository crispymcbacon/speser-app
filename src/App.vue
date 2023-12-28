<script setup>
import { RouterLink, RouterView} from 'vue-router'
import { ref } from 'vue'
import VueCookies from 'vue-cookies';

let isSidebarOpen = ref(false)
let isLoggedIn = ref(VueCookies.get('jwt') !== null);

// This needs to be a method so that we can call it from the child component
// Is needed to update the sidebar state after login
const handleLoginSuccess = () => {
  isLoggedIn.value = true;
};

const logout = () => {
  VueCookies.remove('jwt')
  isLoggedIn.value = false;
  isSidebarOpen.value = false;
}
</script>

<template>
  <div class="drawer">
    <input id="my-drawer-3" type="checkbox" class="drawer-toggle" v-model="isSidebarOpen"/> 
    <div class="drawer-content flex flex-col">
      <header class="navbar bg-base-100">
        <div class="navbar-start">
          <div class="flex-none lg:hidden">
            <label for="my-drawer-3" aria-label="open sidebar" class="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </label>
          </div> 
          <a class="btn btn-ghost text-xl">Finmily</a>
        </div>

        <div class="navbar-center hidden lg:flex">
          <ul class="menu menu-horizontal px-1">
            <li v-if="isLoggedIn"><RouterLink to="/" @click="isSidebarOpen = false">Home</RouterLink></li>
            <li v-if="isLoggedIn"><RouterLink to="/balance">Balance</RouterLink></li>
            <li v-if="isLoggedIn"><RouterLink to="/balancetouser">Balance To User</RouterLink></li>
            <li v-if="!isLoggedIn"><RouterLink to="/signin">Signin</RouterLink></li>
            <li v-if="!isLoggedIn"><RouterLink to="/signup">Signup</RouterLink></li>
          </ul>
        </div>

        <div class="navbar-end">
          <!-- <a class="btn">Button</a> -->
        </div>
      </header>

      <div class="container mx-auto max-w-3xl">
        <RouterView @login-success="handleLoginSuccess" @openSidebar="isSidebarOpen = true" />
      </div>
    </div>
    <div class="drawer-side">
      <label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label> 
      <ul class="menu w-80 min-h-full bg-base-200 text-lg">
        <li>
          <h2 class="menu-title text-lg">Menu</h2>
          <ul>
            <!-- Sidebar content here -->
          <li v-if="isLoggedIn"><RouterLink active-class="active" to="/" @click="isSidebarOpen = false">Home</RouterLink></li>
          <li v-if="isLoggedIn"><RouterLink active-class="active" to="/expenses" @click="isSidebarOpen = false">Expenses</RouterLink></li>
          <li v-if="isLoggedIn"><RouterLink active-class="active" to="/addexpense" @click="isSidebarOpen = false">Add Expense</RouterLink></li>
          <li v-if="isLoggedIn"><RouterLink active-class="active" to="/balance" @click="isSidebarOpen = false">Balance</RouterLink></li>
          <li v-if="isLoggedIn"><RouterLink active-class="active" to="/balancetouser" @click="isSidebarOpen = false">Balance To User</RouterLink></li>
          <li v-if="!isLoggedIn"><RouterLink active-class="active" to="/signin" @click="isSidebarOpen = false">Signin</RouterLink></li>
          <li v-if="!isLoggedIn"><RouterLink  active-class="active" to="/signup" @click="isSidebarOpen = false">Signup</RouterLink></li>
          <li v-if="isLoggedIn"><a href="#" @click="logout">Logout</a></li>
          </ul>
        
      </li>
      </ul>
    </div>
  
  </div>
  
</template>
