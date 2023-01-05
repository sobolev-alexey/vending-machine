import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BuyProductDto, CreateProductDto, UpdateProductDto } from './dto';
import { Product, ProductDocument } from './products.schema';
import { User, UserDocument, UserPublic } from '../users/user.schema';

type ProductKeys = keyof Product;

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

    // update buyer deposit value
    await this.userModel.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          deposit: user.deposit - price,
        },
      },
    );

    // add cost of purchased items to sellers account
    await this.userModel.findOneAndUpdate(
      { _id: product.sellerId },
      {
        $set: {
          deposit: user.deposit + price,
        },
      },
    );

    return {
      change,
      totalSpent: price,
      productId: product._id,
      productName: product.productName,
      quantity: buyProductDto.quantity,
    };
  }

  async createProduct(
    user: UserPublic,
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    const productExists = await this.productModel.findOne({
      productName: createProductDto.productName,
      sellerId: user._id,
    });

    if (productExists) {
      throw new HttpException('Product already exists', HttpStatus.CONFLICT);
    }

    const createdProduct = new this.productModel({
      amountAvailable: createProductDto.amountAvailable,
      productName: createProductDto.productName,
      cost: createProductDto.cost,
      sellerId: user._id,
    });

    return createdProduct.save();
  }

  async getAllProducts(user: UserPublic): Promise<Product[]> {
    return this.productModel.find({ sellerId: user._id }).exec();
  }

  async getProduct(user: UserPublic, id: string): Promise<Product> {
    return this.productModel.findOne({ _id: id, sellerId: user._id });
  }

  async updateProduct(
    user: UserPublic,
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const allowedPropsToUpdate: ProductKeys[] = ['cost', 'productName'];

    const isUpdateAllowed = Object.keys(updateProductDto).every((prop) =>
      allowedPropsToUpdate.includes(prop as ProductKeys),
    );

    if (!isUpdateAllowed) {
      throw new HttpException(
        'Invalid properties to update',
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }

    return this.productModel.findOneAndUpdate(
      { _id: id, sellerId: user._id },
      updateProductDto,
    );
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
