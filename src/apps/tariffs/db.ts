import { db } from "../../db";

export class TariffDB {
    static async getTariffs() {
        const query = `
            SELECT
                t.id,
                t.title,
                p.current_price::INT AS price,
                t.workspace_limit,
                t.workers_limit,
                t.moderators_limit,
                t.projects_limit,
                t.files_limit
            FROM admin.tariffs t
            JOIN admin.prices p ON t.price_id = p.id
            ORDER BY t.id;`;

        const result = await db.query(query);
        return result;
    }
}