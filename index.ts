import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL client setup
const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

app.use(express.json());

// Test route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, EXPRESS!');
});

// Connect to PostgreSQL and test connection
app.get('/test-db', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error connecting to the database', err);
        res.status(500).send('Database connection error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
