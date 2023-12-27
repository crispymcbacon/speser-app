// TODO existing username check
export async function validateRegistrationInput(username, firstName, lastName, password) {
  const errors = []

  if (!username) {
    errors.push({ status: 'error', message: 'Username is required', field: 'username' })
  }
  if (!firstName) {
    errors.push({ status: 'error', message: 'First name is required', field: 'firstName' })
  }
  if (!lastName) {
    errors.push({ status: 'error', message: 'Last name is required', field: 'lastName' })
  }
  if (!password) {
    errors.push({ status: 'error', message: 'Password is required', field: 'password' })
  }
  if (!username || !firstName || !lastName || !password) {
    errors.push({ status: 'error', message: 'All fields are required', field: 'general' })
  }

  if (username.length < 3 || username.length > 15) {
    errors.push({
      status: 'error',
      message: 'Username must be between 3 and 15 characters',
      field: 'username'
    })
  }

  const usernameRegex = /^[a-zA-Z0-9_]+$/
  if (!usernameRegex.test(username)) {
    errors.push({
      status: 'error',
      message: 'Username can only contain alphanumeric characters and underscores',
      field: 'username'
    })
  }

  if (password.length < 8) {
    errors.push({
      status: 'error',
      message: 'Password must be at least 8 characters long',
      field: 'password'
    })
  }

  const passwordLowercaseRegex = /[a-z]/
  if (!passwordLowercaseRegex.test(password)) {
    errors.push({
      status: 'error',
      message: 'Password must contain at least one lowercase letter',
      field: 'password'
    })
  }

  const passwordUppercaseRegex = /[A-Z]/
  if (!passwordUppercaseRegex.test(password)) {
    errors.push({
      status: 'error',
      message: 'Password must contain at least one uppercase letter',
      field: 'password'
    })
  }

  const passwordNumberRegex = /[0-9]/
  if (!passwordNumberRegex.test(password)) {
    errors.push({
      status: 'error',
      message: 'Password must contain at least one number',
      field: 'password'
    })
  }

  return {
    status: errors.length > 0 ? 'error' : 'validated',
    message: 'All fields are validated',
    errors
  }
}

export async function validateExpenseInput(date, category_id, total_cost, description) {
    const errors = []
  
    if (!date) {
      errors.push({ status: 'error', message: 'Date is required', field: 'date' })
    } else {
      const inputDate = new Date(date);
      const currentDate = new Date();
      if (inputDate > currentDate) {
        errors.push({ status: 'error', message: 'Date cannot be in the future', field: 'date' })
      }
    }
    if (!category_id) {
      errors.push({ status: 'error', message: 'Category ID is required', field: 'category_id' })
    }
    if (!total_cost) {
      errors.push({ status: 'error', message: 'Total Cost is required', field: 'total_cost' })
    }
    if (!description) {
      errors.push({ status: 'error', message: 'Description is required', field: 'description' })
    }
  
    return {
      status: errors.length > 0 ? 'error' : 'validated',
      message: 'All fields are validated',
      errors
    }
  }
