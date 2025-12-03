import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePenjadwalanDto } from './dto/create-penjadwalan.dto';
import { UpdatePenjadwalanDto } from './dto/update-penjadwalan.dto';

@Injectable()
export class PenjadwalanService {
  constructor(private prisma: PrismaService) {}

  private buildDateTimeFromTime(time: string): Date {
    // time: "08:00"
    const today = new Date();
    const [hour, minute] = time.split(':').map(Number);

    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      hour,
      minute,
      0,
      0,
    );

    return date;
  }

  async create(dto: CreatePenjadwalanDto) {
    const { id_dosen, id_matakuliah, jadwal, jam_mulai, jam_selesai } = dto;

    const dosen = await this.prisma.dosen.findUnique({
      where: { nidn: id_dosen },
    });
    if (!dosen) throw new BadRequestException('Dosen tidak ditemukan');

    const mk = await this.prisma.matakuliah.findUnique({
      where: { id_matakuliah },
    });
    if (!mk) throw new BadRequestException('Matakuliah tidak ditemukan');

    const start = this.buildDateTimeFromTime(jam_mulai);
    const end = this.buildDateTimeFromTime(jam_selesai);

    if (start >= end) {
      throw new BadRequestException(
        'jam_mulai harus lebih kecil dari jam_selesai',
      );
    }

    return this.prisma.penjadwalan.create({
      data: {
        id_dosen,
        id_matakuliah,
        jadwal,
        jam_mulai: start,
        jam_selesai: end,
      },
    });
  }


  async findOne(id: number) {
    return this.prisma.penjadwalan.findUnique({
      where: { id },
      include: { dosen: true, matakuliah: true },
    });
  }

  async findAll() {
    return this.prisma.penjadwalan.findMany({
      include: { dosen: true, matakuliah: true },
    });
  }

  async update(id: number, dto: UpdatePenjadwalanDto) {
  // Pastikan jadwal ada
  const existing = await this.prisma.penjadwalan.findUnique({
    where: { id },
  });
  if (!existing) {
    throw new BadRequestException('Penjadwalan tidak ditemukan');
  }

  const data: any = {};

  if (dto.id_dosen !== undefined) data.id_dosen = dto.id_dosen;
  if (dto.id_matakuliah !== undefined) data.id_matakuliah = dto.id_matakuliah;
  if (dto.jadwal !== undefined) data.jadwal = dto.jadwal;
  if (dto.hari !== undefined) data.hari = dto.hari;

  if (dto.jam_mulai !== undefined) {
    const start = this.parseTimeToDate(dto.jam_mulai);
    data.jam_mulai = start;
  }
  if (dto.jam_selesai !== undefined) {
    const end = this.parseTimeToDate(dto.jam_selesai);
    data.jam_selesai = end;
  }

  // Validasi kalau dua jam ada
  if (data.jam_mulai && data.jam_selesai && data.jam_mulai >= data.jam_selesai) {
    throw new BadRequestException(
      'jam_mulai harus lebih kecil dari jam_selesai',
    );
  }

  return this.prisma.penjadwalan.update({
    where: { id },
    data,
  });
}

  async delete(id: number) {
    const existing = await this.prisma.penjadwalan.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new BadRequestException('Penjadwalan tidak ditemukan');
    }

    await this.prisma.penjadwalan.delete({ where: { id } });
  }

  private parseTimeToDate(time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    throw new BadRequestException(
      'Format jam tidak valid. Gunakan format HH:mm, contoh: "08:00"',
    );
  }

  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    0,
    0,
  );
}
}