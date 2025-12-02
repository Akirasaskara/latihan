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
import { MatakuliahService } from './matakuliah.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Controller('matakuliah')
export class MatakuliahController {
  constructor(private mkService: MatakuliahService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(['ADMIN'])
  @Post()
  async create(@Body() body: any) {
    const mk = await this.mkService.create(body);
    return {
      status: 'success',
      message: 'Matakuliah added successfully',
      data: mk,
    };
  }

  @Get()
  async findAll() {
    const data = await this.mkService.findAll();
    return {
      status: 'success',
      message: 'Data matakuliah berhasil diambil',
      data,
    };
  }

  @Put(':id_matakuliah')
  async update(
    @Param('id_matakuliah') id_matakuliah: string,
    @Body() body: any,
  ) {
    const mk = await this.mkService.update(Number(id_matakuliah), body);
    return {
      status: 'success',
      message: 'Matakuliah updated successfully',
      data: mk,
    };
  }

  @Delete(':id_matakuliah')
  async remove(@Param('id_matakuliah') id_matakuliah: string) {
    await this.mkService.delete(Number(id_matakuliah));
    return {
      status: 'success',
      message: 'Matakuliah deleted successfully',
    };
  }
}
