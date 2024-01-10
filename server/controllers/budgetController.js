import * as db from '../db.js' // Assume that 'db' is a module that exports a connection pool to PostgreSQL.
import bcrypt from 'bcryptjs' // To hash passwords.
import jwt from 'jsonwebtoken' // To generate JWTs.
import { check, validationResult } from 'express-validator' // To validate user input.

// ------ Authentication ------------------------------------------------------------------------------------------------

// Middleware to validate the user input for the login route
export function validateRegistration() {
  return [
    check('username')
      .isLength({ min: 3, max: 15 })
      .withMessage('Username must be between 3 and 15 characters')
      .matches(/^[a-z0-9_]+$/)
      .withMessage('Username can only contain lowercase alphanumeric characters and underscores')
      .custom(async (username) => {
        const existingUser = await db.query(
          'SELECT * FROM users WHERE LOWER(username) = LOWER($1)',
          [username]
        )
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
      console.log(errors)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }
      next()
    }
  ]
}

// Register a new user
export const registerUser = async (req, res) => {
  const { username, first_name, last_name, password } = req.body

  const password_hash = await bcrypt.hash(password, 10) // Hash the password before storing it

  try {
    await db.query(
      // Insert the user into the database
      'INSERT INTO users (username, first_name, last_name, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, first_name, last_name, password_hash]
    )

    res.status(201).json('Registration successful')
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Login a user
export const loginUser = async (req, res) => {
  const { username, password } = req.body

  try {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]) // Fetch the user from the database
    const user = result.rows[0]

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      // If user not found or password doesn't match
      return res.status(401).json({ error: 'Invalid username or password' })
    } else {
      const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET) // Generate a JWT token, add {expiresIn: '1h'} in PRODUCTION

      res.json({
        // Send the token and user information in the response
        accessToken: token,
        user: {
          user_id: user.id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name
        }
      })
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// ------ Expenses ------------------------------------------------------------------------------------------------------

// Get all expenses for the logged user
export const getUserExpenses = async (req, res) => {
  try {
    const user_id = req.user_id

    const result = await db.query(
      // Query to fetch expenses of the logged user
      `SELECT expenses.*, categories.name AS category_name 
       FROM expenses 
       LEFT JOIN categories ON expenses.category_id = categories.id 
       WHERE user_id = $1`,
      [user_id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Get all expenses for the logged user for a specific year
export const getUserExpensesByYear = async (req, res) => {
  try {
    const user_id = req.user_id
    const year = req.params.year

    const result = await db.query(
      // Query to fetch expenses for the user for a specific year
      `SELECT * FROM expenses WHERE user_id = $1 AND EXTRACT(YEAR FROM date) = $2`,
      [user_id, year]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Get all expenses for the logged user for a specific year and month
export const getUserExpensesByYearMonth = async (req, res) => {
  try {
    const user_id = req.user_id
    const year = req.params.year
    const month = req.params.month

    const result = await db.query(
      // Query to fetch expenses for the user for a specific year and month
      `SELECT * FROM expenses WHERE user_id = $1 AND EXTRACT(YEAR FROM date) = $2 AND EXTRACT(MONTH FROM date) = $3`,
      [user_id, year, month]
    )
    res.json(result.rows) // Send the expenses in the response
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Get all expenses for the logged user for a specific year, month, and id
export const getUserExpensesByYearMonthId = async (req, res) => {
  try {
    const year = req.params.year
    const month = req.params.month
    const id = req.params.id

    const result = await db.query(
      // Query to fetch expenses for the user for a specific year, month, and id
      `SELECT expenses.*, categories.name AS category_name, users.username AS owner_username FROM expenses 
       LEFT JOIN categories ON expenses.category_id = categories.id
       LEFT JOIN users ON expenses.user_id = users.id
       WHERE EXTRACT(YEAR FROM date) = $1 AND EXTRACT(MONTH FROM date) = $2 AND expenses.id = $3`,
      [year, month, id]
    )
    const expenses = result.rows // Store the fetched expenses

    const userSharesResult = await db.query(
      // Query to fetch users and their shares for the given expense
      `SELECT users.*, expense_shares.share FROM expense_shares 
       JOIN users ON expense_shares.user_id = users.id
       WHERE expense_shares.expense_id = $1`,
      [id]
    )
    const users = userSharesResult.rows // Store the fetched users and their shares

    expenses[0].users = users // Add the users and their shares to the expense
    res.json(expenses) // Send the expenses and users in the response
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Add an expense for the logged user
export const addUserExpense = async (req, res) => {
  try {
    const logged_user_id = req.user_id
    const { year, month } = req.params
    const { user_id, description, category_id, total_cost, users } = req.body
    const date = new Date(year, month - 1) // Convert year and month to a JavaScript Date object

    const result = await db.query(
      // Query to insert the expense into the expenses table
      'INSERT INTO expenses (user_id, date, description, category_id, total_cost) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [user_id, date, description, category_id, total_cost]
    )

    const expense_id = result.rows[0].id // Get the id of the inserted expense

    if (users && users.length > 0) {
      // If users are provided
      let totalShares = users.reduce((sum, user) => sum + parseFloat(user.share), 0) // Calculate the sum of all shares
      totalShares = totalShares.toFixed(2) // Convert to string with 2 decimal places

      const epsilon = 0.01 // Define an acceptable error margin
      if (Math.abs(totalShares - parseFloat(total_cost)) > epsilon) {
        // Compare the sum of shares with the total cost
        return res.status(400).json({ message: 'The sum of all shares must equal the total cost.' })
      }

      // Add an expense share for each user
      for (let user of users) {
        user.user_id = parseInt(user.user_id, 10)
        if (user.user_id !== logged_user_id && parseFloat(total_cost) === 0) {
          // If the user is not the logged user and the total_cost is zero, make the share negative
          user.share = user.share * -1
        }

        await db.query(
          // Query to insert the expense share into the expense_shares table
          'INSERT INTO expense_shares (expense_id, user_id, share) VALUES ($1, $2, $3)',
          [expense_id, user.user_id, user.share]
        )
      }
    } else {
      // If the expense has just the owner as user, add an expense share for the user_id with the total_cost as the share
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

// Update an expense for the logged user
export const updateUserExpense = async (req, res) => {
  try {
    const logged_user_id = req.user_id
    const { user_id, description, category_id, total_cost, users, expense_id, date } = req.body
    const newdate = new Date(date) // Convert year and month to a JavaScript Date object

    await db.query(
      // Query to update the expense in the expenses table
      'UPDATE expenses SET user_id=$1, date=$2, description=$3, category_id=$4, total_cost=$5 WHERE id=$6',
      [user_id, newdate, description, category_id, total_cost, expense_id]
    )

    if (users && users.length > 0) {
      // If users are provided
      let totalShares = users.reduce((sum, user) => sum + parseFloat(user.share), 0) // Calculate the sum of all shares
      totalShares = totalShares.toFixed(2) // Convert to string with 2 decimal places

      const epsilon = 0.01 // Define an acceptable error margin
      if (Math.abs(totalShares - parseFloat(total_cost)) > epsilon) {
        // Compare the sum of shares with the total cost
        return res.status(400).json({ message: 'The sum of all shares must equal the total cost.' })
      }

      await db.query('DELETE FROM expense_shares WHERE expense_id=$1', [expense_id]) // Delete old shares

      // Add an expense share for each user
      for (let user of users) {
        user.user_id = parseInt(user.user_id, 10)
        if (user.user_id !== logged_user_id && parseFloat(total_cost) === 0) {
          // If the user is not the logged user, make the share negative
          user.share = user.share * -1
        }

        await db.query(
          'INSERT INTO expense_shares (expense_id, user_id, share) VALUES ($1, $2, $3)',
          [expense_id, user.user_id, user.share]
        )
      }
    } else {
      // If the expense has just the owner as user, add an expense share for the user_id with the total_cost as the share
      await db.query(
        'INSERT INTO expense_shares (expense_id, user_id, share) VALUES ($1, $2, $3)',
        [expense_id, user_id, total_cost]
      )
    }

    res.status(200).json({ message: 'Expense and expense share updated successfully.' })
  } catch (err) {
    res.status(500).json({ message: 'Error updating expense and expense share: ' + err })
  }
}

// Delete an expense for the logged user
export const deleteUserExpense = async (req, res) => {
  try {
    const user_id = req.user_id
    const { year, month, id } = req.params

    const result = await db.query(
      // Query to delete the expense for the user for a specific year and month
      `DELETE FROM expenses WHERE user_id = $1 AND id = $2 AND EXTRACT(YEAR FROM date) = $3 AND EXTRACT(MONTH FROM date) = $4`,
      [user_id, id, year, month]
    )

    if (result.rowCount === 0) {
      // If no rows were deleted, send an error response
      return res.status(404).json({ error: 'Expense not found' })
    }

    res.json({ message: 'Expense deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// ------ Balance -------------------------------------------------------------------------------------------------------

// Get the balance and the user's shares for the logged user
export const getUserBalance = async (req, res) => {
  try {
    const user_id = req.user_id

    let debitBalance = 0
    let creditBalance = 0

    const result = await db.query(
      // Query to get the expenses and the user's share of each expense
      `SELECT 
        es.expense_id,
        e.description, 
        e.date, 
        e.total_cost, 
        es.share as balance,
        es.user_id,
        (e.user_id = $1) as is_own_expense,
        c.name as category_name,
        e.category_id,
        u.username as owner_username
      FROM 
        expenses e
      JOIN 
        expense_shares es ON e.id = es.expense_id
      JOIN
        categories c ON e.category_id = c.id
      JOIN
        users u ON e.user_id = u.id
      WHERE 
        es.user_id = $1;`,
      [user_id]
    )
    const expenses = result.rows // Get the expenses from the query result

    // Convert the balance to a debit or credit
    expenses.forEach((share) => {
      share.balance = parseFloat(share.balance)
      if (isNaN(share.balance)) {
        // If expense.balance is NaN after parseFloat set it to 0
        share.balance = 0
      }

      if (share.is_own_expense) {
        // If the share is owned by the logged user
        if (!(parseInt(share.user_id) === parseInt(user_id))) {
          // If the logged user is the owner of the share_share
          if (share.balance > 0) {
            // Credit
            creditBalance += share.balance
            share.balance = `Credit: €${share.balance}`
          } else {
            // Refunds to other users
            console.log('Error 1, Other credit or other refund')
          }
        } else {
          if (share.balance < 0) {
            // Refund received
            debitBalance += share.balance // REFUND, so remove from debit balance
            share.balance = `Refund Paid: -€${-share.balance}`
          } else {
            // Own expense
            const total_cost = parseFloat(share.total_cost)
            creditBalance += total_cost - share.balance // EDIT
            //share.balance = `Own expense: €${share.balance}`
            share.balance = `Credit: €${total_cost - share.balance}`
          }
        }
      } else {
        if (parseInt(share.user_id) === parseInt(user_id)) {
          if (share.balance > 0) {
            debitBalance += share.balance
            share.balance = `Debit: ${share.balance}`
          } else if (share.balance < 0) {
            // Refund received
            creditBalance += share.balance // REFUND, so remove from credit balance
            share.balance = `Refund Received: -€${-share.balance}`
          }
        } else {
          console.log('Error 2, Other debit or other refund')
        }
      }
    })

    // if the debit or credit are negative, invert them
    if (creditBalance < 0) {
      debitBalance -= creditBalance
      creditBalance = 0
    }
    if (debitBalance < 0) {
      creditBalance -= debitBalance
      debitBalance = 0
    }

    res.json({ expenses, debitBalance, creditBalance })
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Get the balance and the user's shares for the logged user
export const getUserBalanceWithId = async (req, res) => {
  try {
    const logged_user_id = req.user_id
    const user_id = req.params.id

    let debitBalance = 0
    let creditBalance = 0

    const result = await db.query(
      // Query to get the expenses and the user's share of each expense
      `SELECT
        e.id,
        e.description, 
        e.date, 
        e.total_cost, 
        es.share as balance,
        es.user_id,
        (e.user_id = $1) as is_own_expense
      FROM 
        expenses e
      JOIN 
        expense_shares es ON e.id = es.expense_id
      WHERE 
        (e.user_id = $1 AND es.user_id = $2) OR (e.user_id = $2 AND es.user_id = $1);`,
      [logged_user_id, user_id]
    )
    const expenses = result.rows // Get the expenses from the query result

    // Convert the balance to a debit or credit
    expenses.forEach((share) => {
      share.balance = parseFloat(share.balance)
      if (isNaN(share.balance)) {
        // If expense.balance is NaN after parseFloat set it to 0
        share.balance = 0
      }

      if (share.is_own_expense) {
        // If the share is owned by the logged user
        if (!(parseInt(share.user_id) === parseInt(logged_user_id))) {
          // If the logged user is the owner of the share_share
          if (share.balance > 0) {
            // Credit
            creditBalance += share.balance
            share.balance = `Credit: €${share.balance}`
          } else {
            // Refund received
            debitBalance += share.balance // REFUND, so remove from debit balance
            share.balance = `Refund Paid: -€${-share.balance}`
          }
        } else {
          console.log('Error 1') // Error when the logged user is the owner but the user_id is not the logged user
        }
      } else {
        if (parseInt(share.user_id) === parseInt(logged_user_id)) {
          if (share.balance > 0) {
            debitBalance += share.balance
            share.balance = `Debit: €${share.balance}`
          } else if (share.balance < 0) {
            // Refund received
            creditBalance += share.balance // REFUND, so remove from credit balance
            share.balance = `Refund Received: -€${-share.balance}`
          }
        } else {
          console.log('Error 2') // Error when the logged user is not the owner but the user_id is the logged user
        }
      }
    })

    const totalBalance = creditBalance - debitBalance // Calculate the total balance
    
    res.json({ expenses, debitBalance, creditBalance, totalBalance }) // Send the shares and total balance in the response
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// ------ Search --------------------------------------------------------------------------------------------------------

// Search expenses for the logged user
export const searchExpenses = async (req, res) => {
  try {
    const user_id = req.user_id
    const query = req.query.q

    // Query to search expenses based on the description containing the search query and only for the logged user
    const searchQuery = `
      SELECT expenses.*, categories.name AS category_name FROM expenses
      LEFT JOIN categories ON expenses.category_id = categories.id
      WHERE description ILIKE $1
      AND user_id = $2;
    `
    const results = await db.query(searchQuery, [`%${query}%`, user_id]) // Execute the search query

    res.json(results.rows) // Send the search results in the response
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Search users
export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q

    if (!query) { // If the search query is empty
      return res.json([])
    }

    // Query to search users based on the username containing the search query
    const searchQuery = `
        SELECT * 
        FROM users 
        WHERE username LIKE $1;
    `
    const results = await db.query(searchQuery, [`${query}%`]) 

    res.json(results.rows) // Send the search results in the response
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Get the user information for the logged user
export const getAuthUser = async (req, res) => {
  try {
    const user_id = req.user_id

    const result = await db.query(
      // Query to fetch user information
      'SELECT id, username, first_name, last_name, created_at FROM users WHERE id = $1', 
      [user_id]
    )

    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// ------ Categories ----------------------------------------------------------------------------------------------------

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const result = await db.query('SELECT id AS category_id, name AS category_name FROM categories') // Query to fetch id and name from categories
    const categories = result.rows.map((category) => ({
      category_id: category.category_id,
      category_name: category.category_name
    })) // Extract category_id and category_name from each category

    res.json(categories)
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
