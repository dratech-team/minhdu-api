import { Schema } from 'mongoose';

export const ProductsSchema = new Schema({
    title: String,
    content: String,
    total_like: Number,
    created_date: Date,
});