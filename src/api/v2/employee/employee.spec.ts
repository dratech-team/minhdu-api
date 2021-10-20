import {INestApplication} from "@nestjs/common";
import {Test} from "@nestjs/testing";
import {EmployeeModule} from "./employee.module";
import {EmployeeService} from "./employee.service";
import * as request from 'supertest';

describe('Employee', () => {
  let app: INestApplication;
  let employeeService = {findAll: () => ['test']};

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [EmployeeModule],
    })
      .overrideProvider(EmployeeService)
      .useValue(employeeService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    it('/GET employees', () => {
      return request(app.getHttpServer())
        .get('/v2/employee')
        .expect(200)
        .expect({data: employeeService.findAll()});
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
