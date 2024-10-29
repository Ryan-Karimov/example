import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import http from 'http';
import multer from 'multer';

import { catchError } from './helper'
import { GlobalErrorHandlerMiddleWare } from './middlewares/error'

import { APP } from './config'
import routes from './routes'

const app: Express = express();

app.use(cors({ origin: '*' }))
app.use(helmet());
app.use(multer({ dest: './static/profileImages' }).any());
app.use('/files', express.static(path.join(__dirname, 'static')));
app.use(express.json({
    limit: '100MB'
}));
app.use('/', routes())

const home = async (req: Request, res: Response) => {
    throw new Error('Kay')
}

app.get('/home', catchError(home))

app.use(GlobalErrorHandlerMiddleWare())


const server = http.createServer(app);

server.listen(APP.PORT, APP.HOST, () => {
    console.log('___________________________________________');
    console.log(`Server is running on http://${APP.HOST}:${APP.PORT}`);
    console.log('___________________________________________');
});
