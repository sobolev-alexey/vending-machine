import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNumber()
  amountAvailable: number;

  @IsNumber()
  cost: number;

  @IsString()
  productName: string;
}
