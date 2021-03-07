import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductsSchema } from './schemas/products.schema';
import { CreateProductsDto, FilterProductsDto, UpdateProductsDto } from './dto/products.dto';
import { ProductsInterface } from './interfaces/products.interface';
import { AnyARecord } from 'dns';


@Injectable()
export class ProductsService {
  constructor(@InjectModel('products') private readonly productsModel: Model<ProductsInterface>) {}

  async createProducts(createProductsDto: CreateProductsDto): Promise<ProductsInterface> {
    const product = await this.productsModel.create(createProductsDto)
    return product;
  }

  async updateProducts(updateProductsDto: UpdateProductsDto): Promise<ProductsInterface> {
    const { id: productId} = updateProductsDto;
    const product = await this.productsModel.findOneAndUpdate({_id: productId, updateProductsDto}, {new: true});
    return product;
  }

  async getProducts(filterProductsDto: FilterProductsDto): Promise<ProductsInterface[]> {
    return this.productsModel.find(filterProductsDto).lean();
  }

  async getProduct(productId: string): Promise<ProductsInterface> {
    return this.productsModel.findOne({_id: productId}).lean();
  }

  async deleteProduct(productId: string): Promise<any> {
    await this.productsModel.deleteOne({_id: productId});
    return;
  }

}
