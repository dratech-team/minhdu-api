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
    const data = await this.repository.findAll(search);
    return {total: data.total, data: data.data.map(e => Object.assign(e, {branch: e.branch || {name: 'Kho tổng'}}))};
  }


  async findOne(id: number) {
    const found = await this.repository.findOne(id);
    return Object.assign(found, {branch: found.branch || {name: 'Kho tổng'}});
  }

  async update(id: number, updates: UpdateProductDto) {
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }
}
