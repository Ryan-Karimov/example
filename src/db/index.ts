import { Pool, PoolClient } from 'pg'
import { DB } from '../config/index'
import { QueryBuilder } from './query-builder'

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

        // this.pool.on('connect', () => {
        //     console.log('User is connected to DB!');
        // })

        // this.pool.on('error', () => {
        //     console.log('Error on DB!');
        // })

        // this.pool.on('remove', () => {
        //     console.log('Removed pool from DB!');
        // })

        this.pool
    }

    private logging(...messages: any[]): void {
        // console.log(messages);
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

    async insert(table: string, data: Record<string, any>, client?: PoolClient): Promise<any> {
        const { query, params } = QueryBuilder.buildInsert(table, data);
        const executor = client || this.pool;
        const result = await executor.query(query, params);
        return result.rows[0];
    }

    async fetch(table: string, filters: Record<string, any>, client?: PoolClient): Promise<any[]> {
        const { query, params } = QueryBuilder.buildSelect(table, filters);
        const executor = client || this.pool;
        const result = await executor.query(query, params);
        return result.rows;
    }

    async update(table: string, data: Record<string, any>, filters: Record<string, any>, client?: PoolClient): Promise<any> {
        const { query, params } = QueryBuilder.buildUpdate(table, data, filters);
        const executor = client || this.pool;
        const result = await executor.query(query, params);
        return result.rowCount;
    }

    async delete(table: string, filters: Record<string, any>, client?: PoolClient): Promise<any> {
        const { query, params } = QueryBuilder.buildDelete(table, filters);
        const executor = client || this.pool;
        const result = await executor.query(query, params);
        return result.rowCount;
    }

    async insertMany(table: string, dataArray: Record<string, any>[], client?: PoolClient): Promise<any[]> {
        if (dataArray.length === 0) {
            return [];
        }

        const { query, params } = QueryBuilder.buildInsertMany(table, dataArray);
        const executor = client || this.pool;
        const result = await executor.query(query, params);
        return result.rows;
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

/** 
@Получение данных
const projects = await db.fetch('workspace.projects', { workspace_id: '123', status: 'active' });

@Вставка данных
const newProject = await db.insert('workspace.projects', {
    title: 'New Project',
    current_price: 500,
});

@Обновление данных
const updatedProject = await db.update(
    'workspace.projects',
    { title: 'Updated Project', current_price: 600 },
    { id: '123' }
);

@Удаление данных
const deletedProject = await db.delete('workspace.projects', { id: '123' });
*/