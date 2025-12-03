import { JenisKelamin } from "@prisma/client";
import { IsInt, IsOptional,IsString, IsIn, IsNumber, IsEnum } from "class-validator";

export class UpdateMahasiswaDto {

        @IsNumber()
        @IsOptional()
        nim?: string;
        
       
        @IsString()
        @IsOptional()
        nama_mahasiswa?: string;
    
       
        @IsEnum(JenisKelamin)
        @IsOptional()
        jenis_kelamin?: JenisKelamin;
    
       
        @IsString()
        @IsOptional()
        jurusan?: string;
}