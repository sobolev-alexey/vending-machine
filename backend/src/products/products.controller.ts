import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BuyProductDto, CreateProductDto, UpdateProductDto } from './dto';
import { ProductsService } from './products.service';
import { UserPublic } from '../users/user.schema';

type RequestType = {
  user: UserPublic;
};

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('buy/:id')
  async buyProduct(
    @Request() req: RequestType,
    @Param('id') id: string,
    @Body() buyProductDto: BuyProductDto,
  ) {
    return this.productsService.buyProduct(req.user, id, buyProductDto);
  }

  @Get()
  async getAllProducts(@Request() req: RequestType) {
    return this.productsService.getAllProducts(req.user);
  }

  @Get(':id')
  async getProduct(@Request() req: RequestType, @Param('id') id: string) {
    return this.productsService.getProduct(req.user, id);
  }

  @Post()
  async createProduct(
    @Request() req: RequestType,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.createProduct(req.user, createProductDto);
  }

  @Put(':id')
  async updateProduct(
    @Request() req: RequestType,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(req.user, id, updateProductDto);
  }

  @Delete(':id')
  async deleteProduct(@Request() req: RequestType, @Param('id') id: string) {
    return this.productsService.deleteProduct(req.user, id);
  }
}
