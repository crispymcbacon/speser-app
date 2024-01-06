import { createRouter, createWebHistory } from 'vue-router'
import VueCookies from 'vue-cookies';
import HomeView from '@/views/HomeView.vue'
import SigninView from '@/views/SigninView.vue'
import SignupView from '@/views/SignupView.vue'
import BalanceView from '@/views/BalanceView.vue'
import BalanceToUser from '@/views/BalanceToUser.vue'
import AddExpense from '@/views/AddExpense.vue'
import ExpensesView from '@/views/ExpensesView.vue'
import SearchExpense from '@/views/SearchExpense.vue'
import ExpenseDetailView from '@/views/ExpenseDetailView.vue'
import ExpenseEditView from '@/views/ExpenseEditView.vue'
import NotFound from '@/views/NotFound.vue'
import UserInfo from '@/views/UserInfo.vue'

// Create the router for navigation
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
      component: BalanceToUser,
      meta: { requiresAuth: true }
    },
    {
      path: '/addexpense',
      name: 'addexpense',
      component: AddExpense,
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
      component: SearchExpense,
      meta: { requiresAuth: true }
    },
    {
      path: '/expense/:year/:month/:id',
      name: 'expensedetail',
      component: ExpenseDetailView,
      meta: { requiresAuth: true }
    },
    {
      path: '/expenseedit/:year/:month/:id',
      name: 'expenseedit',
      component: ExpenseEditView,
      meta: { requiresAuth: true }
    },
    {
      path: '/userinfo',
      name: 'userinfo',
      component: UserInfo,
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notfound',
      component: NotFound,
    },
  ]
})

// Check if the route requires authentication
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const currentUser = VueCookies.get('jwt'); 

  if (requiresAuth && (!currentUser || currentUser === 'undefined')) {
    next('/signin');
  } else if (!requiresAuth && currentUser) {
    next('/');
  } else {
    next();
  }
});

export default router
