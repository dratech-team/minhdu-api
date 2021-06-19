import {CreateBranchDto} from "./dto/create-branch.dto";
import {Branch} from "@prisma/client";
import {ResponsePagination} from "../../../common/entities/response.pagination";
import {UpdateBranchDto} from "./dto/update-branch.dto";

export interface BaseBranchService {
  create(body: CreateBranchDto): Promise<Branch>;

  findAll(): Promise<ResponsePagination<Branch>>;

  findBy(query: any): Promise<Branch[]>;

  findOne(id: number): Promise<Branch>;

  update(id: number, updates: UpdateBranchDto): Promise<Branch>;

  remove(id: number): void;

  generateCode(input: string): string;
}
