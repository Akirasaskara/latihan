import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class PilihMatakuliahDto {
  @IsInt()
  @IsNotEmpty()
  mahasiswa_id: number;       

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  matakuliah_ids: number[];  
}