import { createRouter, createWebHistory } from 'vue-router'
import VueCookies from 'vue-cookies';
import HomeView from '../views/HomeView.vue'
import SigninView from '../views/SigninView.vue'
import SignupView from '../views/SignupView.vue'
import BalanceView from '../views/BalanceView.vue'
import BalanceToUserView from '../views/BalanceToUserView.vue'
import AddExpenseView from '../views/AddExpenseView.vue'
import ExpensesView from '../views/ExpensesView.vue'
import SearchExpenseView from '../views/SearchExpenseView.vue'
import ExpenseDetailView from '../views/ExpenseDetailView.vue'
import ExpenseEditView from '../views/ExpenseEditView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import UserInfoView from '../views/UserInfoView.vue'

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
      component: UserInfoView,
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notfound',
      component: NotFoundView,
    },
  ]
})

// Check if the route requires authentication
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const currentUser = VueCookies.get('jwt'); // replace 'jwt-token' with your actual token name

  if (requiresAuth && !currentUser) {
    next('/signin');
  } else if (!requiresAuth && currentUser) {
    next();
  } else {
    //next('/notfound');
    next();
  }
});

export default router
