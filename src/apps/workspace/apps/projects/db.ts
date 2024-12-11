import { db } from '../../../../db'

export class ProjectDB {
    static async getProjects(params: Array<any>): Promise<any> {

        const values: any[] = [params[0], params[1], params[2]];
        let where = '';

        if (params[3] !== undefined) {
            where += ` pt.id = $4 AND `;
            values.push(params[3]);
        }

        const query = `
            SELECT
                p.id,
                p.title,
                p.current_price::INT,
                pt.title AS type,
                pt.image AS image
            FROM
                workspace.projects p
            JOIN
                admin.project_types pt ON p.type_id = pt.id
            WHERE
                ${where}
                workspace_id = $1
            AND 
                is_active
            ORDER BY p.id
            LIMIT $2 OFFSET $3;`;

        const result = await db.query(query, values);
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
                pt.id AS type_id,
                pt.title AS type,
                pt.image AS image
            FROM
                workspace.projects p
            JOIN
                admin.project_types pt ON p.type_id = pt.id
            WHERE
                p.workspace_id = $1
            AND
                p.id = $2;`;

        const result = await db.query(query, params);
        return result;
    }

    static async checkTitleExists(params: Array<string>): Promise<boolean> {
        const query = `
            SELECT COUNT(*) 
            FROM workspace.projects
            WHERE workspace_id = $1 AND LOWER(title) = LOWER($2)`;

        const result = await db.query(query, params);
        return parseInt(result[0].count) > 0;
    }

    static async checkTitleExistsForUpdate(params: Array<string>): Promise<boolean> {
        const query = `
            SELECT COUNT(*) 
            FROM workspace.projects
            WHERE workspace_id = $1
            AND LOWER(title) = LOWER($2)
            AND id != $3`;

        const result = await db.query(query, params);
        return parseInt(result[0].count) > 0;
    }

    static async getFilesCountByProject(params: Array<string>): Promise<void> {
        const query = `
            SELECT
                p.id AS project_id,
                p.title AS project_title,
                COALESCE(COUNT(f.id), 0)::INT AS total_count,
                COALESCE(COUNT(CASE WHEN f.id IS NOT NULL AND udi.id IS NULL THEN 1 END), 0)::INT AS queue_count,
                COALESCE(COUNT(CASE WHEN udi.draw_user_id IS NOT NULL AND udi.drawed_at IS NOT NULL AND udi.confirm_user_id IS NULL THEN 1 END), 0)::INT AS progress_count,
                COALESCE(COUNT(CASE WHEN udi.confirm_user_id IS NOT NULL AND udi.confirmed_at IS NOT NULL THEN 1 END), 0)::INT AS done_count
            FROM
                workspace.projects p
            LEFT JOIN
                dataset.files f ON p.id = f.project_id
            LEFT JOIN
                workspace.user_drawed_images udi ON f.id = udi.file_id
            WHERE
                p.workspace_id = $1 AND p.id = $2
            GROUP BY
                p.id, p.title
            ORDER BY
                project_id;`;

        const result = await db.query(query, params);
        return result;
    }

    static async getUsersNotInProject(params: Array<string>): Promise<void> {
        const query = `
            SELECT
                u.id,
                u.email
            FROM
                public.users u
            JOIN
                workspace.user_projects up ON up.user_id = u.id
            JOIN
                workspace.projects p ON p.id = up.project_id
            WHERE
                p.workspace_id = $1 AND up.project_id != $2
            AND
                u.is_active
            GROUP BY
                u.id
            ORDER BY
                u.id;`;

        const result = await db.query(query, params);
        return result;
    }

    static async getUserByProject(params: Array<string>) {
        const query = `
            SELECT
                u.id,
                u.last_name,
                u.first_name,
                u.email,
                u.image_url
            FROM
                public.users u
            JOIN
                workspace.user_projects up ON up.user_id = u.id
            JOIN
                workspace.projects p ON p.id = up.project_id
            WHERE
                p.workspace_id = $1 
            AND 
                up.project_id = $2 
            AND
                u.email = $3
            AND
                u.is_active
            GROUP BY
                u.id;`;

        const result = await db.query(query, params);
        return result;
    }

    static async addUsersToProject(params: Array<any>) {
        const query = `
            INSERT INTO workspace.user_projects (user_id, project_id, role_id)
            SELECT unnest($1::integer[]), $2, $3;`;

        const result = await db.query(query, params);
        return result;
    };

    static async getProjectWithTypeById(params: Array<string>): Promise<void> {
        const query = `
            SELECT
                p.id,
                p.title,
                p.current_price,
                pt.id AS type_id,
                pt.title AS type,
                pt.image AS image
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
