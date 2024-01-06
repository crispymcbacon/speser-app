import path from 'path';
import express from 'express';
import router from './routes.js';
import cors from 'cors'; // IMPORTANT: DELETE THIS IN PRODUCTION

const __dirname = new URL(path.join(import.meta.url, '..')).pathname; // current directory

// Create the server
const app = express();

app.use(cors()); // IMPORTANT: DELETE THIS IN PRODUCTION

app.use(express.static(`${__dirname}/public`)); // Serve static files from the public directory
app.use(express.json()); // Parse JSON bodies

app.use('/api', router); // Handle api routes


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});