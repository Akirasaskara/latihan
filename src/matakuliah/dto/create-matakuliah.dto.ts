import { IsNumber,IsNotEmpty,IsString, IsInt, IsIn } from "class-validator";

export class CreateMatakuliahDto {

    @IsString()
    @IsNotEmpty()
    nama_matakuliah: string;

    @IsInt()
    @IsNotEmpty()
    id_dosen: number;

    @IsInt()
    @IsNotEmpty()
    sks: number;
}