import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const { username, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { mahasiswa: true },
    });

    if (!user) {
      throw new UnauthorizedException('Kredensial salah');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedException('Kredensial salah');
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      mahasiswaId: user.mahasiswa?.id || null,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      status: 'success',
      message: 'Login berhasil',
      data: {
        token,
        role: user.role,
      },
    };
  }
}