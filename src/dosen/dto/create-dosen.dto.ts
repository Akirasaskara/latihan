import { IsNotEmpty, IsNumber, IsString, IsIn } from "class-validator";

export class CreateDosenDto {
    @IsNotEmpty()
    @IsNumber()
    nidn: number;

    @IsNotEmpty()
    @IsString()
    nama_dosen: string;

    @IsNotEmpty()
    @IsString()
    jenis_kelamin: string;

    @IsNotEmpty()
    @IsString()
    alamat: string;

}