import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AnalisisService } from './analisis.service';
import { TopAnalisisDto } from './dto/top-analisis.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('analisis')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(['ADMIN']) 
export class AnalisisController {
  constructor(private readonly analisisService: AnalisisService) {}

  @Post('top-matakuliah-dosen')
  async topMatakuliahDosen(@Body() dto: TopAnalisisDto) {
    return this.analisisService.topMatakuliahDosen(dto);
  }
}