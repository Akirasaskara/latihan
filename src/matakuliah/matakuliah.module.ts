import { Module } from '@nestjs/common';
import { MatakuliahController } from './matakuliah.controller';
import { MatakuliahService } from './matakuliah.service';
import { PrismaService } from 'prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [AuthModule],
  controllers: [MatakuliahController],
  providers: [MatakuliahService,PrismaService]
})
export class MatakuliahModule {}
