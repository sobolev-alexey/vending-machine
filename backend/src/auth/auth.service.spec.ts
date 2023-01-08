import { JwtModule, JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';

import { AuthService } from './auth.service';
import { User, UserSchema } from '../users/user.schema';
import { UserStub } from '../../test/stubs/UserStub';

const JWT_SECRET = 'SECRET';

UserSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  if (!user.isModified('password')) return next();
  const hashedPassword = await bcrypt.hash(user.password, 8);
  user.password = hashedPassword;

  next();
});

describe('AuthService', () => {
  let userModel: Model<User>;
  let service: AuthService;
  let jwtService: JwtService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    userModel = mongoConnection.model(User.name, UserSchema);

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secretOrPrivateKey: JWT_SECRET,
          signOptions: {
            expiresIn: 3600,
          },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registration', () => {
    it('should register a new user', async () => {
      const username = 'Alex Fisher';
      const password = 'password';
      const newUser = await service.register({
        username,
        password,
      });

      const user = await userModel.findById(newUser._id).select('+password');

      expect(user.username).toBe(username);
      expect(await bcrypt.compare(password, user.password)).toBe(true);
    });

    it('should throw an error if user already registered', async () => {
      const withUser = UserStub({});
      await new userModel({
        ...withUser,
        password: 'password',
      }).save();

      await expect(
        service.register({
          username: withUser.username,
          password: 'password',
        }),
      ).rejects.toThrow(
        new HttpException('User already exists', HttpStatus.CONFLICT),
      );
    });
  });

  describe('login', () => {
    it('should log in successfully', async () => {
      const withUser = UserStub({});
      const password = 'password';
      await new userModel({
        ...withUser,
        password,
      }).save();

      const user: any = await service.validateUser(withUser.username, password);
      expect(user.password).toBeUndefined();
      expect(user.username).toBe(withUser.username);

      const result = await service.login(user);
      const jwt: any = jwtService.decode(result.access_token);

      expect(jwt.id).toBe(withUser._id.toString());
      expect(jwt.username).toBe(withUser.username);
    });

    it('should not login with wrong password', async () => {
      const withUser = UserStub({});
      const password = 'password';
      await new userModel({
        ...withUser,
        password,
      }).save();

      const user: any = await service.validateUser(
        withUser.username,
        'wrong_password',
      );
      expect(user).toBeNull();
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
