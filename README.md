# Speser

You can manage family expenses, share costs with others, track financial balances and more.

## Getting Started

### Prerequisites

#### Database
Create a file `password.txt` under `db` folder with your password for the database. For example:

```bash
password
```

Copy the password to `DB_PASSWORD` in `compose.yml` file.

#### JWT
Generate a secret key for JWT. For example:

```bash
node
require('crypto').randomBytes(64).toString('hex')
```

Copy the secret key to `JWT_SECRET` in `compose.yml` file.

For the development you can use this key for enabling the test users: `f21f34146de71fa0eba5cbaacaaf1a5b87040d99e04f1dc037c1e08db24ac39d07bec65cccdb42d0875acf77fab9b5910c5e8c3cdc5d4a58ff5db91a2b24556a`


## Running the application

### Docker

```bash
docker compose up
```

Access the application at http://localhost:3000

### Express server only

Comment all the `// DEVELOPER` in the code to find the places where you need to make changes.
Uncomment all the `// PRODUCTION` in the code, then:

```bash
cd server
npm install
npm run build

# Move dist folder to server folder and rename it to public
mv dist server/public
npm run serve
```
Access the application at http://localhost:3000

### Via Vue + Express

In order to run the application in development mode, you need to run the following commands:

Uncomment all the `// DEVELOPER` in the code to find the places where you need to make changes.
Comment all the `// PRODUCTION` in the code, then:

```bash
npm run serve
npm run dev
```

Access the application at http://localhost:5173

## Test data

The project is configured to use a test database. 

If you used the JWT token above you can use the following credentials to log in:

```bash
username: mario
password: pass

username: luigi
password: pass

username: peach
password: pass
```