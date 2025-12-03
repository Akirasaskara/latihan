import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { PilihMatakuliahDto } from './dto/pilih-matakuliah.dto';

@Injectable()
export class MahasiswaService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const { nim, nama_mahasiswa, jenis_kelamin, jurusan, username, password } =
      data;

    if (username && password) {
      const saltRounds = 10;
      const hashed = await bcrypt.hash(password, saltRounds);

      const user = await this.prisma.user.create({
        data: {
          username,
          password: hashed,
          role: 'MAHASISWA',
        },
      });
      const mahasiswa = await this.prisma.mahasiswa.create({
        data: {
          nim,
          nama_mahasiswa,
          jenis_kelamin,
          jurusan,
          userId: user.id,
        },
      });
      return mahasiswa;
    } else {
      return 'GAONOK PASSWORD E TONG ';
    }
  }

  findAll() {
    return this.prisma.mahasiswa.findMany();
  }

  async update(nim: string, data: any) {
  const { nama_mahasiswa, jenis_kelamin, jurusan } = data;


  const existing = await this.prisma.mahasiswa.findUnique({
    where: { nim },
  });

  if (!existing) {

    throw new BadRequestException('Mahasiswa dengan NIM tersebut tidak ditemukan');
  }

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

    if (!mhs) {
      return {
        status: 'error',
        message: 'Mahasiswa tidak ditemukan',
      };
    }

    await this.prisma.mahasiswa.delete({ where: { nim: mhs.nim } });
    return {
      status: 'success',
      message: 'Mahasiswa deleted successfully',
    };
  }

  // cek bentrok jadwal berdasarkan string jadwal
  private isScheduleConflict(jadwalList: string[]): boolean {
    const set = new Set<string>();
    for (const j of jadwalList) {
      if (set.has(j)) return true;
      set.add(j);
    }
    return false;
  }

  async pilihMatakuliah(dto: PilihMatakuliahDto) {
    const { mahasiswa_id, matakuliah_ids } = dto;

    // pastikan array tidak undefined/kosong
    if (!Array.isArray(matakuliah_ids) || matakuliah_ids.length === 0) {
      return {
        status: 'error',
        message: 'penjadwalan_ids harus berupa array dan tidak boleh kosong',
      };
    }

    // cek mahasiswa
    const mhs = await this.prisma.mahasiswa.findUnique({
      where: { id: mahasiswa_id },
    });
    if (!mhs) {
      throw new BadRequestException('Mahasiswa tidak ditemukan');
    }

    // ambil penjadwalan + matakuliah
    const jadwalList = await this.prisma.penjadwalan.findMany({
      where: {
        id: { in: matakuliah_ids },
      },
      include: {
        matakuliah: true,
      },
    });

    if (jadwalList.length !== matakuliah_ids.length) {
      return {
        status: 'error',
        message:
          'Beberapa matakuliah tidak memiliki jadwal / tidak ditemukan',
      };
    }

    // hitung total SKS
    const totalSks = jadwalList.reduce(
      (sum, j) => sum + j.matakuliah.sks,
      0,
    );

    if (totalSks < 15) {
      return {
        status: 'error',
        message: 'Total SKS kurang dari 15. Silakan tambah matakuliah.',
      };
    }

    if (totalSks > 23) {
      return {
        status: 'error',
        message: 'Total SKS melebihi 23. Silakan kurangi matakuliah.',
      };
    }

    // cek jadwal bentrok (berdasarkan string jadwal)
    const jadwalStrings = jadwalList.map((j) => j.jadwal);
    if (this.isScheduleConflict(jadwalStrings)) {
      return {
        status: 'error',
        message: 'Jadwal bentrok antar matakuliah yang dipilih.',
      };
    }

    // simpan ke tabel KRS
    const tahunAjaran = ['2021','2022','2023','2024', '2025', '2026', '2027'].join('/');
    const semester = 1;

    await this.prisma.kRS.deleteMany({
      where: {
        mahasiswaId: mahasiswa_id,
        tahunAjaran,
        semester,
      },
    });

    const createData = jadwalList.map((j) => ({
      mahasiswaId: mahasiswa_id,
      penjadwalanId: j.id,
      tahunAjaran,
      semester,
    }));

    await this.prisma.kRS.createMany({ data: createData });

    return {
      status: 'success',
      message: 'Matakuliah berhasil dipilih',
      data: {
        mahasiswa_id,
        matakuliah_ids,
        total_sks: totalSks,
      },
    };
  }
  async lihatJadwal(mahasiswa_id: number) {
  // Pastikan mahasiswa ada
  const mhs = await this.prisma.mahasiswa.findUnique({
    where: { id: mahasiswa_id },
  });
  if (!mhs) {
    throw new BadRequestException('Mahasiswa tidak ditemukan');
  }

  const tahunAjaran = '2025/2026'; 
  const semester = 1;

  
  const krsList = await this.prisma.kRS.findMany({
    where: {
      mahasiswaId: mahasiswa_id,
      tahunAjaran,
      semester,
    },
    include: {
      penjadwalan: {
        include: {
          matakuliah: true,
        },
      },
    },
  });

  if (krsList.length === 0) {
    return {
      status: 'error',
      message: 'Belum ada matakuliah / jadwal yang dipilih.',
    };
  }

  // Bentuk array jadwal sesuai format tugas
  const jadwal = krsList.map((krs) => ({
    id_matakuliah: krs.penjadwalan.id_matakuliah,
    nama_matakuliah: krs.penjadwalan.matakuliah.nama_matakuliah,
    // sesuaikan format string jadwal yang kamu mau tampilkan:
    jadwal: `${krs.penjadwalan.hari}, ${krs.penjadwalan.jadwal}`,
  }));

  // Response success
  return {
    status: 'success',
    message: 'Jadwal berhasil diambil',
    data: {
      mahasiswa_id,
      jadwal,
    },
  };
}

}