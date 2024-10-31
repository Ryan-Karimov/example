export interface AppConfig {
    NAME: string;
    PORT: number;
    HOST: string;
    SECRET_KEY: string;
    JWT_SECRET_KEY: string;
}

export interface DatabaseConfig {
    PORT: number;
    NAME: string;
    HOST: string;
    APP_NAME: string;
    USERNAME: string;
    PASSWORD: string;
    MAX_POOL_COUNT: number;
    CONN_TIME_OUT: number;
}

export interface UploadConfig {
    FULL_PATH: string;
    MAIN_FOLDER: string;
    IMAGE_FOLDER_NAME_TO_SAVE: string;
    IMAGE_INCOMING_KEY: string;
    IMAGE_ALLOWED_TYPES: Array<string>
}