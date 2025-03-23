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
  account: undefined;
  menu: undefined;
  longin: undefined;
  register: undefined;
  // Feed: { sort: 'latest' | 'top' } | undefined;
};

type Product = {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

declare module "*.png";
