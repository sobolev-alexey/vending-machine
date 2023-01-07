type PriceProps = {
  value: number;
};

function Price({ value }: PriceProps) {
  const formatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  });
  return <span>{value ? formatter.format(value) : ' '}</span>;
}

export default Price;