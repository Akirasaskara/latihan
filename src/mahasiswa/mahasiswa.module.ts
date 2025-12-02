import { Module } from '@nestjs/common';
import { MahasiswaController } from './mahasiswa.controller';
import { MahasiswaService } from './mahasiswa.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [MahasiswaController],
  providers: [MahasiswaService]
})
export class MahasiswaModule {}
