import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet'
import http from 'http';

import { APP } from './config'
import routes from './routes'

const app: Express = express();

app.use(cors())
app.use(helmet());
app.use(express.json({
    limit: '100MB'
}));
app.use('/', routes())

const server = http.createServer(app);

server.listen(APP.PORT, APP.HOST, () => {
    console.log('___________________________________________');
    console.log(`Server is running on http://${APP.HOST}:${APP.PORT}`);
    console.log('___________________________________________');
});

