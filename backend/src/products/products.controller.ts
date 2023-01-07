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
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { BuyProductDto, CreateProductDto, UpdateProductDto } from './dto';
import { ProductsService } from './products.service';
import { RequestType, UserRoles } from '../types';
import { Public } from '../auth/public.metadata';

import { Roles } from '../auth/roles.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';

@ApiTags('Products')
@UseGuards(PermissionsGuard)
@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(UserRoles.buyer)
  @Post('buy/:id')
  async buyProduct(
    @Request() req: RequestType,
    @Param('id') id: string,
    @Body() buyProductDto: BuyProductDto,
  ) {
    return this.productsService.buyProduct(req.user, id, buyProductDto);
  }

  @Public()
  @Get()
  async getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Public()
  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return this.productsService.getProduct(id);
  }

  @Roles(UserRoles.seller)
  @Post()
  async createProducts(
    @Request() req: RequestType,
    @Body() createProductsDto: CreateProductDto[],
  ) {
    return this.productsService.createProducts(req.user, createProductsDto);
  }

  @Roles(UserRoles.seller)
  @Put(':id')
  async updateProduct(
    @Request() req: RequestType,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(req.user, id, updateProductDto);
  }

  @Roles(UserRoles.seller)
  @Delete(':id')
  async deleteProduct(@Request() req: RequestType, @Param('id') id: string) {
    return this.productsService.deleteProduct(req.user, id);
  }
}
