import {CreateProfileDto} from "./dto/create-profile.dto";
import {Profile} from '@prisma/client';
import {ResponsePagination} from "../../../common/entities/response.pagination";
import {UpdatePositionDto} from "../position/dto/update-position.dto";

export interface BaseProfileService {
  create(body: CreateProfileDto): Promise<Profile>;

  findAll(): Promise<ResponsePagination<Profile>>;

  findOne(id: number): Promise<Profile>;

  findBy(query: any): Promise<Profile[]>;

  update(id: number, updates: UpdatePositionDto): Promise<Profile>;

  remove(id: number): void;
}
