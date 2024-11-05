import { db } from '../../../../db'

export class ProjectDB {
    static async getProjects(params: Array<any>): Promise<void> {
        const query = `
            SELECT
                id,
                title,
                current_price,
                type_id
            FROM
                workspace.projects
            WHERE
                project_id = $1
                AND is_active`

        const result = await db.query(query, params);
        return result;

    }

}