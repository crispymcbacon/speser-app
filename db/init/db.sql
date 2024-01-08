--- Create tables for managing users, expense categories, expenses, and expense shares, along with indexes for faster searches on commonly searched columns

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the 'categories' table to store expense categories
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the 'expenses' table to store information about expenses
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    description VARCHAR(255) NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    total_cost DECIMAL(10, 2) NOT NULL CHECK (total_cost >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the 'expense_shares' table to manage how expenses are shared between users
CREATE TABLE expense_shares (
    id SERIAL PRIMARY KEY,
    expense_id INTEGER REFERENCES expenses(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    share DECIMAL(10, 2) NOT NULL, -- CHECK (share >= 0)
    UNIQUE(expense_id, user_id) -- Ensure each user has only one share per expense
);

-- Indexes for faster searches on commonly searched columns
CREATE INDEX idx_expense_date ON expenses(date);
CREATE INDEX idx_expense_user_id ON expenses(user_id);
CREATE INDEX idx_expense_category_id ON expenses(category_id);
CREATE INDEX idx_expense_shares_expense_id ON expense_shares(expense_id);
CREATE INDEX idx_expense_shares_user_id ON expense_shares(user_id);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_categories_name ON categories(name);

-- TEST DATA

-- Insert into categories
INSERT INTO categories (id, name, created_at)
VALUES (1, 'Refund', CURRENT_TIMESTAMP);

INSERT INTO categories (id, name, created_at) VALUES 
(2, 'Groceries', CURRENT_TIMESTAMP),
(3, 'Rent', CURRENT_TIMESTAMP),
(4, 'Utilities', CURRENT_TIMESTAMP),
(5, 'Home', CURRENT_TIMESTAMP),
(6, 'Travel', CURRENT_TIMESTAMP),
(7, 'Other', CURRENT_TIMESTAMP);

-- Insert into users
INSERT INTO users (username, first_name, last_name, password_hash) VALUES 
('user', 'John', 'Doe', '$2a$10$oCkHYiUl3JU6IDfilaYbz.hLwufvLA0YNL/IK6IpTqYgKIhfn0AKC'),
('mario', 'Mario', 'Rossi', '$2a$10$oCkHYiUl3JU6IDfilaYbz.hLwufvLA0YNL/IK6IpTqYgKIhfn0AKC'),
('luigi', 'Luigi', 'Verdi', '$2a$10$oCkHYiUl3JU6IDfilaYbz.hLwufvLA0YNL/IK6IpTqYgKIhfn0AKC'),
('peach', 'Peach', 'Peach', '$2a$10$oCkHYiUl3JU6IDfilaYbz.hLwufvLA0YNL/IK6IpTqYgKIhfn0AKC'),
('bowser', 'Bowser', 'Bowser', '$2a$10$oCkHYiUl3JU6IDfilaYbz.hLwufvLA0YNL/IK6IpTqYgKIhfn0AKC');

-- Insert into expenses, expense_shares
INSERT INTO expenses (user_id, date, description, category_id, total_cost) VALUES (2, '2023-12-31T23:00:00.000Z', 'Bacon', 2, 30);
INSERT INTO expense_shares (expense_id, user_id, share) VALUES (1, 2, '10.00');
INSERT INTO expense_shares (expense_id, user_id, share) VALUES (1, 3, '10.00');
INSERT INTO expense_shares (expense_id, user_id, share) VALUES (1, 4, '10.00');

INSERT INTO expenses (user_id, date, description, category_id, total_cost) VALUES (2, '2023-12-31T23:00:00.000Z', 'Netflix', 5, 10);
INSERT INTO expense_shares (expense_id, user_id, share) VALUES (2, 2, '5.00');
INSERT INTO expense_shares (expense_id, user_id, share) VALUES (2, 3, '5.00');

INSERT INTO expenses (user_id, date, description, category_id, total_cost) VALUES (4, '2023-12-31T23:00:00.000Z', 'Refund to Bacon', 1, 0);
INSERT INTO expense_shares (expense_id, user_id, share) VALUES (3, 4, '-10.00');
INSERT INTO expense_shares (expense_id, user_id, share) VALUES (3, 2, -10);

INSERT INTO expenses (user_id, date, description, category_id, total_cost) VALUES (4, '2023-12-31T23:00:00.000Z', 'Train tickets', 6, 45);
INSERT INTO expense_shares (expense_id, user_id, share) VALUES (4, 4, '15.00');
INSERT INTO expense_shares (expense_id, user_id, share) VALUES (4, 2, '15.00');
INSERT INTO expense_shares (expense_id, user_id, share) VALUES (4, 3, '15.00');

INSERT INTO expenses (user_id, date, description, category_id, total_cost) VALUES (2, '2023-12-31T23:00:00.000Z', 'Refund to Train Tickets', 1, 0);
INSERT INTO expense_shares (expense_id, user_id, share) VALUES (5, 2, '-15.00');
INSERT INTO expense_shares (expense_id, user_id, share) VALUES (5, 4, -15);

INSERT INTO expenses (user_id, date, description, category_id, total_cost) VALUES (3, '2023-12-31T23:00:00.000Z', 'Xbox subscription 3 months', 5, 60);
INSERT INTO expense_shares (expense_id, user_id, share) VALUES (6, 3, '20.00');
INSERT INTO expense_shares (expense_id, user_id, share) VALUES (6, 2, '20.00');
INSERT INTO expense_shares (expense_id, user_id, share) VALUES (6, 4, '20.00');