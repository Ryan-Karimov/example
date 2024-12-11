import { db } from "../../../db";

export class MetaDB {
    static async getMetadataByFileId(fileId: string, project_id: string) {
        const query = `
            SELECT
                f.id,
                f.project_id,
                f.filename,
                f.file_url,
                f.file_type,
                f.state,
                json_agg(
                    json_build_object(
                        'id', fm.id,
                        'class_id', c.id,
                        'class_order', c.class_order,
                        'class_title', c.title,
                        'name', fm.id,
                        'metadata', fm.metadata
                    )
                ) AS file_info
            FROM
                dataset.files f
            LEFT JOIN
                dataset.file_metadata fm ON f.id = fm.file_id
            LEFT JOIN
                workspace.classes c ON c.id = fm.class_id
            WHERE
                f.id = $1
            AND
                f.project_id = $2
            GROUP BY f.id;`;

        const result = await db.query(query, [fileId, project_id]);
        return result;
    }

    static async hardDelete(filter: { file_id: { $in: string[] } }) {
        const fileIds = filter.file_id.$in;

        if (!fileIds || fileIds.length === 0) {
            throw new Error('No file IDs provided for deletion.');
        }

        const placeholders = fileIds.map((_, i) => `$${i + 1}`).join(', ');
        const query = `
            DELETE FROM
                dataset.file_metadata
            WHERE
                file_id IN (${placeholders});`;

        const result = await db.query(query, fileIds);
        return result;
    }

    static async createMany(metadataArray: Array<{ file_id: string; metadata: string; width: number; height: number }>) {
        if (!metadataArray || metadataArray.length === 0) {
            throw new Error('No metadata provided for insertion.');
        }

        const columns = Object.keys(metadataArray[0]);
        const values = metadataArray.map(Object.values);

        const placeholders = values
            .map((_, i) => `(${columns.map((_, j) => `$${i * columns.length + j + 1}`).join(', ')})`)
            .join(', ');

        const query = `
            INSERT INTO dataset.file_metadata (${columns.join(', ')})
            VALUES ${placeholders};`;

        const flattenedValues = values.flat();

        const result = await db.query(query, flattenedValues);
        return result;
    }
}