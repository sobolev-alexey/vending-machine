import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DepositDto {
  @ApiProperty()
  @IsNumber()
  deposit: number;
}
