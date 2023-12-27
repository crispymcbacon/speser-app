import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SigninView from '../views/SigninView.vue'
import SignupView from '../views/SignupView.vue'
import BalanceView from '../views/BalanceView.vue'
import BalanceToUserView from '../views/BalanceToUserView.vue'
import AddExpenseView from '../views/AddExpenseView.vue'
import ExpensesView from '../views/ExpensesView.vue'
import SearchExpenseView from '../views/SearchExpenseView.vue'
import ExpenseDetailView from '../views/ExpenseDetailView.vue'

import VueCookies from 'vue-cookies';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/signin',
      name: 'signin',
      component: SigninView,
      meta: { requiresAuth: false }
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
      meta: { requiresAuth: false }
    },
    {
      path: '/balance',
      name: 'balance',
      component: BalanceView,
      meta: { requiresAuth: true }
    },
    {
      path: '/balancetouser',
      name: 'balancetouser',
      component: BalanceToUserView,
      meta: { requiresAuth: true }
    },
    {
      path: '/addexpense',
      name: 'addexpense',
      component: AddExpenseView,
      meta: { requiresAuth: true }
    },
    {
      path: '/expenses',
      name: 'expense',
      component: ExpensesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/searchexpense',
      name: 'searchexpense',
      component: SearchExpenseView,
      meta: { requiresAuth: true }
    },
    {
      path: '/expense/:year/:month/:id',
      name: 'ExpenseDetail',
      component: ExpenseDetailView,
      meta: { requiresAuth: true }
    }
  ]
})

// Check if the route requires authentication
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const currentUser = VueCookies.get('jwt'); // replace 'jwt-token' with your actual token name

  if (requiresAuth && !currentUser) {
    next('/signin');
  } else if (!requiresAuth && currentUser) {
    next('/');
  } else {
    next();
  }
});

export default router
