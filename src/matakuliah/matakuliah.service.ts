import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMatakuliahDto } from './dto/create-matakuliah.dto';
import { Updatematakuliah } from './dto/update-matakuliah.dto';

@Injectable()
export class MatakuliahService {
  constructor(private prisma: PrismaService) {}

  
  async create(data: CreateMatakuliahDto) {
    return await this.prisma.matakuliah.create({
      data: {
        nama_matakuliah: data.nama_matakuliah,
        id_dosen: Number(data.id_dosen),
        sks: Number(data.sks),
      },
    });
  }

  findAll() {
    return this.prisma.matakuliah.findMany();
  }

  update(id_matakuliah: number, dto: Updatematakuliah) {
    return this.prisma.matakuliah.update({
      where: { id_matakuliah },
      data: {
        nama_matakuliah: dto.nama_matakuliah ?? undefined,
        id_dosen: dto.id_dosen ?? undefined,
        sks: dto.sks ?? undefined,
      },
    });
  }

  delete(id_matakuliah: number) {
    return this.prisma.matakuliah.delete({ where: { id_matakuliah } });
  }
}