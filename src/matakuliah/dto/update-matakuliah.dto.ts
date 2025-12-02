import { IsInt, IsOptional,IsString, IsIn } from "class-validator";

export class Updatematakuliah {
    @IsString()
    @IsOptional()
    nama_matakuliah?: string;

    @IsInt()
    @IsOptional()
    id_dosen?: number;

    @IsInt()
    @IsOptional()
    sks?: number;
} 