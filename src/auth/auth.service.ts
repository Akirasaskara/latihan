import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
  // perhatikan path ini: sesuaikan kalau di project-mu beda
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Mahasiswa } from '@prisma/client';

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
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      status: 'success',
      message: 'Login berhasil',
      data: {
        token,
        role: user.role,
      },
    };
  }

  // =============== REGISTER ===============

  async register(dto: RegisterDto) {
    const {
      username,
      password,
      nim,
      nama_mahasiswa,
      jurusan,
      jenis_kelamin,
      role,
    } = dto;

    // cek username
    const existUser = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existUser) {
      throw new BadRequestException('Username sudah digunakan');
    }

    // cek NIM
    const existMhs = await this.prisma.mahasiswa.findUnique({
      where: { nim },
    });
    if (existMhs) {
      throw new BadRequestException('NIM sudah terdaftar');
    }

    const hashed = await bcrypt.hash(password, 10);

    // default role MAHASISWA kalau tidak diisi
    const finalRole = role ?? 'MAHASISWA';

    // buat user
    const user = await this.prisma.user.create({
      data: {
        username,
        password: hashed,
        role: finalRole as any, // karena enum Role di Prisma
      },
    });

    // kalau role mahasiswa → buat data mahasiswa
    let mahasiswa: Mahasiswa | null = null;
    if (finalRole === 'MAHASISWA') {
      mahasiswa = await this.prisma.mahasiswa.create({
        data: {
          nim,
          nama_mahasiswa,
          jurusan,
          jenis_kelamin: jenis_kelamin as any, // "L" | "P"
          userId: user.id,
        },
      });
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      status: 'success',
      message: 'Registrasi berhasil',
      data: {
        token,
        role: user.role,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        mahasiswa,
      },
    };
  }
}