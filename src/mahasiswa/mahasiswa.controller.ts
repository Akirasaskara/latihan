import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MahasiswaService } from './mahasiswa.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('mahasiswa')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(['ADMIN'])
export class MahasiswaController {
  constructor(private mhsService: MahasiswaService) {}

  @Post()
  async create(@Body() body: any) {
    const mahasiswa = await this.mhsService.create(body);
    return {
      status: 'success',
      message: 'Mahasiswa added successfully',
      data: mahasiswa,
    };
  }

  @Get()
  async findAll() {
    const data = await this.mhsService.findAll();
    return {
      status: 'success',
      message: 'Data mahasiswa berhasil diambil',
      data,
    };
  }

  @Put(':nim')
  async update(@Param('nim') nim: string, @Body() body: any) {
    const mahasiswa = await this.mhsService.update(nim, body);
    return {
      status: 'success',
      message: 'Mahasiswa updated successfully',
      data: mahasiswa,
    };
  }

  @Delete(':nim')
  async remove(@Param('nim') nim: string) {
    await this.mhsService.delete(nim);
    return {
      status: 'success',
      message: 'Mahasiswa deleted successfully',
    };
  }
}