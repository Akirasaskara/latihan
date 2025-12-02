import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DosenService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.dosen.create({
      data: {
        nidn: Number(data.nidn),
        nama_dosen: data.nama_dosen,
        jenis_kelamin: data.jenis_kelamin,
        alamat: data.alamat,
      },
    });
  }

  findAll() {
    return this.prisma.dosen.findMany();
  }

  update(nidn: number, data: any) {
    return this.prisma.dosen.update({
      where: { nidn },
      data: {
        nama_dosen: data.nama_dosen,
        jenis_kelamin: data.jenis_kelamin,
        alamat: data.alamat,
      },
    });
  }

  delete(nidn: number) {
    return this.prisma.dosen.delete({ where: { nidn } });
  }
}