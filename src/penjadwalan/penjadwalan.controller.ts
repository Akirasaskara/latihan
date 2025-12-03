import { Controller, Body, Delete, Get, Param, Post, Put, UseGuards, NotFoundException   } from '@nestjs/common';
import { PenjadwalanService } from './penjadwalan.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { CreatePenjadwalanDto } from './dto/create-penjadwalan.dto';
import { UpdatePenjadwalanDto } from './dto/update-penjadwalan.dto';


@Controller('penjadwalan')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(['ADMIN', 'DOSEN'])
export class PenjadwalanController {
  constructor(private penjadwalanService: PenjadwalanService) {}

  @Post()
  async create(@Body() dto: CreatePenjadwalanDto) {
    const jadwal = await this.penjadwalanService.create(dto);
    return {
      status: 'success',
      message: 'Penjadwalan added successfully',
      data: jadwal,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const jadwal = await this.penjadwalanService.findOne(Number(id));
    if (!jadwal) {
      throw new NotFoundException('Jadwal tidak ditemukan');
    }
    return {
      status: 'success',
      message: 'Data penjadwalan berhasil diambil',
      data: jadwal,
    };
  }

  @Get()
  async findAll() {
    const data = await this.penjadwalanService.findAll();
    return {
      status: 'success',
      message: 'Data penjadwalan berhasil diambil',
      data,
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePenjadwalanDto) {
    const updated = await this.penjadwalanService.update(Number(id), dto);
    return {
      status: 'success',
      message: 'Penjadwalan updated successfully',
      data: updated,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.penjadwalanService.delete(Number(id));
    return {
      status: 'success',
      message: 'Penjadwalan deleted successfully',
    };
  }
}