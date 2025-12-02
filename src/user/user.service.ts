import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { CreateMahasiswaDto } from 'src/mahasiswa/dto/create-mahasiswa.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const rounds =
      Number(this.config.get('BCRYPT_SALT_ROUNDS')) || 10;
    return bcrypt.hash(password, rounds);
  }

  async create(dto: CreateUserDto, createMahasiswaDto?: CreateMahasiswaDto) {
    const { username, password, role } = dto;

    // cek username unik
    const existing = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existing) {
      throw new BadRequestException('Username sudah digunakan');
    }

    const hashedPassword = await this.hashPassword(password);

    const user = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,

        mahasiswa: 
        role === 'MAHASISWA' && createMahasiswaDto
            ? {
                create: {
                  nim: String(createMahasiswaDto.nim) ?? '', // FIX: Cast to string supaya cocok dengan Prisma
                  nama_mahasiswa: createMahasiswaDto.nama_mahasiswa ?? '',
                  jenis_kelamin: createMahasiswaDto.jenis_kelamin ?? 'L',
                  jurusan: createMahasiswaDto.jurusan ?? '',
                },
              }
            : undefined,
      },
      include: {
        mahasiswa: true,
      }
    });

    // jangan kembalikan password ke client
    const { password: _pw, ...result } = user;
    return result;
  }

  async findby(id: number) {
    if (!id) {
      throw new BadRequestException('ID tidak valid');
    }

    return await this.prisma.user.findUnique({
      where: { id },
    });
  }
}
