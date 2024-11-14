import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';

import routes from './routes'
import {
    GlobalNotFoundHandlerMiddleWare,
    GlobalErrorHandlerMiddleWare
} from './middlewares'

const app: Express = express();

// _______________________________________________________________
/**
 * @CORS
 * @Helmet
 * @JsonParser
 * @Registration_Middlewares
*/
app.use(cors({ origin: '*' }));
app.use(helmet());
app.use('/static', express.static(path.join(__dirname, '..', 'static')));
app.use(express.json({
    limit: '100MB'
}));
// _______________________________________________________________

// _______________________________________________________________
/**
 * @Registration_Routes
*/
app.use(routes())
// _______________________________________________________________

// _______________________________________________________________
/**
 * @GlobalErrorHandlerMiddleWare REGISTRATION GLOBAL ERROR HANDLER
*/
app.use(GlobalNotFoundHandlerMiddleWare())
app.use(GlobalErrorHandlerMiddleWare())
// _______________________________________________________________

/* EXPORT APPLICATION */
export default app;