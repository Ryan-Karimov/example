import { db } from "../../db"

export class UsersDB {
    static async getMe(params: Array<any>) {
        const query = `
            SELECT
                id,
                last_name,
                first_name,
                to_char(birthday, 'DD.MM.YYYY') as birthday,
                email,
                image_url,
                gender
            FROM
                public.users
            WHERE
                id = $1;`;

        const result = await db.query(query, params);
        return result;
    }
}