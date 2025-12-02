import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MahasiswaService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async create(data: any) {
    const { nim, nama_mahasiswa, jenis_kelamin, jurusan, username, password } =
      data;

    const mahasiswa = await this.prisma.mahasiswa.create({
      data: {
        nim,
        nama_mahasiswa,
        jenis_kelamin,
        jurusan,
      },
    });

    if (username && password) {
      const saltRounds = Number(this.config.get('BCRYPT_SALT_ROUNDS')) || 10;
      const hashed = await bcrypt.hash(password, saltRounds);

      await this.prisma.user.create({
        data: {
          username,
          password: hashed,
          role: 'MAHASISWA',
        },
      });
    }

    return mahasiswa;
  }

  findAll() {
    return this.prisma.mahasiswa.findMany();
  }

  update(nim: string, data: any) {
    const { nama_mahasiswa, jenis_kelamin, jurusan } = data;
    return this.prisma.mahasiswa.update({
      where: { nim },
      data: { nama_mahasiswa, jenis_kelamin, jurusan },
    });
  }

  async findbyNim(nim: string) {
    return this.prisma.mahasiswa.findUnique({ where: { nim } });
  }

  async delete(nim: string) {
    const mhs = await this.findbyNim(nim);

    await this.prisma.mahasiswa.delete({ where: { nim: mhs?.nim } });
  }
}
