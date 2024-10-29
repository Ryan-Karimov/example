import db from "../db";

interface ITariffs {
    id?: number;
    title: string;
    expired_date: Date;
    price_id: number;
    workspace_limit: number;
    workers_limit: number;
    moderators_limit: number;
    projects_limit: number;
    files_limit: number;
}

export class Tariffs implements ITariffs {
    id?: number;
    title: string;
    expired_date: Date;
    price_id: number;
    workspace_limit: number;
    workers_limit: number;
    moderators_limit: number;
    projects_limit: number;
    files_limit: number;

    constructor(tariffs: Partial<Tariffs>) {
        this.id = tariffs.id;
        this.title = tariffs.title!;
        this.expired_date = tariffs.expired_date!;
        this.price_id = tariffs.price_id!;
        this.workspace_limit = tariffs.workspace_limit!;
        this.workers_limit = tariffs.workers_limit!;
        this.moderators_limit = tariffs.moderators_limit!;
        this.projects_limit = tariffs.projects_limit!;
        this.files_limit = tariffs.files_limit!;
    }

    static async getAll(): Promise<Tariffs> {
        const query = await db.db.query(`
            SELECT 
                t.id,
                t.title,
                to_char(t.expired_date, 'DD-MM-YYYY'),
                p.current_price::INT AS price,
                t.workspace_limit,
                t.workers_limit,
                t.moderators_limit,
                t.projects_limit,
                t.files_limit
            FROM admin.tariffs t
            JOIN admin.prices p ON p.id = t.price_id
            ORDER BY t.id ASC;`);

        return query;
    }
}