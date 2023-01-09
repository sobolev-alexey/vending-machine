import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BuyProductDto, CreateProductDto, UpdateProductDto } from './dto';
import { Product, ProductDocument } from './products.schema';
import { User, UserDocument, UserPublic } from '../users/user.schema';
import { UserRoles } from '../types';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async buyProduct(user: UserPublic, id: string, buyProductDto: BuyProductDto) {
    const product = await this.productModel.findById(id).exec();

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    const price = product.cost * buyProductDto.quantity;
    if (user.deposit < price) {
      throw new HttpException('Insufficient funds', HttpStatus.CONFLICT);
    }

    if (product.amountAvailable < buyProductDto.quantity) {
      throw new HttpException(
        'Insufficient product quantity',
        HttpStatus.CONFLICT,
      );
    }

    // deduct purchased amount from products
    product.amountAvailable -= buyProductDto.quantity;
    await product.save();

    // calculate change in an array of 5, 10, 20, 50 and 100 cent coins
    const change = this.getChange(user.deposit - price);

    // update buyers deposit value
    await this.userModel.findOneAndUpdate(
      { _id: user._id },
      { $inc: { deposit: -user.deposit, total: price } },
    );

    // add cost of purchased items to sellers account
    await this.userModel.findOneAndUpdate(
      { _id: product.sellerId },
      { $inc: { total: price } },
    );

    return {
      change,
      totalSpent: user.total + price,
      productId: product._id,
      productName: product.productName,
      quantity: buyProductDto.quantity,
    };
  }

  async createProducts(
    user: UserPublic,
    createProductsDto: CreateProductDto[],
  ): Promise<Product[]> {
    const products = [];
    for await (const createProductDto of createProductsDto) {
      const existingProducts: Product[] = await this.productModel.find({
        shelfLocation: createProductDto?.shelfLocation,
        amountAvailable: { $gt: 0 },
      });

      if (!existingProducts?.length) {
        const newProduct = new this.productModel({
          ...createProductDto,
          sellerId: user._id,
        });

        await newProduct.save();
        products.push(newProduct);
      }
    }
    return products;
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productModel.find({ amountAvailable: { $gt: 0 } }).exec();
  }

  async getSellerProducts(user?: UserPublic): Promise<Product[]> {
    if (user?.role === UserRoles.seller) {
      return this.productModel.find({ sellerId: user._id }).exec();
    }
    throw new HttpException('Not allowed', HttpStatus.METHOD_NOT_ALLOWED);
  }

  async getProduct(id: string): Promise<Product> {
    return this.productModel.findOne({ _id: id });
  }

  async updateProduct(
    user: UserPublic,
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const shouldUpdateProp = Object.keys(updateProductDto).every((param) =>
      [
        'amountAvailable',
        'cost',
        'productName',
        'image',
        'shelfLocation',
      ].includes(param),
    );

    if (!shouldUpdateProp) {
      throw new HttpException('Not allowed', HttpStatus.METHOD_NOT_ALLOWED);
    }

    await this.productModel.findOneAndUpdate(
      { _id: id, sellerId: user._id },
      updateProductDto,
    );
    return this.productModel.findOne({ _id: id, sellerId: user._id });
  }

  async deleteProduct(user: UserPublic, id: string): Promise<Product> {
    return this.productModel.findOneAndRemove({ _id: id, sellerId: user._id });
  }

  getChange(amountInCents: number): number[] {
    let amount: number = amountInCents;
    const coins = [5, 10, 20, 50, 100];
    const change = coins
      .reverse()
      .map((coin: number) => {
        const amountCoin = Math.floor(amount / coin);
        amount -= amountCoin * coin;
        return amountCoin;
      })
      .reverse();
    return change;
    // return change.map((count, index) => `${count} x $${coins[index] / 100}`).join(" + ");
  }
}
