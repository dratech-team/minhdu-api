import { Document } from 'mongoose';

export class ProductsInterface extends Document{
    readonly title: string;
    readonly content: string;
    readonly number_like: string;
    readonly created_at: Date;
}

export class FilterProductsDto extends Document{
    readonly title: string;
    readonly content: string;
    readonly number_like: string;
    readonly created_at: Date;
}