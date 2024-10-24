export interface AppConfig {
    NAME: string;
    PORT: number;
    HOST: string;
    SECRET_KEY: string;
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