import { db } from "../../../../db";

export class ProjectTypesDB {
    static async getProjectTypes(): Promise<void> {
        const query = `
            SELECT
                id,
                title,
                image
            FROM admin.project_types;`;

        const result = await db.query(query)
        return result;
    }
}