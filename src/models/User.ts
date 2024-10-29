import db from "../db";
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

export class User implements IUser {
    id?: number;
    last_name: string;
    first_name: string;
    birthday: Date;
    email: string;
    image_url?: string;
    card_number?: string;
    gender?: number = 0;
    is_active?: boolean = true;

    constructor(user: Partial<IUser>) {
        this.id = user.id!;
        this.last_name = user.last_name!;
        this.first_name = user.first_name!;
        this.birthday = user.birthday!;
        this.email = user.email!;
        this.image_url = user.image_url;
        this.card_number = user.card_number;
        this.gender = user.gender;
        this.is_active = user.is_active;
    }

    static async createUser(user: Partial<IUser>, phone_number: string, password: string, tariff_id: number) {
        const { last_name, first_name, birthday, email, image_url, card_number, gender } = user;

        const existingUser = await db.db.query(`
            SELECT id FROM public.user_meta WHERE login = $1;
        `, [phone_number]);

        if (existingUser.length > 0) {
            throw new Error('User with this phone number already exists');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await db.db.transaction(async (client) => {
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

    static async findByLogin(login: string) {
        const result = await db.db.query(`
            SELECT 
                u.id,
                u.email,
                um.login,
                um.password
            FROM public.users u
            JOIN public.user_meta um ON u.id = um.user_id
            WHERE um.login = $1;
        `, [login]);

        return result;

    }
}
