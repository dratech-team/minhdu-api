export class CreateProductsDto {
    readonly title: string;
    readonly content: string;
    readonly total_like: number;
    readonly created_date: Date;
}

export class FilterProductsDto {
    readonly skip: number;
    readonly limit: number;
}

export class UpdateProductsDto {
    readonly id: string;
    readonly title: string;
    readonly content: string;
    readonly total_like: number;
    readonly created_date: Date;
}