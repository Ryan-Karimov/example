export interface User {
    id: number;
    first_name: string;
    last_name: string;
    birthday: Date;
    email: string;
    gender: number;
    image_url: string | undefined;
}

export class User implements User {
    id: number;
    first_name: string;
    last_name: string;
    birthday: Date;
    email: string;
    gender: number;
    image_url: string | undefined;

    constructor(
        id: number,
        first_name: string,
        last_name: string,
        birthday: Date,
        email: string,
        gender: number,
        image_url?: string,
    ) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.birthday = birthday;
        this.email = email;
        this.gender = gender;
        this.image_url = image_url;
    }
}


export const createUser = async () => {

}