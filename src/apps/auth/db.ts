import { db } from '../../db'

export class AuthDB {
    static async findUserByLogin(params: Array<string>) {
        const query = `
            SELECT id
            FROM public.user_meta
            WHERE login = $1;`;
        const result = await db.query(query, params);
        return result;
    }
}
