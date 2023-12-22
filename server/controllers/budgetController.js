import * as db from '../db.js'; // Assume that 'db' is a module that exports a connection pool to PostgreSQL.
import bcrypt from 'bcryptjs'; // To hash passwords.
import jwt from 'jsonwebtoken'; // To generate JWTs.


// ------ Authentication ------------------------------------------------------------------------------------------------
export const registerUser = async (req, res) => {
  const { username, first_name, last_name, password } = req.body;

  // Hash the password before storing it
  const password_hash = await bcrypt.hash(password, 10);

  try {
    // Insert the user into the database
    const result = await db.query(
      'INSERT INTO users (username, first_name, last_name, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, first_name, last_name, password_hash]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch the user from the database
    const result = await db.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    const user = result.rows[0];

    // If user not found or password doesn't match, send an error response
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    } else {
      // Generate a JWT token if everything is ok
      const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET); // {expiresIn: '1h'}

      // Send the token in the response
      res.json({ accessToken: token });
    }

    // If everything is ok, send the user data in the response
    //res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// ------ Expenses ------------------------------------------------------------------------------------------------------
export const getUserExpenses = async (req, res) => {
  try {
    const user_id = req.user_id; // Get the user ID from the request
    console.log(req.user_id); // Log the user ID

    const result = await db.query(
      'SELECT * FROM expenses WHERE user_id = $1', // Query to fetch expenses for the user
      [user_id]
    );

    const expenses = result.rows; // Store the fetched expenses

    res.json(expenses); // Send the expenses in the response
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUserExpensesByYear = async (req, res) => {
  try {
    const user_id = req.user_id; // Get the user ID from the request
    const year = req.params.year; // Get the year from the request parameters

    const result = await db.query(
      `SELECT * FROM expenses WHERE user_id = $1 AND EXTRACT(YEAR FROM date) = $2`, // Query to fetch expenses for the user for a specific year
      [user_id, year]
    );

    const expenses = result.rows; // Store the fetched expenses

    // print the date
    console.log(expenses[0].date);

    res.json(expenses); // Send the expenses in the response
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUserExpensesByYearMonth = async (req, res) => {
  try {
    const user_id = req.user_id; // Get the user ID from the request
    const year = req.params.year; // Get the year from the request parameters
    const month = req.params.month; // Get the month from the request parameters

    const result = await db.query(
      `SELECT * FROM expenses WHERE user_id = $1 AND EXTRACT(YEAR FROM date) = $2 AND EXTRACT(MONTH FROM date) = $3`, // Query to fetch expenses for the user for a specific month
      [user_id, year, month]
    );

    const expenses = result.rows; // Store the fetched expenses

    res.json(expenses); // Send the expenses in the response
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUserExpensesByYearMonthId = async (req, res) => {
  try {
    const user_id = req.user_id; // Get the user ID from the request
    const year = req.params.year; // Get the year from the request parameters
    const month = req.params.month; // Get the month from the request parameters
    const id = req.params.id; // Get the id from the request parameters

    const result = await db.query(
      `SELECT * FROM expenses WHERE user_id = $1 AND EXTRACT(YEAR FROM date) = $2 AND EXTRACT(MONTH FROM date) = $3 AND id = $4`, // Query to fetch expenses for the user for a specific year, month, and id
      [user_id, year, month, id]
    );

    const expenses = result.rows; // Store the fetched expenses

    res.json(expenses); // Send the expenses in the response
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const addUserExpense = async (req, res) => {
  try {
    const { year, month } = req.params;
    const { user_id, description, category_id, total_cost } = req.body;

    // Convert year and month to a JavaScript Date object
    const date = new Date(year, month - 1);

    await db.query(
      'INSERT INTO expenses (user_id, date, description, category_id, total_cost) VALUES ($1, $2, $3, $4, $5)',
      [user_id, date, description, category_id, total_cost]
    );

    res.status(201).json({ message: 'Expense added successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding expense: ' + err });
  }
};

export const updateUserExpense = async (req, res) => {
  try {
    const { year, month, id } = req.params;
    const { description, total_cost, category_id } = req.body;

    const date = new Date(year, month - 1); // JavaScript months are 0-indexed
    const user_id = req.user_id; // Get the user ID from the request

    await db.query(
      `UPDATE expenses SET description = $1, total_cost = $2, category_id = $3, date = $4
      WHERE id = $5 AND user_id = $6 AND EXTRACT(YEAR FROM date) = $7 AND EXTRACT(MONTH FROM date) = $8`,
      [description, total_cost, category_id, date, id, user_id, year, month]
    );

    res.status(200).json({ message: 'Expense updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update expense.' });
  }
};

export const deleteUserExpense = async (req, res) => {
  try {
    const user_id = req.user_id; // Get the user ID from the request
    const { year, month, id } = req.params; // Get the year, month, and id from the request parameters

    // Query to delete the expense for the user for a specific year and month
    const result = await db.query(
      `DELETE FROM expenses WHERE user_id = $1 AND id = $2 AND EXTRACT(YEAR FROM date) = $3 AND EXTRACT(MONTH FROM date) = $4`,
      [user_id, id, year, month]
    );

    // If no rows were deleted, send an error response
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // If the expense was deleted successfully, send a success response
    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// ------ Balance -------------------------------------------------------------------------------------------------------
export const getUserBalance = async (req, res) => {
  try {
    const user_id = req.user_id; // Get the user ID from the request

    // Query to calculate the user's balance
    const query = `
      SELECT SUM(total_cost) AS balance
      FROM expenses
      WHERE user_id = $1
    `;

    const result = await db.query(query, [user_id]);
    const balance = result.rows[0].balance; // Get the balance from the query result

    res.json({ balance }); // Send the balance in the response
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUserBalanceWithId = async (req, res) => {
  try {
    const user_id = req.user_id; // Get the user ID from the request
    const other_user_id = req.params.userId; // Get the other user ID from the request parameters

    // Query to calculate the balance between the logged-in user and the other user
    const query = `
        SELECT 
            SUM(CASE WHEN es.user_id = ${loggedInUserId} THEN es.share ELSE -es.share END) as balance
        FROM 
            expense_shares es
        JOIN 
            expenses e ON es.expense_id = e.id
        WHERE 
            (es.user_id = ${loggedInUserId} OR es.user_id = ${otherUserId})
        AND 
            (e.user_id = ${loggedInUserId} OR e.user_id = ${otherUserId});
    `;

    const result = await db.query(query, [user_id, other_user_id]);
    const balance = result.rows[0].balance; // Get the balance from the query result

    res.json({ balance }); // Send the balance in the response
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// ------ Search --------------------------------------------------------------------------------------------------------
export const searchExpenses = async (req, res) => {
  try {
    const query = req.query.q; // Get the search query from the request

    // Query to search expenses based on the description containing the search query
    const searchQuery = `
      SELECT * FROM expenses
      WHERE description LIKE $1;
    `;

    const results = await db.query(searchQuery, [`%${query}%`]); // Execute the search query
    const expenses = results.rows; // Store the search results

    res.json(expenses); // Send the search results in the response
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q; // Get the search query from the request

    // Query to search users based on the username containing the search query
    const searchQuery = `
      SELECT * FROM users
      WHERE username LIKE $1;
    `;

    const results = await db.query(searchQuery, [`%${query}%`]); // Execute the search query
    const users = results.rows; // Store the search results

    res.json(users); // Send the search results in the response
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAuthUser = async (req, res) => {
  try {
    const user_id = req.user_id; // Get the user ID from the request

    console.log(user_id);

    const result = await db.query(
      'SELECT id, username, first_name, last_name, created_at FROM users WHERE id = $1', // Query to fetch user information
      [user_id]
    );

    const user = result.rows[0]; // Store the fetched user information
    console.log(user);

    res.json(user); // Send the user information in the response
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
