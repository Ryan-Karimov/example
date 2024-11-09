import { db } from '../../../../db'

export class ProjectDB {
    static async getProjects(params: Array<any>): Promise<void> {
        const query = `
            SELECT
                p.id,
                p.title,
                p.current_price,
                pt.title AS type
            FROM
                workspace.projects p
            JOIN
                admin.project_types pt ON p.type_id = pt.id
            WHERE
                workspace_id = $1
                AND is_active;`;

        const result = await db.query(query, params);
        return result;
    }

    static async createProject(params: Array<any>): Promise<void> {
        const query = `
            INSERT INTO workspace.projects (workspace_id, title, current_price, type_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id, title, current_price;`;

        const result = await db.query(query, params);
        return result;
    }

    static async updateProject(params: Array<any>): Promise<void> {
        const query = `
            UPDATE 
                workspace.projects
            SET
                title = COALESCE($3, title),
                current_price = COALESCE($4, current_price)
            WHERE
                workspace_id = $1
            AND
                id = $2;`;

        await db.query(query, params);
    }

    static async deleteProject(params: Array<any>): Promise<void> {
        const query = `
            UPDATE 
                workspace.projects
            SET
                is_active = false
            WHERE
                workspace_id = $1
            AND
                id = $2;`;

        await db.query(query, params);
    }

    static async getProjectById(params: Array<string>): Promise<void> {
        const query = `
            SELECT
                p.id,
                p.title,
                p.current_price,
                pt.title AS type
            FROM
                workspace.projects p
            JOIN
                admin.project_types pt ON p.type_id = pt.id
            WHERE
                p.id = $1;`;

        const result = await db.query(query, params);
        return result;
    }
}
