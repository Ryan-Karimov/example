import { db } from "../../db";

export class WorkspaceDB {
    static async createWorkspace(params: Array<string>) {
        const query = `
            INSERT INTO workspace.workspaces (owner_id, title, avatar)
            VALUES ($1, $2, $3)
            RETURNING id;
        `;

        const result = await db.query(query, params);
        return result;
    }

    static async getWorkspacesByOwnerId(params: Array<string>) {
        const query = `
            SELECT id, title, avatar
            FROM workspace.workspaces
            WHERE owner_id = $1;
        `;

        const result = await db.query(query, params);
        return result;
    }
}