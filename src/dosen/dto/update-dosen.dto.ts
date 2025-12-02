import { IsInt, IsOptional,IsString, IsIn } from "class-validator";

export class UpdateDosenDto {
    @IsString()
    @IsOptional()
    nama_dosen?: string;

    @IsString()
    @IsIn(["L","P"])
    @IsOptional()
    jenis_kelamin?: string;

    @IsString()
    @IsOptional()
    alamat?: string;
}