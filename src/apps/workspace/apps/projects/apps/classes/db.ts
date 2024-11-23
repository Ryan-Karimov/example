import { db } from "../../../../../../db";

export class ClassDB {

    static async getClassesByProject(params: Array<string>): Promise<void> {
        const query = `
            SELECT
                *
            FROM 
                workspace.classes c
            WHERE
                c.project_id = $1
            ORDER BY
                c.id;`;

        const result = await db.query(query, params);
        return result;
    }

    static async createClass(params: Array<string>): Promise<void> {
        const query = `
            INSERT INTO workspace.classes (project_id, class_order, title, color)
            VALUES ($1, $2, $3, $4)
            RETURNING id, class_order, title, color;`;

        const result = await db.query(query, params);
        return result;
    }

    static async updateClass(params: Array<string>): Promise<void> {
        const query = `
            UPDATE
                workspace.classes
            SET
                class_order = COALESCE($3, class_order),
                title = COALESCE($4, title),
                color = COALESCE($5, color)
            WHERE
                id = $2
            AND
                project_id = $1;`;

        const result = await db.query(query, params);
        return result;
    }

    static async deleteClass(params: Array<string>): Promise<void> {
        const query = `
            DELETE FROM
                workspace.classes
            WHERE
                id = $2
            AND
                project_id = $1;`;

        const result = await db.query(query, params);
        return result;
    }

    static async getClassById(params: Array<string>): Promise<void> {
        const query = `
            SELECT
                *
            FROM 
                workspace.classes c
            WHERE
                c.project_id = $1
            AND
                c.id = $2
            ORDER BY
                c.id;`;

        const result = await db.query(query, params);
        return result;
    }
}