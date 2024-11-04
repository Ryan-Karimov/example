import { db } from "../../db";

export class WorkspaceDB {
    static async createWorkspace(params: Array<string>) {
        const query = `
            INSERT INTO workspace.workspaces (owner_id, title, avatar)
            VALUES ($1, $2, $3)
            RETURNING id;`;

        const result = await db.query(query, params);
        return result;
    }

    static async getWorkspacesByOwnerId(params: Array<string>) {
        const query = `
            SELECT
                id, title, avatar
            FROM
                workspace.workspaces
            WHERE
                owner_id = $1
                AND is_active;`;

        const result = await db.query(query, params);
        return result;
    }

    static async updateWorkspaceById(params: Array<string>) {
        const query = `
            UPDATE
                workspace.workspaces
            SET
                title = COALESCE($2, title),
                avatar = COALESCE($3, avatar)
            WHERE
                id = $1
            RETURNING
                id, title, avatar;`;

        const result = await db.query(query, params);
        return result;
    }

    static async deleteWorkspaceById(params: Array<string>) {
        const query = `
            UPDATE
                workspace.workspaces
            SET
                is_active = false
            WHERE
                id = $1;`;

        const result = await db.query(query, params);
        return result;
    }


}