import { db } from "../db";

export class Tariffs {
    static async getAll(): Promise<Tariffs> {
        const query = await db.query(`
            SELECT 
                t.id,
                t.title,
                to_char(t.expired_date, 'DD.MM.YYYY HH24:MI:SS'),
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