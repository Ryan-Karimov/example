import dotenv from 'dotenv';
import { getEnvParam, getEnvAsNumber } from './helper'
import { AppConfig, DatabaseConfig, StaticConfig } from './interfaces'
import path from 'path'

dotenv.config({
    path: '.env.local'
})

export const APP: AppConfig = {
    NAME: getEnvParam('APP_NAME', 'DefaultApplication'),
    PORT: getEnvAsNumber('APP_PORT', 3000),
    HOST: getEnvParam('APP_HOST', 'localhost'),
    SECRET_KEY: getEnvParam('APP_SECRET_KEY', 'DefaultSecretKey'),
    JWT_SECRET_KEY: getEnvParam('JWT_SECRET_KEY', 'DefaultJWTSecretKey'),
}

export const DB: DatabaseConfig = {
    NAME: getEnvParam('DB_NAME', 'DefaultDbTableName'),
    HOST: getEnvParam('DB_HOST', 'localhost'),
    PORT: getEnvAsNumber('DB_PORT', 5432),
    APP_NAME: getEnvParam('DB_APP_NAME', 'DefaultDbApplication'),
    USERNAME: getEnvParam('DB_USERNAME', 'postgres'),
    PASSWORD: getEnvParam('DB_PASSWORD', 'postgres'),
    MAX_POOL_COUNT: getEnvAsNumber('DB_MAX_POOL_COUNT', 10),
    CONN_TIME_OUT: getEnvAsNumber('CONN_TIME_OUT', 1000)
}

export const STATIC: StaticConfig = {
    FULL_PATH: getEnvParam('FULL_PATH', process.cwd()),
    MAIN_FOLDER: path.join(getEnvParam('FULL_PATH', process.cwd()), getEnvParam('MAIN_FOLDER', 'static')),
    IMAGES: path.join(getEnvParam('FULL_PATH', process.cwd()), getEnvParam('MAIN_FOLDER', 'static'), getEnvParam('IMAGES', 'images')),
    IMAGE_ALLOWED_TYPES: getEnvParam('IMAGE_ALLOWED_TYPES', 'jpeg, png, gif, bmp, tiff, svg+xml')
        .split(',')
        .map((imageType: string) => `image/${imageType.trim()}`),
}