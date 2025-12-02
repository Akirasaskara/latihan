import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsEnum, IsNotEmpty, IsString, min, MinLength } from 'class-validator';
import { Role } from '.prisma/client/wasm';

export class UpdateUserDto extends PartialType(CreateUserDto) {

        @IsString()
        @MinLength(3)
        username: string;
    
        @IsString()
        @MinLength(6)
        password: string;  
    
        @IsEnum(Role)
        role: Role
}
