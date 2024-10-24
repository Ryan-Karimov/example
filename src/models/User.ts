export interface User {
    id?: number;
    first_name: string;
    last_name: string;
    birthday: Date;
    email: string;
    image_url?: string;
    gender?: number;
}

export class UserModel implements User {
    constructor(
        public id: number,
        public first_name: string,
        public last_name: string,
        public birthday: Date,
        public password: string,
        public email: string,
        public createdAt: Date,
        public updatedAt: Date
    ) { }

    checkPassword(password: string): boolean {
        return this.password === password;
    }
}