export const calcPrice = (price: number, discount: number): number => {
  const priceNew: number = parseFloat(
    (price - (price * discount) / 100).toFixed(2)
  );
  return priceNew;
};
