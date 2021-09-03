import {Injectable,} from '@nestjs/common';
import {CreateRouteDto} from './dto/create-route.dto';
import {UpdateRouteDto} from './dto/update-route.dto';
import {RouteRepository} from "./route.repository";
import {ExportService} from "../../../core/services/export.service";
import {Response} from 'express';

@Injectable()
export class RouteService {
    constructor(private readonly repository: RouteRepository, private readonly exportService: ExportService) {
    }

    async create(body: CreateRouteDto) {
        return await this.repository.create(body);
    }

    async findAll(
        skip: number,
        take: number,
        name: string,
        startedAt: Date,
        endedAt: Date,
        driver: string,
        bsx: string,
    ) {
        if (startedAt) {
            startedAt = new Date(startedAt);
        }

        if (endedAt) {
            endedAt = new Date(endedAt);
        }

        return await this.repository.findAll(skip, take, {name, startedAt, endedAt, driver, bsx});
    }

    async findOne(id: number) {
        return await this.repository.findOne(id);
    }

    async update(id: number, updates: UpdateRouteDto) {
        return await this.repository.update(id, updates);
    }

    async remove(id: number) {
        return await this.repository.remove(id);
    }

    async export(response?: Response, search?: Partial<CreateRouteDto>) {
        const data = await this.repository.finds(search);

        const res = this.exportService.toExcel(response, {
            excel: {
                /// TODO: Truyền vào title
                title: "Danh sách tuyến đường XXXX",
                customHeaders: [
                    {header: "Tên tuyến đường", key: "name"},
                    {header: "Ngày khởi hành", key: "startedAt", numFmt: "dd/MM/yyyy"},
                    {header: "Ngày kết thúc", key: "endedAt"},
                    {header: "Nhà xe", key: "garage"},
                    {header: "Tên tài xế", key: "driver"},
                    {header: "Biển số xe", key: "bsx"},
                ],
                name: "data.xlsx",
                data: data.map(e => ({
                    name: e.name,
                    startedAt: e.startedAt,
                    endedAt: e.endedAt,
                    garage: e.garage,
                    driver: e.driver,
                    bsx: e.bsx
                })),
            }
        }, 200);
        console.log(res);
    }
}
