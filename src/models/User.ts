export interface User {
    id?: number;
    first_name: string;
    last_name: string;
    birthday: Date;
    email: string;
    image_url?: string;
    gender?: number;
}