import { Document } from 'mongoose';

export class VendorsInterface extends Document{
    code: string;
    name: string;
    address: string;
    note: string;
}