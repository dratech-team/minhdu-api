import { Document, ObjectId } from 'mongoose';

export class AreasInterface extends Document{
    name: string;
    code: string;
    status: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: ObjectId;
    updatedBy: ObjectId;
}