import {Module} from '@nestjs/common';
import {AreaService} from './area.service';
import {AreaController} from './area.controller';

@Module({
  imports: [],
  controllers: [AreaController],
  providers: [AreaService]
})
export class AreaModule {
}
