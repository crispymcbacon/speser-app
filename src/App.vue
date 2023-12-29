<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import VueCookies from 'vue-cookies'
import {
  IconHome,
  IconReceiptEuro,
  IconCash,
  IconCirclePlus,
  IconLogin2,
  IconUserPlus,
  IconUserSquareRounded
} from '@tabler/icons-vue'

let isLoggedIn = ref(VueCookies.get('jwt') !== null)

// This needs to be a method so that we can call it from the child component
// Is needed to update the sidebar state after login
const handleLogin = () => {
  isLoggedIn.value = true
}

const handleLogout = () => {
  VueCookies.remove('jwt')
  isLoggedIn.value = false
}
</script>

<template>
  <header class="navbar bg-base-100">
    <div class="navbar-start">
      <a class="btn btn-ghost text-3xl px-2 text-primary">Speser</a>
    </div>

    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal hidden px-1">
        <li v-if="isLoggedIn">
          <RouterLink to="/">Home</RouterLink>
        </li>
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
  <div class="container mx-auto max-w-3xl pb-28">
    <RouterView @login="handleLogin" @logout="handleLogout" />
  </div>

  <div class="fixed inset-x-0 bottom-0 z-10 pb-2 px-8">
    <ul class="menu menu-horizontal shadow-md bg-base-200 rounded-box w-full justify-center px-2 py-4 space-x-1">
      <li v-if="isLoggedIn">
        <RouterLink active-class="active" to="/">
          <IconHome :size="24" stroke-width="2" />
        </RouterLink>
      </li>
      <li v-if="isLoggedIn">
        <RouterLink active-class="active" to="/expenses">
          <IconReceiptEuro :size="24" stroke-width="2" />
        </RouterLink>
      </li>
      <li v-if="isLoggedIn">
        <RouterLink active-class="active" to="/addexpense">
          <IconCirclePlus :size="24" stroke-width="2" />
        </RouterLink>
      </li>
      <li v-if="isLoggedIn">
        <RouterLink active-class="active" to="/balance">
          <IconCash :size="24" stroke-width="2" />
        </RouterLink>
      </li>
      <li v-if="!isLoggedIn">
        <RouterLink active-class="active" to="/signin">
          <IconLogin2 :size="24" stroke-width="2" />
        </RouterLink>
      </li>
      <li v-if="!isLoggedIn">
        <RouterLink active-class="active" to="/signup">
          <IconUserPlus :size="24" stroke-width="2" />
        </RouterLink>
      </li>
      <li v-if="isLoggedIn">
        <RouterLink active-class="active" to="/userinfo">
          <IconUserSquareRounded :size="24" stroke-width="2" />
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
