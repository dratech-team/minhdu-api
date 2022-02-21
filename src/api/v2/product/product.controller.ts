import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import {ProductService} from './product.service';
import {CreateProductDto} from './dto/create-product.dto';
import {UpdateProductDto} from './dto/update-product.dto';
import {SearchProductDto} from "./dto/search-product.dto";
import {InventoryProductDto, InventoryProductsDto} from "./dto/inventory-product.dto";

@Controller('v2/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(@Query() search: SearchProductDto) {
    return this.productService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }

  @Post('/inventory')
  inventory(@Query() body: InventoryProductsDto) {
    return this.productService.inventory(body);
  }
}
