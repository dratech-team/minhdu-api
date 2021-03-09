import { Document } from 'mongoose';

export class UsersInterface extends Document{
    name: string;
    phone: string;
    salt: string;
    hash: string;
    password: string;
    email: string;
    status: string;
    roles: Array<string>;
    facebookId: string;
    googleId: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword: any
}