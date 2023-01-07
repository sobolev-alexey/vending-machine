import { Price, ProductAnimation } from ".";

type ProductProps = {
  cost: number;
  code: string;
  id: string;
  image: string;
  dispensingId: string | null;
};

function Product({
  cost,
  code,
  id,
  image,
  dispensingId,
}: ProductProps) {
  return (
    <div className="product">
      <div className="productImageContainer">
        <div
          className="productImage"
          style={{ backgroundImage: `url("${image}")` }}
        />

        {dispensingId === id ? (
          <ProductAnimation
            className="productImage dispensing"
            maxOffsetY={576}
            image={image}
          />
        ) : null}
      </div>
      <div className="productDetails">
        <Price value={cost / 100} />
        {
          cost ? <> - {code}</> : null
        }
      </div>
    </div>
  );
}

export default Product;