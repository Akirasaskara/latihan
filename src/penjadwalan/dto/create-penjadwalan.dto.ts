import { IsInt, IsNotEmpty, IsString, min, MinLength } from "class-validator";

export class CreatePenjadwalanDto {

    @IsInt()
    @IsNotEmpty()
    id_dosen: number;

    @IsInt()
    @IsNotEmpty()
    id_matakuliah: number;

    @IsString()
    @IsNotEmpty()
    @MinLength(5, { message: 'Jadwal harus memiliki minimal 5 karakter' })
    jadwal: string;

    @IsString()
    @IsNotEmpty()
    jam_mulai: string;

    @IsString()
    @IsNotEmpty()
    jam_selesai: string;

    @IsString()
    @IsNotEmpty()
    hari: string;

}