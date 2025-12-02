import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MatakuliahService {
  constructor(private prisma: PrismaService) {}

  
  create(data: any) {
    return this.prisma.matakuliah.create({
      data: {
        id_matakuliah: Number(data.id_matakuliah),
        nama_matakuliah: data.nama_matakuliah,
        id_dosen: Number(data.id_dosen),
        sks: Number(data.sks),
      },
    });
  }

  findAll() {
    return this.prisma.matakuliah.findMany();
  }

  update(id_matakuliah: number, data: any) {
    return this.prisma.matakuliah.update({
      where: { id_matakuliah },
      data: {
        nama_matakuliah: data.nama_matakuliah,
        id_dosen: Number(data.id_dosen),
        sks: Number(data.sks),
      },
    });
  }

  delete(id_matakuliah: number) {
    return this.prisma.matakuliah.delete({ where: { id_matakuliah } });
  }
}