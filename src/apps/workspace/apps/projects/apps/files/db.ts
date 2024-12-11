import { db } from "../../../../../../db";
import { FileState } from "../../../../../../files/schema";

export class FIleDB {

    static async getFilesByProject(params: Array<string>): Promise<void> {
        const query = `
            SELECT
                *
            FROM
                dataset.files f
            WHERE
                f.project_id = $1
            ORDER BY
                f.id;`;

        const result = await db.query(query, params);
        return result;
    }

    static async mergeProjects(project_ids: string[]) {

        const ids = project_ids.map((id) => `${id}`).join(', ');

        const query = `
            WITH meta AS (
                SELECT
                    fm.file_id,
                    json_agg(
                        json_build_object(
                            'id', fm.id,
                            'class_id', fm.class_id,
                            'title', c.title,
                            'meta', fm.metadata,
                            'width', fm.width,
                            'height', fm.height
                        )
                    ) AS metadata
                FROM
                    dataset.file_metadata fm
                INNER JOIN
                    workspace.classes c ON c.id = fm.class_id
                WHERE c.project_id IN (${ids})
                GROUP BY fm.file_id
            )
                
            SELECT
                f.id,
                f.file_url,
                f.preview_url,
                f.project_id,
                f.file_type,
                f.filename,
                COALESCE(m.metadata, '[]'::json) AS metadata
            FROM 
                dataset.files f
            INNER JOIN 
                workspace.projects p ON p.id = f.project_id AND is_active
            LEFT JOIN 
                meta m ON m.file_id = f.id
            WHERE 
                f.state = '${FileState.DONE}' AND f.project_id IN (${ids})
            ;`;
        console.log(query);

        const result = await db.query(query);
        return result;
    }
}