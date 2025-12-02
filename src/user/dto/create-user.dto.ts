import { IsEmail, IsEnum, IsNotEmpty, IsString, min, MinLength } from 'class-validator';
import { Role } from '@prisma/client';
import { CreateMahasiswaDto } from 'src/mahasiswa/dto/create-mahasiswa.dto';


export class CreateUserDto {

        @IsString()
        @MinLength(3)
        username: string;

        @IsString()
        @MinLength(6)
        password: string;  

        @IsEnum(Role)
        role: Role


        mahasiswa: Partial<CreateMahasiswaDto>;
    }
