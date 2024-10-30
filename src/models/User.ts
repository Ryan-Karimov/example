import { db } from "../db";
import bcrypt from 'bcrypt';

interface IUser {
    id?: number;
    last_name: string;
    first_name: string;
    birthday: Date;
    email: string;
    image_url?: string;
    card_number?: string;
    is_active?: boolean;
    gender?: number;
    created_at?: Date;
}

export class User {
    static async createUser(user: Partial<IUser>, phone_number: string, password: string, tariff_id: number) {
        const { last_name, first_name, birthday, email, image_url, card_number, gender } = user;

        const existingUser = await db.query(`
            SELECT id FROM public.user_meta WHERE login = $1;
        `, [phone_number]);

        if (existingUser.length > 0) {
            throw new Error('A user with the same phone number already exists!');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await db.transaction(async (client) => {
            const result = await client.query(`
                INSERT INTO public.users (last_name, first_name, birthday, email, image_url, card_number, gender) 
                VALUES ($1, $2, $3, $4, $5, $6, $7) 
                RETURNING id;
            `, [last_name, first_name, birthday, email, image_url, card_number, gender]);

            const newUserId = result.rows[0].id;

            await client.query(`
                INSERT INTO public.user_meta (user_id, login, password)
                VALUES ($1, $2, $3);
            `, [newUserId, phone_number, hashedPassword]);

            await client.query(`
                INSERT INTO admin.tariffs_controller (user_id, tariff_id, status)
                VALUES ($1, $2, $3);
            `, [newUserId, tariff_id, true])
        });
    }

    static async uploadImage() {
    }

    static async findByEmail(params: string): Promise<any> {
        const query = 'SELECT id FROM public.users WHERE email = $1;'
        const result = await db.db.query(query, [params])
        return result;
    }

    static async findUserByEmailAddress(params: Array<string>): Promise<any> {
        const query = `
            SELECT id
            FROM public.users
            WHERE email = $1`
        const result = await db.query(query, params)
        return result;
    }

    static async findUserByPhoneNumber(params: Array<string>): Promise<any> {
        const query = `
            SELECT id
            FROM public.user_meta
            WHERE login = $1`
        const result = await db.query(query, params)
        return result;
    }

    static async findUserByLogin(login: string) {
        const result = await db.query(`
            SELECT 
                u.id,
                u.email,
                um.login,
                um.password
            FROM public.users u
            JOIN public.user_meta um ON u.id = um.user_id
            WHERE um.login = $1;
        `, params);

        return result;
    }
}
