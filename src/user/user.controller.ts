import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateMahasiswaDto } from 'src/mahasiswa/dto/create-mahasiswa.dto';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([Role.ADMIN])
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: any) {
    const { username, password, role, mahasiswa } = body;

    const user = await this.userService.create(
      { username, password, role } as CreateUserDto,
      role === Role.MAHASISWA && mahasiswa
        ? (mahasiswa as CreateMahasiswaDto)
        : undefined,
    );
    return {
      status: 'success',
      message: 'User created successfully',
      data: user,
    };
  }
}
