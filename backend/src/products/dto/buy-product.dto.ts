import { IsNumber } from 'class-validator';

export class BuyProductDto {
  @IsNumber()
  quantity: number;
}
