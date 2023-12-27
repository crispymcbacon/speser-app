import * as db from '../db.js' // Assume that 'db' is a module that exports a connection pool to PostgreSQL.
import bcrypt from 'bcryptjs' // To hash passwords.
import jwt from 'jsonwebtoken' // To generate JWTs.
import { check, validationResult } from 'express-validator' // To validate user input.

// ------ Authentication ------------------------------------------------------------------------------------------------
export function validateRegistration() {
  return [
    check('username')
      .isLength({ min: 3, max: 15 })
      .withMessage('Username must be between 3 and 15 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain alphanumeric characters and underscores')
      .custom(async (username) => {
        const existingUser = await db.query('SELECT * FROM users WHERE username = $1', [username])
        if (existingUser.rows.length > 0) {
          throw new Error('Username already in use')
        }
      }),
    check('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[0-9]/)
      .withMessage('Password must contain at least one number'),

    check('first_name').not().isEmpty().withMessage('First name is required'),

    check('last_name').not().isEmpty().withMessage('Last name is required'),

    (req, res, next) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }
      next()
    }
  ]
}

export const registerUser = async (req, res) => {
  const { username, first_name, last_name, password } = req.body

  // Hash the password before storing it
  const password_hash = await bcrypt.hash(password, 10)

  try {
    // Insert the user into the database
    const result = await db.query(
      'INSERT INTO users (username, first_name, last_name, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, first_name, last_name, password_hash]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const loginUser = async (req, res) => {
  const { username, password } = req.body

  try {
    // Fetch the user from the database
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username])

    const user = result.rows[0]

    // If user not found or password doesn't match, send an error response
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid username or password' })
    } else {
      // Generate a JWT token if everything is ok
      const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET) // {expiresIn: '1h'}

      // Send the token and user information in the response
      res.json({
        accessToken: token,
        user: {
          user_id: user.id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name
        }
      })
    }

    // If everything is ok, send the user data in the response
    //res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// ------ Expenses ------------------------------------------------------------------------------------------------------
