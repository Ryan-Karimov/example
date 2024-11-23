import { db } from "../db";

export class FilesDB {
    static async createFile(params: Array<any>): Promise<void> {
        const query = `
            INSERT INTO dataset.files (project_id, filename, file_url, file_type)
            SELECT 
                $1,
                unnest($2::text[]) AS filename,
                unnest($3::text[]) AS file_url,
                unnest($4::dataset.files_file_type_enum[]) AS file_type;`;

        const result = await db.query(query, params);
        return result;
    }

    static async getFilesByProjectId(params: Array<any>): Promise<any> {
        const query = `
            SELECT
                f.id::INT,
                f.filename,
                f.file_url,
                f.file_type
            FROM
                dataset.files f
            LEFT JOIN workspace.user_drawed_images udi ON udi.file_id = f.id
            WHERE
                f.project_id = $1
                AND CASE 
                    WHEN $2 = 'QUEUE' THEN udi.id IS NULL
                    WHEN $2 = 'PROGRESS' THEN udi.id IS NOT NULL AND udi.confirmed_at IS NULL
                    WHEN $2 = 'DONE' THEN udi.id IS NOT NULL AND udi.confirmed_at IS NOT NULL
                END
            ORDER BY
                f.id
            LIMIT $3 OFFSET $4;`;

        console.log(query, params);
        const result = await db.query(query, params);
        return result;
    }

    static async getFileById(fileId: string): Promise<any> {
        const query = `
            SELECT
                f.id::INT,
                f.filename,
                f.file_url,
                f.file_type
            FROM
                dataset.files f
            WHERE
                f.id = $1;`;
        const result = await db.query(query, [fileId]);
        return result;
    }

    static async deleteFile(fileId: string): Promise<void> {
        const query = `
            DELETE FROM
                dataset.files
            WHERE
                id = $1;`;

        const result = await db.query(query, [fileId]);
        return result;
    }
}