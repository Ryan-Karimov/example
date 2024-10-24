import express, { Request, Response } from 'express';
import { APP } from './src/config/index'


const app = express();

app.use(express.json());

// Test route
app.get('/', (_req: Request, res: Response) => {
    res.send('Hello, EXPRESS!');
});

// Connect to PostgreSQL and test connection
app.get('/test-db', async (_req: Request, res: Response) => {
    try {
        res.json({ msg: "Hello world!" });
    } catch (err) {
        console.error('Error connecting to the database', err);
        res.status(500).send('Database connection error');
    }
});

const port = +APP.PORT! || 8000
const host = APP.HOST! || 'localhost'

app.listen(port, host, () => {
    console.log('___________________________________________');
    console.log(`Server is running on http://${host}:${port}`);
    console.log('___________________________________________');
});

