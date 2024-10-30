import { db } from '../../db';

export class AuthDB {
    static async findUserByLogin(params: Array<string>) {
        const query = `
            SELECT id, password
            FROM public.user_meta
            WHERE login = $1;`;
        const result = await db.query(query, params);
        return result;
    }

    static async findUserByEmail(params: Array<string>) {
        const query = `
            SELECT id
            FROM public.users
            WHERE email = $1;
        `;

        const result = await db.query(query, params);
        return result;
    }

    static async createUser(client, params: Array<string>) {
        const query = `
            INSERT INTO public.users (last_name, first_name, birthday, email, image_url, card_number, gender)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id;
        `;

        const result = await client.query(query, params);
        return result;
    };

    static async createUserMeta(client, params: Array<string>) {
        const query = `
            INSERT INTO public.user_meta (user_id, login, password)
            VALUES ($1, $2, $3);
        `;

        const result = await client.query(query, params);
        return result;
    }

    static async createTariffsController(client, params: Array<string>) {
        const query = `
            INSERT INTO admin.tariffs_controller (user_id, tariff_id, status)
            VALUES ($1, $2, $3);
        `;

        const result = await client.query(query, params);
        return result;
    }
}
