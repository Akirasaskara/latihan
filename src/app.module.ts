import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { DosenModule } from './dosen/dosen.module';
import { MatakuliahModule } from './matakuliah/matakuliah.module';
import { MahasiswaModule } from './mahasiswa/mahasiswa.module';
import { PenjadwalanModule } from './penjadwalan/penjadwalan.module';
import { KrsModule } from './krs/krs.module';
import { AnalisisModule } from './analisis/analisis.module';
import { PrismaModule } from 'prisma/prisma.module';  
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    DosenModule,
    MatakuliahModule,
    MahasiswaModule,
    PenjadwalanModule,
    KrsModule,
    AnalisisModule,
    PrismaModule,
    UserModule,
  ],
  providers: [PrismaService, {
    provide: APP_GUARD,
    useClass: RolesGuard,
  }],
})
export class AppModule {}