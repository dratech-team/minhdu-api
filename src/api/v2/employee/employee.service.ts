import {Injectable} from "@nestjs/common";
import {CreateEmployeeDto} from "./dto/create-employee.dto";
import {EmployeeRepository} from "./employee.repository";
import {UpdateEmployeeDto} from "./dto/update-employee.dto";
import {BaseEmployeeService} from "./base-employee.service";
import {PositionService} from "../../../common/branches/position/position.service";
import {WorkHistoryService} from "../histories/work-history/work-history.service";
import {SearchEmployeeDto} from "./dto/search-employee.dto";
import {ProfileEntity} from "../../../common/entities/profile.entity";

@Injectable()
export class EmployeeService implements BaseEmployeeService {
  constructor(
    private readonly repository: EmployeeRepository,
    private readonly workHisService: WorkHistoryService,
  ) {
  }

  async create(body: CreateEmployeeDto) {
    // const res = await this.positionService.findBranch(body.positionId);
    // body.code = await this.generateEmployeeCode(res?.department?.branch?.code);

    return await this.repository.create(body);
  }

  // @ts-ignore
  async findAll(
    branchId: ProfileEntity,
    skip: number,
    take: number,
    search?: Partial<SearchEmployeeDto>
  ) {
    return await this.repository.findAll(branchId, skip, take, search);
  }

  findBy(query: any) {
    return this.repository.findBy(query);
  }

  findFirst(query: any) {
    return this.repository.findFirst(query);
  }

  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateEmployeeDto) {
    const found = await this.findOne(id);
    if (updates.positionId && found.positionId !== updates.positionId) {
      this.findOne(id).then(employee => {
        this.workHisService.create(employee.positionId, id).then(_ => {
          this.workHisService.create(updates.positionId, id);
        });
      });
    }

    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    return this.repository.remove(id);
  }

  async generateEmployeeCode(branchCode: string): Promise<string> {
    const count = await this.repository.count();
    let gen: string;
    if (count < 10) {
      gen = "0000";
    } else if (count < 100) {
      gen = "000";
    } else if (count < 1000) {
      gen = "00";
    } else if (count < 10000) {
      gen = "0";
    }
    return `${branchCode}${gen}${count + 1}`;
  }

  /*Generate qrcode*/
  // updateQrCodeEmployee(employeeId: number, code: string) {
  //   qr.toDataURL(code).then((qrCode) =>
  //     this.repository.updateQrCode(employeeId, qrCode)
  //   );
  // }
}
