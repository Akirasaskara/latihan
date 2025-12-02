import { Module } from '@nestjs/common';
import { PenjadwalanController } from './penjadwalan.controller';
import { PenjadwalanService } from './penjadwalan.service';

@Module({
  controllers: [PenjadwalanController],
  providers: [PenjadwalanService]
})
export class PenjadwalanModule {}
