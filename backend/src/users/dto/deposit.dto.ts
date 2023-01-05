import { IsNumber } from 'class-validator';

export class DepositDto {
  @IsNumber()
  deposit: number;
}
