export type Product = {
  amountAvailable: number;
  cost: number;
  productName: string;
  image: string;
  shelfLocation: string;
  sellerId: string;
  _id: string;
};

export type ProductProps = {
  cost: number;
  code: string;
  id: string;
  image: string;
  dispensingId: string | null;
};