import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

import { CreateMahasiswaDto } from 'src/mahasiswa/dto/create-mahasiswa.dto';
import { CreateDosenDto } from 'src/dosen/dto/create-dosen.dto';
import { JenisKelamin, Mahasiswa, Dosen } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private async hashPassword(password: string): Promise<string> {
    const rounds = 10;
    return bcrypt.hash(password, rounds);
  }

  /**
   * createMahasiswaDto dipakai kalau role = 'MAHASISWA'
   * createDosenDto dipakai kalau role = 'DOSEN'
   */
  async create(
    dto: CreateUserDto,
    createMahasiswaDto?: CreateMahasiswaDto,
    createDosenDto?: CreateDosenDto,
  ) {
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
        // Relasi Mahasiswa
        mahasiswa:
          role === 'MAHASISWA' && createMahasiswaDto
            ? {
                create: {
                  nim: String(createMahasiswaDto.nim) ?? '',
                  nama_mahasiswa: createMahasiswaDto.nama_mahasiswa ?? '',
                  jenis_kelamin:
                    (createMahasiswaDto.jenis_kelamin as JenisKelamin) ??
                    JenisKelamin.L,
                  jurusan: createMahasiswaDto.jurusan ?? '',
                },
              }
            : undefined,
        // Relasi Dosen
        dosen:
          role === 'DOSEN' && createDosenDto
            ? {
                create: {
                  nidn: createDosenDto.nidn,
                  nama_dosen: createDosenDto.nama_dosen,
                  jenis_kelamin:
                    (createDosenDto.jenis_kelamin as JenisKelamin) ??
                    JenisKelamin.L,
                  alamat: createDosenDto.alamat,
                },
              }
            : undefined,
      },
      // PENTING: include relasi supaya .mahasiswa & .dosen dikenali TS
      include: {
        mahasiswa: true,
        dosen: true,
      },
    });

    // Tipe eksplisit supaya tidak dianggap null saja
   
    if (user.mahasiswa) {
      let updatedMahasiswa = await this.prisma.mahasiswa.update({
        where: { id: user.mahasiswa.id },
        data: { userId: user.id },
      });
    }

    if (user.dosen && dto.role === 'DOSEN') {
     let updatedDosen = await this.prisma.dosen.update({
        where: { nidn: user.dosen.nidn },
        data: { userId: user.id },
      });
    }

        const { password: _pw, ...result } = user;
    return {
     user: result
    };
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