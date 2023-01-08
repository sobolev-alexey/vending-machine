import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';

import { UsersService } from './users.service';
import { User, UserSchema } from './user.schema';
import { Product, ProductSchema } from '../products/products.schema';
import { UserStub } from '../../test/stubs/UserStub';

describe('UsersService', () => {
  let userModel: Model<User>;
  let productModel: Model<Product>;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let service: UsersService;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;

    productModel = mongoConnection.model(Product.name, ProductSchema);
    userModel = mongoConnection.model(User.name, UserSchema);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
        {
          provide: getModelToken(Product.name),
          useValue: productModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUser', () => {
    it('should get user profile', async () => {
      const withUser = UserStub({});

      await new userModel({
        ...withUser,
        password: 'test',
      }).save();

      const user = await service.getUser(withUser);

      expect(user._id).toStrictEqual(withUser._id);
      expect(user.username).toBe(withUser.username);
      expect(user.deposit).toBe(0);
      expect(user.role).toBe(withUser.role);
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const withUser = UserStub({});

      await new userModel({
        ...withUser,
        password: 'password',
      }).save();

      await service.updateUser(withUser, {
        username: 'Bob',
      });
      const updatedUser = await userModel.findById(withUser._id);

      expect(updatedUser.username).toBe('Bob');
    });
  });

  describe('deleteUser', () => {
    it('should delete user profile', async () => {
      const withUser = UserStub({});

      await new userModel({
        ...withUser,
        password: 'password',
      }).save();

      await service.deleteUser(withUser);
      const deletedUser = await userModel.findById(withUser._id);

      expect(deletedUser).toBe(null);
    });
  });

  describe('deposit to account', () => {
    it('should deposit 150 coins into users account', async () => {
      const withUser = UserStub({
        deposit: 50,
      });

      await new userModel({
        ...withUser,
        password: 'password',
      }).save();

      await service.depositToUserWallet(withUser, {
        deposit: 150,
      });

      const updatedUser = await userModel.findById(withUser._id);

      expect(updatedUser.deposit).toBe(200);
    });
  });

  describe('reset user balance', () => {
    it('should reset user balance', async () => {
      const withUser = UserStub({
        deposit: 225,
      });

      await new userModel({
        ...withUser,
        password: 'password',
      }).save();

      await service.resetUserWallet(withUser);
      const updatedUser = await userModel.findById(withUser._id);

      expect(updatedUser.deposit).toBe(0);
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
