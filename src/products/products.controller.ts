import { Controller, Get, Post, Put, Delete, Res, Req, Param, HttpStatus, Body, Query } from '@nestjs/common';
import { Response, Request } from 'express';
import { CreateProductsDto, FilterProductsDto } from './dto/products.dto';
import { ProductsService } from './products.service';
@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) {}

    @Post()
    async createPost(@Req() req, @Res() res, @Body() createProductsDto: CreateProductsDto){
        const product = await this.productsService.createProducts(createProductsDto)
        res.status(HttpStatus.OK).send(product)
    }

    @Get()
    async getPosts(@Res() res, @Query() query: FilterProductsDto) {
        console.log(query);
        const products = await this.productsService.getProducts(query)
        res.status(HttpStatus.OK).send(products)
    }

    @Get('/:productId')
    async getPost(@Res() res, @Param('productId') productId: string) {
        const product = await this.productsService.getProduct(productId)
        res.status(HttpStatus.OK).send(product)
    }
}
