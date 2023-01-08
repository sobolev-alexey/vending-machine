import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';

import { ProductsService } from './products.service';
import { Product, ProductSchema } from './products.schema';
import { User, UserSchema } from '../users/user.schema';
import { UserRoles } from '../types';
import { UserStub } from '../../test/stubs/UserStub';
import { ProductStub } from '../../test/stubs/ProductStub';

describe('UsersService', () => {
  let userModel: Model<User>;
  let productModel: Model<Product>;
  let service: ProductsService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;

    productModel = mongoConnection.model(Product.name, ProductSchema);
    userModel = mongoConnection.model(User.name, UserSchema);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: productModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProduct', () => {
    it('should get existing product', async () => {
      const withTestProduct = ProductStub();
      const createdProduct = await new productModel({
        ...withTestProduct,
      }).save();

      const product = await service.getProduct(createdProduct._id.toString());

      expect(product.productName).toBe(withTestProduct.productName);
      expect(product.cost).toBe(withTestProduct.cost);
    });

    it('should handle non-existing product', async () => {
      const product = await service.getProduct('63b9a199d98dc161bced8a68');
      expect(product).toBe(null);
    });
  });

  describe('addProduct', () => {
    it('should create new products', async () => {
      const withUser = UserStub({ role: UserRoles.seller });
      const withTestProduct = ProductStub();
      const products = await service.createProducts(withUser, [
        withTestProduct,
      ]);
      const product = products?.[0];

      expect(product.productName).toBe(withTestProduct.productName);
      expect(product.cost).toBe(withTestProduct.cost);
      expect(product.sellerId).toBe(withUser._id);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const withUser = UserStub({ role: UserRoles.seller });
      const withProduct = ProductStub();
      const createdProduct = await new productModel({
        ...withProduct,
        sellerId: withUser._id,
      }).save();

      await service.updateProduct(withUser, createdProduct._id.toString(), {
        productName: 'Tea',
      });

      const updatedProduct = await productModel.findById(createdProduct._id);

      expect(updatedProduct.productName).toBe('Tea');
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const withUser = UserStub({ role: UserRoles.seller });
      const withProduct = ProductStub();
      const createdProduct = await new productModel({
        ...withProduct,
        sellerId: withUser._id,
      }).save();

      await service.deleteProduct(withUser, createdProduct._id.toString());

      const deletedProduct = await productModel.findById(createdProduct._id);

      expect(deletedProduct).toBe(null);
    });
  });

  describe('buyProduct', () => {
    it('should buy a product and return change', async () => {
      const withUser = UserStub({
        deposit: 435,
      });
      const withProduct = ProductStub();

      await new userModel({ ...withUser, password: 'password' }).save();
      const createdProduct = await new productModel({
        ...withProduct,
        sellerId: withUser._id,
      }).save();

      const purchaseProductResult = await service.buyProduct(
        withUser,
        createdProduct._id.toString(),
        {
          quantity: 1,
        },
      );

      const purchasedProduct = await productModel.findById(createdProduct._id);

      expect(purchasedProduct.amountAvailable).toBe(
        withProduct.amountAvailable - 1,
      );
      expect(purchaseProductResult).toMatchObject({
        change: [0, 0, 1, 0, 3],
        totalSpent: withProduct.cost,
        productId: createdProduct._id,
        productName: withProduct.productName,
        quantity: 1,
      });
    });

    it('should throw an error when deposit is less than product price', async () => {
      const withUser = UserStub({
        deposit: 15,
      });
      const withProduct = ProductStub();

      await new userModel({ ...withUser, password: 'password' }).save();
      const createdProduct = await new productModel({
        ...withProduct,
        sellerId: withUser._id,
      }).save();

      await expect(
        service.buyProduct(withUser, createdProduct._id.toString(), {
          quantity: 1,
        }),
      ).rejects.toThrow(
        new HttpException('Insufficient funds', HttpStatus.CONFLICT),
      );
    });

    it('should throw an error when available quantity is less than desired quantity', async () => {
      const withUser = UserStub({
        deposit: 9999,
      });
      const withProduct = ProductStub();

      await new userModel({ ...withUser, password: 'password' }).save();
      const createdProduct = await new productModel({
        ...withProduct,
        sellerId: withUser._id,
      }).save();

      await expect(
        service.buyProduct(withUser, createdProduct._id.toString(), {
          quantity: 10,
        }),
      ).rejects.toThrow(
        new HttpException('Insufficient product quantity', HttpStatus.CONFLICT),
      );
    });
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });
});
