// Handle routes
import express from 'express';
import { authenticateToken } from './utils.js';

import { 
  registerUser,
  loginUser,
  getUserExpenses,
  getUserExpensesByYear,
  getUserExpensesByYearMonth,
  getUserExpensesByYearMonthId,
  addUserExpense,
  updateUserExpense,
  deleteUserExpense,
  getUserBalance,
  getUserBalanceWithId,
  searchExpenses,
  getAuthUser,
  searchUsers
} from './controllers/budgetController.js';

const router = express.Router();

// Authentication and user registration
router.post('/auth/signup', registerUser);
router.post('/auth/signin', loginUser);

// Add authentication middleware to all routes below
router.use(authenticateToken);

// API for search, need to be above the budget API
router.get('/budget/search', searchExpenses);
router.get('/users/search', searchUsers);
router.get('/budget/whoami', getAuthUser);

// API for expenses and budget
router.get('/budget', getUserExpenses);
router.get('/budget/:year', getUserExpensesByYear);
router.get('/budget/:year/:month', getUserExpensesByYearMonth);
router.get('/budget/:year/:month/:id', getUserExpensesByYearMonthId);
router.post('/budget/:year/:month', addUserExpense);
router.put('/budget/:year/:month/:id', updateUserExpense);
router.delete('/budget/:year/:month/:id', deleteUserExpense);

// API for personal balance and details
router.get('/balance', getUserBalance);
router.get('/balance/:id', getUserBalanceWithId);


export default router;