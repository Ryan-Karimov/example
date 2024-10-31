import { Pool, PoolClient } from 'pg'
import { DB } from '../config/index'

interface DatabaseOptions {
    username: string
    password: string
    port: number
    host: string
    db_name: string
    app_name: string
    max_pool_count: number
    conn_time_out: number
}

class Db {
    public static instance: Db;

    private pool: Pool;

    constructor(options: DatabaseOptions) {
        this.pool = new Pool({
            user: options.username,
            password: options.password,
            port: options.port,
            host: options.host,
            database: options.db_name,
            application_name: options.app_name,
            log: this.logging,
            max: options.max_pool_count,
            connectionTimeoutMillis: options.conn_time_out,
        });

        this.pool.on('connect', () => {
            console.log('User is connected to DB!');
        })

        this.pool.on('error', () => {
            console.log('Error on DB!');
        })

        this.pool.on('remove', () => {
            console.log('Removed pool from DB!');
        })

        this.pool
    }

    public logging(...messages: any[]): void {
        console.log(messages);
    }

    public static getInstance(): Db {
        if (!Db.instance) {
            const options: DatabaseOptions = {
                username: DB.USERNAME,
                password: DB.PASSWORD,
                port: DB.PORT,
                host: DB.HOST,
                db_name: DB.NAME,
                app_name: DB.APP_NAME,
                max_pool_count: DB.MAX_POOL_COUNT,
                conn_time_out: DB.CONN_TIME_OUT
            }
            Db.instance = new Db(options)
        }

        return Db.instance;
    }

    public getPool(): Pool {
        return this.pool;
    }

    async query(query: string, params?: any[]): Promise<any> {
        try {
            const results = await this.pool.query(
                query,
                params
            )
            return results.rows;
        } catch (error) {
            console.log('Error on query:', error);
            throw error;
        }
    }

    async transaction(callback: (client: PoolClient) => Promise<void>): Promise<void> {
        const client = await this.pool.connect();
        let isTransactionSuccessfully = false;

        try {
            await client.query('BEGIN');
            await callback(client);
            await client.query('COMMIT');
            isTransactionSuccessfully = true;
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error on transaction:', error);
            throw error;
        } finally {
            client.release();
            if (isTransactionSuccessfully) {
                console.log('Transaction committed successfully!');
            } else {
                console.log('Transaction was rolled back!');
            }
        }

        return

    }
}

export const db = Db.getInstance()
export const dbPool = db.getPool()

/*
// EXAMPLE TO USE TRANSACTION METHOD

const dbInstance = Db.getInstance();
try {
    await dbInstance.transaction(async (client) => {
        await client.query('SELECT $1', [1]);
        await client.query('SEELCT NOW()');
    });
} catch (error) {
}
*/