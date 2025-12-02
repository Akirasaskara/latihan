import { JenisKelamin } from '@prisma/client';
import { IsEnum, isNotEmpty, IsNotEmpty, IsNumber, isString, IsString } from 'class-validator';

export class CreateMahasiswaDto {
   
    @IsNumber()
    nim?: string;
    
   
    @IsString()
    nama_mahasiswa?: string;

   
    @IsEnum(JenisKelamin)
    jenis_kelamin?: JenisKelamin;

   
    @IsString()
    jurusan?: string;



}