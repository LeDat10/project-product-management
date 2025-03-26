type RootStackParamList = {
  Home: undefined;
  About: undefined;
  Contact: undefined;
  Vegetable: undefined;
  Bakery: undefined;
  App: undefined;
  Milk: undefined;
  Snack: undefined;
  Meat: undefined;
  Drink: undefined;
  Cleaning: undefined;
  Care: undefined;
  product: undefined;
  cart: undefined;
  menu: undefined;
  login: undefined;
  register: undefined;
  account: undefined;
  "detail-product":
    | {
        id: string;
        // title: string;
        // price: number;
        // thumbnail: string;
        // description: string;
        // images: Array;
        // stock: number;
        // discountPercentage: Double;
      }
    | undefined;
  // Feed: { sort: 'latest' | 'top' } | undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

declare module "*.png";
