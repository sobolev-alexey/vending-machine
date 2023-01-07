import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsNumber()
  amountAvailable: number;

  @IsNumber()
  cost: number;

  @IsString()
  productName: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  shelfLocation: string;
}
