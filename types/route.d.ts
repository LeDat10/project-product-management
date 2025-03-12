type RootStackParamList = {
  Home: undefined;
  About: undefined;
  Contact: undefined;
  // Feed: { sort: 'latest' | 'top' } | undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

declare module "*.png";
