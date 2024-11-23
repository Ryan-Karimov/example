import { db } from "../../../../../../db";

export class FIleDB {

    static async getFilesByProject(params: Array<string>): Promise<void> {
        const query = `
            SELECT
                *
            FROM
                dataset.files f
            WHERE
                f.project_id = $1
            ORDER BY
                f.id;`;

        const result = await db.query(query, params);
        return result;
    }
}