import { db } from "../db";
import { FileState } from "./schema";

export enum MEDIA_TYPE {
    VIDEO = 'VIDEO',
    IMAGE = 'IMAGE',
    TEXT = 'TEXT'
}

export class FilesDB {
    static async createFile(params: Array<any>): Promise<void> {
        const query = `
            INSERT INTO dataset.files (project_id, filename, file_url, file_type, state, preview_url)
            SELECT 
                $1,
                unnest($2::text[]) AS filename,
                unnest($3::text[]) AS file_url,
                unnest($4::dataset.files_file_type_enum[]) AS file_type,
                unnest($5::dataset.file_state[]) AS state,
                unnest($6::text[]) AS preview_url;`;

        const result = await db.query(query, params);
        return result;
    }

    static async getFilesByProjectId(params: Array<any>): Promise<any> {
        const [projectId, state, limit, page] = params;
        const offset = (page - 1) * limit;

        const query = `
            SELECT
                f.id::INT,
                f.filename,
                f.file_url,
                f.file_type,
                f.preview_url
            FROM
                dataset.files f
            WHERE
                f.project_id = $1
            AND
                f.state = $2
            ORDER BY
                f.id
            LIMIT $3 OFFSET $4;`;

        const result = await db.query(query, [projectId, state, limit, offset]);
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

    static async getFilesCountByProjectId(params: Array<any>): Promise<any> {
        const query = `
            SELECT 
                COUNT(*)::INT
            FROM
                dataset.files
            WHERE
                project_id = $1
            AND
                state = $2;`;
        const result = await db.query(query, params);
        return result[0].count;
    }

    static async getByFilename(projectId: string, filename: string, type: MEDIA_TYPE) {
        const values = [projectId, `${filename}%`]
        const query = `
            SELECT 
                f.id,
                f.filename,
                f.file_url,
                f.file_type
            FROM dataset.files f
            WHERE f.project_id = $1 AND f.filename LIKE $2 AND f.file_type = '${type}';`;

        const result = await db.query(query, values);
        return result;
    }

    static async getFilesTypeByProjectId(projectId: string) {

        const query = `
            SELECT DISTINCT 
                file_type 
            FROM 
                dataset.files 
            WHERE 
                project_id = $1;`;

        const result = await db.query(query, [projectId]);
        return result;
    }

    static async updateFileById(fileId: string, state: FileState) {
        const query = `
            UPDATE
                dataset.files
            SET
                state = $2
            WHERE
                id = $1;`;

        const result = await db.query(query, [fileId, state]);
        return result;
    }
}