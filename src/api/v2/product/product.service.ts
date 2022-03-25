import {Injectable} from "@nestjs/common";
import {CreateProductDto} from "./dto/create-product.dto";
import {SearchProductDto} from "./dto/search-product.dto";
import {UpdateProductDto} from "./dto/update-product.dto";
import {ProductRepository} from "./product.repository";

@Injectable()
export class ProductService {
  constructor(private readonly repository: ProductRepository) {
  }

  async create(body: CreateProductDto) {
    return await this.repository.create(body);
  }

  async findAll(search: SearchProductDto) {
    return await this.repository.findAll(search);
  }


  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateProductDto) {
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }
}
