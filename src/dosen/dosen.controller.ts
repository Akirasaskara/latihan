import {
  Controller,
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DosenService } from './dosen.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('dosen')
export class DosenController {
  constructor(private dosenService: DosenService) {}

  // POST /api/dosen
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  @Post()
  async create(@Body() body: any) {
    const dosen = await this.dosenService.create(body);
    return {
      status: 'success',
      message: 'Dosen added successfully',
      data: dosen,
    };
  }

  // GET /api/dosen
  @Get()
  async findAll() {
    const data = await this.dosenService.findAll();
    return {
      status: 'success',
      message: 'data dosen berhasil terkirim',
      data,
    };
  }

  // PUT /api/dosen/:nidn
  @Put(':nidn')
  async update(@Param('nidn') nidn: string, @Body() body: any) {
    const dosen = await this.dosenService.update(Number(nidn), body);
    return {
      status: 'success',
      message: 'Dosen updated successfully',
      data: dosen,
    };
  }

  // DELETE /api/dosen/:nidn
  @Delete(':nidn')
  async remove(@Param('nidn') nidn: string) {
    await this.dosenService.delete(Number(nidn));
    return {
      status: 'success',
      message: 'Dosen deleted successfully',
    };
  }
}
