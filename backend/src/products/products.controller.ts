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
import { RequestType, UserRoles } from '../types';

import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';

@UseGuards(PermissionsGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Permissions(UserRoles.buyer)
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

  @Permissions(UserRoles.seller)
  @Post()
  async createProducts(
    @Request() req: RequestType,
    @Body() createProductsDto: CreateProductDto[],
  ) {
    return this.productsService.createProducts(req.user, createProductsDto);
  }

  @Permissions(UserRoles.seller)
  @Put(':id')
  async updateProduct(
    @Request() req: RequestType,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(req.user, id, updateProductDto);
  }

  @Permissions(UserRoles.seller)
  @Delete(':id')
  async deleteProduct(@Request() req: RequestType, @Param('id') id: string) {
    return this.productsService.deleteProduct(req.user, id);
  }
}
