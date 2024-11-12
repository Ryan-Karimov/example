import { db } from "../../../../db";

export class UsersByWorkspaceDB {
    static async getUsersByWorkspace(params: Array<any>) {
        const query = `
            SELECT
                u.id,
                u.last_name,
                u.first_name,
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
                u.is_active
            GROUP BY
                u.id, u.last_name, u.first_name, u.image_url;`;

        const result = await db.query(query, params);
        return result;
    };

    static async addUserToWorkspace(params: Array<any>) {
        const query = `
            INSERT INTO workspace.user_projects (user_id, project_id, role_id)
            SELECT $1, unnest($2::integer[]), $3;`;

        const result = await db.query(query, params);
        return result;
    };
}