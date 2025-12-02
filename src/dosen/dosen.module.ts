import { Module } from '@nestjs/common';
import { DosenController } from './dosen.controller';
import { DosenService } from './dosen.service';
import { PrismaService } from 'prisma/prisma.service';
import { PassportStrategy } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { AuthModule } from 'src/auth/auth.module';

@Module({

  controllers: [DosenController],
  providers: [DosenService, PrismaService ],
  imports: [AuthModule],
})
export class DosenModule {}
