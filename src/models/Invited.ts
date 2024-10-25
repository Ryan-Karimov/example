
import { Pool } from 'pg'

export interface Invited {
    id: number;
    email: string;
    confirm_code: number;
}

export class Invited implements Invited {
    public id: number;
    public email: string;
    public confirm_code: number;

    constructor(id: number, email: string, confirm_code: number) {
        this.id = id;
        this.email = email;
        this.confirm_code = confirm_code;
    }
}

export const createInvited = async (pool: Pool) => {

}

export const getInvitedByID = async () => {

}
