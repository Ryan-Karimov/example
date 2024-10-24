import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: '.env.local'
})

export const APP = {
    NAME: process.env.APP_NAME,
    PORT: process.env.APP_PORT,
    HOST: process.env.APP_HOST,
    SECRET_KEY: process.env.APP_SECRET_KEY,
}

export const DB = {
    PORT: process.env.DB_PORT,
    NAME: process.env.DB_NAME,
    HOST: process.env.DB_HOST,
    APP_NAME: process.env.DB_APP_NAME,
    USERNAME: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
}