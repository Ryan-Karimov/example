import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet'
import http from 'http';

import { APP } from './src/config/index'

const app: Express = express();

app.use(cors())
app.use(helmet());
app.use(express.json({
    limit: '1MB'
}));

// Test route
app.get('/', async (_req: Request, res: Response) => {
    res.send('Hello, EXPRESS!');
});

app.get('/test-db', async (_req: Request, res: Response) => {
    try {
        res.json({ msg: "Hello world!" });
    } catch (err) {
        console.error('Error connecting to the database', err);
        res.status(500).send('Database connection error');
    }
});


const server = http.createServer(app);
const port = +APP.PORT! || 8000
const host = APP.HOST! || 'localhost'

server.listen(port, host, () => {
    console.log('___________________________________________');
    console.log(`Server is running on http://${host}:${port}`);
    console.log('___________________________________________');
});

