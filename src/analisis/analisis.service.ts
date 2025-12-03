import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TopAnalisisDto } from './dto/top-analisis.dto';

@Injectable()
export class AnalisisService {
  constructor(private readonly prisma: PrismaService) {}

  async topMatakuliahDosen(dto: TopAnalisisDto) {
    const { tahun_ajaran, semester, limit } = dto;
    const topLimit = limit && limit > 0 ? limit : 5;

    // ===== 1. Ambil semua KRS untuk tahun ajaran & semester tersebut =====
    const krsList = await this.prisma.kRS.findMany({
      where: {
        tahunAjaran: tahun_ajaran,
        semester,
      },
      include: {
        penjadwalan: {
          include: {
            matakuliah: true,
            dosen: true,
          },
        },
      },
    });

    if (krsList.length === 0) {
      return {
        status: 'error',
        message:
          'Belum ada data KRS untuk tahun ajaran dan semester tersebut.',
      };
    }

    // ===== 2. Hitung frekuensi per matakuliah & per dosen =====

    type TopMatkulAgg = {
      id_matakuliah: number;
      nama_matakuliah: string;
      id_dosen: number;
      nama_dosen: string;
      total_mahasiswa_memilih: number;
      total_sks_diambil: number;
    };

    type TopDosenAgg = {
      id_dosen: number;
      nama_dosen: string;
      total_mahasiswa_memilih: number;
      total_matakuliah_diampu: number;
      total_pengambilan_matakuliah: number;
    };

    const matkulMap = new Map<number, TopMatkulAgg>();
    const dosenMap = new Map<number, TopDosenAgg>();
    const dosenMatkulSet = new Map<number, Set<number>>(); // untuk hitung banyak matkul unik per dosen

    for (const krs of krsList) {
      const pj = krs.penjadwalan;
      const mk = pj.matakuliah;
      const ds = pj.dosen;

      if (!mk || !ds) continue;

      // === agregasi per matakuliah ===
      const mkKey = mk.id_matakuliah;
      const existingMk = matkulMap.get(mkKey) || {
        id_matakuliah: mk.id_matakuliah,
        nama_matakuliah: mk.nama_matakuliah,
        id_dosen: ds.nidn,
        nama_dosen: ds.nama_dosen,
        total_mahasiswa_memilih: 0,
        total_sks_diambil: 0,
      };
      existingMk.total_mahasiswa_memilih += 1;
      existingMk.total_sks_diambil += mk.sks;
      matkulMap.set(mkKey, existingMk);

      // === agregasi per dosen ===
      const dsKey = ds.nidn;
      const existingDs = dosenMap.get(dsKey) || {
        id_dosen: ds.nidn,
        nama_dosen: ds.nama_dosen,
        total_mahasiswa_memilih: 0,
        total_matakuliah_diampu: 0,        
        total_pengambilan_matakuliah: 0,
      };
      existingDs.total_mahasiswa_memilih += 1;
      existingDs.total_pengambilan_matakuliah += 1;
      dosenMap.set(dsKey, existingDs);

      // simpan set matakuliah per dosen untuk hitungan unik
      const mkSet = dosenMatkulSet.get(dsKey) || new Set<number>();
      mkSet.add(mk.id_matakuliah);
      dosenMatkulSet.set(dsKey, mkSet);
    }

    // isi total_matakuliah yang diajar 
    for (const [dsKey, dsAgg] of dosenMap.entries()) {
      const mkSet = dosenMatkulSet.get(dsKey);
      dsAgg.total_matakuliah_diampu = mkSet ? mkSet.size : 0;
    }

    // ===== 3. Sort & ambil top matkul dosen=====

    const topMatakuliah = Array.from(matkulMap.values())
      .sort(
        (a, b) =>
          b.total_mahasiswa_memilih - a.total_mahasiswa_memilih,
      )
      .slice(0, topLimit);

    const topDosen = Array.from(dosenMap.values())
      .sort(
        (a, b) =>
          b.total_mahasiswa_memilih - a.total_mahasiswa_memilih,
      )
      .slice(0, topLimit);

    // ===== 4. Return hasil =====
    return {
      status: 'success',
      message: 'Analisis matakuliah dan dosen berhasil diambil',
      data: {
        top_matakuliah: topMatakuliah,
        top_dosen: topDosen,
      },
    };
  }
}