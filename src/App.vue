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

// Update the isLoggedIn value from the child component
const handleLogin = () => {
  isLoggedIn.value = true
}
// Update the isLoggedIn value from the child component and remove the jwt cookie
const handleLogout = () => {
  VueCookies.remove('jwt')
  isLoggedIn.value = false
}
</script>

<template>
  <div class=" max-w-7xl mx-auto">
    <!-- Navbar -->
    <header class="navbar bg-base-100 md:px-4">
      <div class="navbar-start">
        <a class="btn btn-ghost text-3xl px-2 text-primary">
          <RouterLink to="/">
            Speser
          </RouterLink>
        </a>
      </div>
      <!-- Desktop Center -->
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1 space-x-2">
          <li v-if="isLoggedIn">
            <RouterLink active-class="active" to="/">
              <IconHome :size="24" stroke-width="2" />
              Home
            </RouterLink>
          </li>
          <li v-if="isLoggedIn">
            <RouterLink active-class="active" to="/expenses">
              <IconReceiptEuro :size="24" stroke-width="2" />
              Expenses
            </RouterLink>
          </li>
          <li v-if="isLoggedIn">
            <RouterLink active-class="active" to="/addexpense">
              <IconCirclePlus :size="24" stroke-width="2" />
              Add Expense
            </RouterLink>
          </li>
          <li v-if="isLoggedIn">
            <RouterLink active-class="active" to="/balance">
              <IconCash :size="24" stroke-width="2" />
              Balance
            </RouterLink>
          </li>
          <li v-if="!isLoggedIn">
            <RouterLink active-class="active" to="/signin">
              <IconLogin2 :size="24" stroke-width="2" />
              Sign In
            </RouterLink>
          </li>
          <li v-if="!isLoggedIn">
            <RouterLink active-class="active" to="/signup">
              <IconUserPlus :size="24" stroke-width="2" />
              Sign Up
            </RouterLink>
          </li>
          <li v-if="isLoggedIn">
            <RouterLink active-class="active" to="/userinfo">
              <IconUserSquareRounded :size="24" stroke-width="2" />
              User Info
            </RouterLink>
          </li>
        </ul>
      </div>
      <div class="navbar-end"></div>
    </header>
    <!-- Main Content -->
    <div class="container mx-auto pb-28">
      <RouterView @login="handleLogin" @logout="handleLogout" />
    </div>

    <div class="fixed inset-x-0 bottom-0 z-10 pb-2 px-8 lg:hidden">
      <ul
        class="menu menu-horizontal shadow-md bg-base-200 rounded-box w-full justify-center px-2 py-4 space-x-1
        "
      >
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
  </div>
</template>
