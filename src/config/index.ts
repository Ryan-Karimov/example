import dotenv from 'dotenv';
import { getEnvParam, getEnvAsNumber } from './helper'
import { AppConfig, DatabaseConfig } from './interfaces'

dotenv.config({
    path: '.env.local'
})

export const APP: AppConfig = {
    NAME: getEnvParam('APP_NAME', 'DefaultApplication'),
    PORT: getEnvAsNumber('APP_PORT', 3000),
    HOST: getEnvParam('APP_HOST', 'localhost'),
    SECRET_KEY: getEnvParam('APP_SECRET_KEY', 'DefaultSecretKey'),
}

export const DB: DatabaseConfig = {
    NAME: getEnvParam('DB_NAME', 'DefaultDbTableName'),
    HOST: getEnvParam('DB_HOST', 'localhost'),
    PORT: getEnvAsNumber('DB_PORT', 5432),
    APP_NAME: getEnvParam('DB_APP_NAME', 'DefaultDbApplication'),
    USERNAME: getEnvParam('DB_USERNAME', 'postgres'),
    PASSWORD: getEnvParam('DB_PASSWORD', 'postgres'),
    MAX_POOL_COUNT: getEnvAsNumber('DB_MAX_POOL_COUNT', 10),
    CONN_TIME_OUT: getEnvAsNumber('CONN_TIME_OUT', 10)
}