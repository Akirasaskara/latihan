import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class TopAnalisisDto {
  @IsString()
  @IsNotEmpty()
  tahun_ajaran: string; // contoh: "2025/2026"

  @IsInt()
  @IsNotEmpty()
  semester: number; // contoh: 1 atau 2

  @IsInt()
  @IsOptional()
  @Min(1)
  limit?: number; // opsional, default nanti di service
}