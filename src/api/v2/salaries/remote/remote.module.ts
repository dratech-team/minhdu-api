import { Module } from '@nestjs/common';
import { RemoteService } from './remote.service';
import { RemoteController } from './remote.controller';

@Module({
  controllers: [RemoteController],
  providers: [RemoteService]
})
export class RemoteModule {}
