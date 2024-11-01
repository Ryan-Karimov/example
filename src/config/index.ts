import dotenv from 'dotenv';
import { getEnvParam, getEnvAsNumber } from './helper'
import { AppConfig, DatabaseConfig, UploadConfig } from './interfaces'
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

export const UPLOAD: UploadConfig = {
    FULL_PATH: getEnvParam('FULL_PATH', process.cwd()),
    MAIN_FOLDER: path.join(
        getEnvParam('FULL_PATH', process.cwd()),
        getEnvParam('MAIN_FOLDER', 'uploads')),
    IMAGE_FOLDER_NAME_TO_SAVE: path.join(
        getEnvParam('FULL_PATH', process.cwd()),
        getEnvParam('MAIN_FOLDER', 'uploads'),
        getEnvParam('IMAGE_FOLDER_NAME_TO_SAVE', 'images')),
    IMAGE_INCOMING_KEY: getEnvParam('IMAGE_INCOMING_KEY', 'image'),
    IMAGE_ALLOWED_TYPES: getEnvParam('IMAGE_ALLOWED_TYPES', 'jpeg, png, gif, bmp, tiff, svg+xml')
        .split(',')
        .map((imageType: string) => `image/${imageType.trim()}`),
}