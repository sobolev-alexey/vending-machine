import { Product } from '../../src/products/products.schema';
import { UserStub } from './UserStub';

export const ProductStub = (): Product => {
  const withUser = UserStub({});
  return {
    productName: 'Sparkling Water',
    cost: 115,
    amountAvailable: 5,
    image: 'water',
    shelfLocation: 'A2',
    sellerId: withUser,
  };
};
