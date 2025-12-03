// src/auth/dto/register.dto.ts
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  // data mahasiswa
  @IsString()
  @IsNotEmpty()
  nim: string;

  @IsString()
  @IsNotEmpty()
  nama_mahasiswa: string;

  @IsString()
  @IsNotEmpty()
  jurusan: string;

  @IsString()
  @IsNotEmpty()
  jenis_kelamin: string; // "L" atau "P"

  // optional: boleh daftar sebagai ADMIN jika memang dibutuhkan
  @IsEnum(Role)
  @IsOptional()
  role?: Role; // default MAHASISWA kalau tidak diisi
}