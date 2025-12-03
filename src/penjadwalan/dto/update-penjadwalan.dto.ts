import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdatePenjadwalanDto {
  @IsInt()
  @IsOptional()
  id_dosen?: number;

  @IsInt()
  @IsOptional()
  id_matakuliah?: number;

  @IsString()
  @IsOptional()
  @MinLength(5, { message: 'Jadwal harus memiliki minimal 5 karakter' })
  jadwal?: string;

  @IsString()
  @IsOptional()
  jam_mulai?: string;

  @IsString()
  @IsOptional()
  jam_selesai?: string;

  @IsString()
  @IsOptional()
  hari?: string;
}