export const getUserExpenses = async (req, res) => {
  try {
    const user_id = req.user_id // Get the user ID from the request
    console.log(req.user_id) // Log the user ID

    const result = await db.query(
      'SELECT * FROM expenses WHERE user_id = $1', // Query to fetch expenses for the user
      [user_id]
    )

    const expenses = result.rows // Store the fetched expenses

    res.json(expenses) // Send the expenses in the response
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getUserExpensesByYear = async (req, res) => {
  try {
    const user_id = req.user_id // Get the user ID from the request
    const year = req.params.year // Get the year from the request parameters

    const result = await db.query(
      `SELECT * FROM expenses WHERE user_id = $1 AND EXTRACT(YEAR FROM date) = $2`, // Query to fetch expenses for the user for a specific year
      [user_id, year]
    )

    const expenses = result.rows // Store the fetched expenses

    // print the date
    console.log(expenses[0].date)

    res.json(expenses) // Send the expenses in the response
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getUserExpensesByYearMonth = async (req, res) => {
  try {
    const user_id = req.user_id // Get the user ID from the request
    const year = req.params.year // Get the year from the request parameters
    const month = req.params.month // Get the month from the request parameters

    const result = await db.query(
      `SELECT * FROM expenses WHERE user_id = $1 AND EXTRACT(YEAR FROM date) = $2 AND EXTRACT(MONTH FROM date) = $3`, // Query to fetch expenses for the user for a specific month
      [user_id, year, month]
    )

    const expenses = result.rows // Store the fetched expenses

    res.json(expenses) // Send the expenses in the response
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getUserExpensesByYearMonthId = async (req, res) => {
  try {
    const user_id = req.user_id // Get the user ID from the request
    const year = req.params.year // Get the year from the request parameters
    const month = req.params.month // Get the month from the request parameters
    const id = req.params.id // Get the id from the request parameters

    const result = await db.query(
      `SELECT expenses.*, categories.name AS category_name FROM expenses 
       LEFT JOIN categories ON expenses.category_id = categories.id
       WHERE user_id = $1 AND EXTRACT(YEAR FROM date) = $2 AND EXTRACT(MONTH FROM date) = $3 AND expenses.id = $4`, // Query to fetch expenses for the user for a specific year, month, and id
      [user_id, year, month, id]
    )

    const expenses = result.rows // Store the fetched expenses

    res.json(expenses) // Send the expenses in the response
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const addUserExpense = async (req, res) => {
  try {
    const { year, month } = req.params
    const { user_id, description, category_id, total_cost, users } = req.body

    // Convert year and month to a JavaScript Date object
    const date = new Date(year, month - 1)

    // Insert the expense into the expenses table
    const result = await db.query(
      'INSERT INTO expenses (user_id, date, description, category_id, total_cost) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [user_id, date, description, category_id, total_cost]
    )

    // Get the id of the inserted expense
    const expense_id = result.rows[0].id

    console.log(users)

    if (users && users.length > 0) {
      // Calculate the sum of all shares
      const totalShares = users.reduce((sum, user) => sum + user.share, 0)

      // Check if the sum of all shares equals the total_cost
      if (totalShares !== total_cost) {
        return res.status(400).json({ message: 'The sum of all shares must equal the total cost.' })
      }

      // If users is provided, add an expense share for each user
      for (let user of users) {
        // convert user_id to integer
        user.user_id = parseInt(user.user_id, 10)
        await db.query(
          'INSERT INTO expense_shares (expense_id, user_id, share) VALUES ($1, $2, $3)',
          [expense_id, user.user_id, user.share]
        )
      }
    } else {
      // If users is not provided, add an expense share for the user_id with the total_cost as the share
      await db.query(
        'INSERT INTO expense_shares (expense_id, user_id, share) VALUES ($1, $2, $3)',
        [expense_id, user_id, total_cost]
      )
    }

    res.status(201).json({ message: 'Expense and expense share added successfully.' })
  } catch (err) {
    res.status(500).json({ message: 'Error adding expense and expense share: ' + err })
  }
}

export const updateUserExpense = async (req, res) => {
  try {
    const { year, month, id } = req.params
    const { description, total_cost, category_id } = req.body

    const date = new Date(year, month - 1) // JavaScript months are 0-indexed
    const user_id = req.user_id // Get the user ID from the request

    await db.query(
      `UPDATE expenses SET description = $1, total_cost = $2, category_id = $3, date = $4
      WHERE id = $5 AND user_id = $6 AND EXTRACT(YEAR FROM date) = $7 AND EXTRACT(MONTH FROM date) = $8`,
      [description, total_cost, category_id, date, id, user_id, year, month]
    )

    res.status(200).json({ message: 'Expense updated successfully.' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to update expense.' })
  }
}

export const deleteUserExpense = async (req, res) => {
  try {
    const user_id = req.user_id // Get the user ID from the request
    const { year, month, id } = req.params // Get the year, month, and id from the request parameters

    // Query to delete the expense for the user for a specific year and month
    const result = await db.query(
      `DELETE FROM expenses WHERE user_id = $1 AND id = $2 AND EXTRACT(YEAR FROM date) = $3 AND EXTRACT(MONTH FROM date) = $4`,
      [user_id, id, year, month]
    )

    // If no rows were deleted, send an error response
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Expense not found' })
    }

    // If the expense was deleted successfully, send a success response
    res.json({ message: 'Expense deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// ------ Balance -------------------------------------------------------------------------------------------------------
export const getUserBalance = async (req, res) => {
  try {
    const user_id = req.user_id // Get the user ID from the request

    // Query to get the expenses and the user's share of each expense
    const query = `
      SELECT 
        e.description, 
        e.date, 
        e.total_cost, 
        es.share as balance,
        (e.user_id = $1) as is_own_expense
      FROM 
        expenses e
      JOIN 
        expense_shares es ON e.id = es.expense_id
      WHERE 
        e.user_id = $1 OR es.user_id = $1;
    `

    const result = await db.query(query, [user_id])
    const expenses = result.rows // Get the expenses from the query result

    let debitBalance = 0
    let creditBalance = 0

    // Convert the balance to a debit or credit
    expenses.forEach((expense) => {
      // Ensure expense.balance is an integer
      expense.balance = parseInt(expense.balance, 10)

      // If expense.balance is NaN after parseInt (which means it was not a number to begin with), set it to 0
      if (isNaN(expense.balance)) {
        expense.balance = 0
      }

      if (expense.is_own_expense) {
        // Only add to credit balance if the user's share is less than the total cost
        if (expense.balance > 0 && expense.balance < expense.total_cost) {
          creditBalance += expense.balance
          expense.balance = `Credit: ${expense.balance}`
        }
      } else {
        if (expense.balance > 0) {
          debitBalance += expense.balance
          expense.balance = `Debit: ${expense.balance}`
        }
      }
    })
    console.log({ expenses, debitBalance, creditBalance })
    res.json({ expenses, debitBalance, creditBalance }) // Send the expenses in the response
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// ------ Balance -------------------------------------------------------------------------------------------------------
export const getUserBalanceWithId = async (req, res) => {
  try {
    const logged_user_id = req.user_id // Get the logged user ID from the request
    const user_id = req.params.id // Get the user ID from the request parameters

    // Query to get the expenses and the user's share of each expense
    const query = `
      SELECT 
        e.description, 
        e.date, 
        e.total_cost, 
        es.share as balance,
        (e.user_id = $1) as is_own_expense
      FROM 
        expenses e
      JOIN 
        expense_shares es ON e.id = es.expense_id
      WHERE 
        (e.user_id = $1 AND es.user_id = $2) OR (e.user_id = $2 AND es.user_id = $1);
    `

    const result = await db.query(query, [logged_user_id, user_id])
    const expenses = result.rows // Get the expenses from the query result

    console.log(expenses)


    let debitBalance = 0
    let creditBalance = 0

    // Convert the balance to a debit or credit
    expenses.forEach((expense) => {
      // Ensure expense.balance is an integer
      expense.balance = parseInt(expense.balance, 10)

      // If expense.balance is NaN after parseInt (which means it was not a number to begin with), set it to 0
      if (isNaN(expense.balance)) {
        expense.balance = 0
      }

      if (expense.is_own_expense) {
        // Only add to credit balance if the user's share is less than the total cost
        if (expense.balance > 0 && expense.balance < expense.total_cost) {
          creditBalance += expense.balance
          expense.balance = `Credit: ${expense.balance}`
        }
      } else {
        if (expense.balance > 0) {
          debitBalance += expense.balance
          expense.balance = `Debit: ${expense.balance}`
        }
      }
    })

    const totalBalance = creditBalance - debitBalance

    console.log({ expenses, debitBalance, creditBalance, totalBalance })
    res.json({ expenses, debitBalance, creditBalance, totalBalance }) // Send the expenses and total balance in the response
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// ------ Search --------------------------------------------------------------------------------------------------------
export const searchExpenses = async (req, res) => {
  try {
    const user_id = req.user_id // Get the user ID from the request
    const query = req.query.q // Get the search query from the request

    // Query to search expenses based on the description containing the search query and only for the logged user
    const searchQuery = `
      SELECT * FROM expenses
      WHERE description LIKE $1
      AND user_id = $2;
    `

    const results = await db.query(searchQuery, [`%${query}%`, user_id]) // Execute the search query
    const expenses = results.rows // Store the search results

    res.json(expenses) // Send the search results in the response
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q // Get the search query from the request

    if (!query) {
      return res.json([])
    }

    // Query to search users based on the username containing the search query
    const searchQuery = `
        SELECT * 
        FROM users 
        WHERE username LIKE $1;
    `

    const results = await db.query(searchQuery, [`${query}%`]) // Execute the search query
    const users = results.rows // Store the search results

    res.json(users) // Send the search results in the response
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getAuthUser = async (req, res) => {
  try {
    const user_id = req.user_id // Get the user ID from the request

    console.log(user_id)

    const result = await db.query(
      'SELECT id, username, first_name, last_name, created_at FROM users WHERE id = $1', // Query to fetch user information
      [user_id]
    )

    const user = result.rows[0] // Store the fetched user information
    console.log(user)

    res.json(user) // Send the user information in the response
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// ------ Categories ----------------------------------------------------------------------------------------------------
export const getCategories = async (req, res) => {
  try {
    const result = await db.query('SELECT id AS category_id, name AS category_name FROM categories') // Query to fetch id and name from categories
    const categories = result.rows.map((category) => ({
      category_id: category.category_id,
      category_name: category.category_name
    })) // Extract category_id and category_name from each category

    res.json(categories) // Send the categories in the response
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
