import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import accountService, { LoginData, RegisterData, UserResponse } from "../services/accountService";
import { deleteCart, getCart, PostCart, selectedCart, updateCart } from "../services/cartSevices";
import { getProduct, detaiProduct } from "../services/productServices";
import { setConfig } from "../helper/setConfig";
import { ApiError } from "../services/apiClient";

type Double = number;

interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  stock: number;
  discountPercentage: number;
  thumbnail: string;
  slug: string;
}

interface CartProduct {
  _id: string; 
  titleProduct: string;
  price: number;
  thumbnail: string;
  discountPercentage: Double;
  quantity: number;
  product_id: string;
  stock: number;
  selected: boolean;
}

interface User {
  _id?: string;
  email?: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  token?: string;
}

interface StoreState {
  // Authentication state
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  cartId: string | null;

  // Products state
  products: Product[];
  currentProduct: Product | null;
  productsLoading: boolean;
  productsError: string | null;

  // Cart state
  cart: CartProduct[];
  cartLoading: boolean;
  cartError: string | null;
  selectedItems: { [key: string]: boolean };

  // Actions
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<ApiError | undefined>;
  logout: () => void;
  fetchProducts: () => Promise<void>;
  fetchProductDetail: (slug: string) => Promise<void>;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  toggleSelectCartItem: (productId: string) => Promise<void>;
  updateSelectedItems: (selected: { [key: string]: boolean }) => Promise<void>;
  clearErrors: () => void;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      cartId: null,

      products: [],
      currentProduct: null,
      productsLoading: false,
      productsError: null,

      cart: [],
      cartLoading: false,
      cartError: null,
      selectedItems: {},

      login: async (data: LoginData) => {
        set({ loading: true, error: null });
        try {
          const response = await accountService.login(data);
          if ('user' in response && response.token) {
            set({ 
              user: { 
                ...response.user, 
                token: response.token 
              }, 
              isAuthenticated: true, 
              loading: false,
              cartId: response.cartId || null
            });
            await AsyncStorage.setItem('token', response.token);
          } else {
            set({ 
              error: 'error' in response ? String(response.error) : 'Lỗi đăng nhập', 
              loading: false 
            });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Lỗi đăng nhập', 
            loading: false 
          });
        }
      },

      register: async (data: RegisterData) => {
        set({ loading: true, error: null });
        try {
          const response = await accountService.register(data);
          set({ loading: false });
          return response;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Lỗi đăng ký', 
            loading: false 
          });
        }
      },

      logout: () => {
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('cartId');
        set({ 
          user: null, 
          isAuthenticated: false, 
          cart: [],
          cartId: null
        });
      },

      fetchProducts: async () => {
        set({ productsLoading: true, productsError: null });
        try {
          const config = await setConfig();
          const response = await getProduct(config);
          
          if (response.data && response.data.products) {
            set({ 
              products: response.data.products,
              productsLoading: false
            });
          }
        } catch (error) {
          set({ 
            productsError: error instanceof Error ? error.message : 'Không thể lấy danh sách sản phẩm', 
            productsLoading: false 
          });
        }
      },

      fetchProductDetail: async (slug: string) => {
        set({ productsLoading: true, productsError: null });
        try {
          const config = await setConfig();
          const response = await detaiProduct(slug, config);
          
          if (response.data && response.data.product) {
            set({ 
              currentProduct: response.data.product,
              productsLoading: false
            });
          }
        } catch (error) {
          set({ 
            productsError: error instanceof Error ? error.message : 'Không thể lấy thông tin sản phẩm', 
            productsLoading: false 
          });
        }
      },

      // Cart actions
      fetchCart: async () => {
        set({ cartLoading: true, cartError: null });
        try {
          const config = await setConfig();
          const response = await getCart(config);
          
          if (response.data && response.data.cart) {
            const cartId = response.data.cart._id;
            await AsyncStorage.setItem('cartId', cartId);
            
            const cartProducts = response.data.cart.products || [];
            const selectedItems: { [key: string]: boolean } = {};
            
            cartProducts.forEach((item: CartProduct) => {
              selectedItems[item.product_id] = item.selected;
            });
            
            set({ 
              cart: cartProducts,
              cartId,
              selectedItems,
              cartLoading: false
            });
          }
        } catch (error) {
          set({ 
            cartError: error instanceof Error ? error.message : 'Không thể lấy giỏ hàng', 
            cartLoading: false 
          });
        }
      },

      addToCart: async (productId: string, quantity: number) => {
        set({ cartLoading: true, cartError: null });
        try {
          const config = await setConfig();
          await PostCart(productId, config, { quantity });
          await get().fetchCart();
        } catch (error) {
          set({ 
            cartError: error instanceof Error ? error.message : 'Khong thể thêm sản phẩm vào giỏ hàng', 
            cartLoading: false 
          });
        }
      },

      updateCartItem: async (productId: string, quantity: number) => {
        set({ cartLoading: true, cartError: null });
        try {
          const config = await setConfig();
          await updateCart(productId, config, { quantity });
          
          const updatedCart = get().cart.map(item => 
            item.product_id === productId 
              ? { ...item, quantity } 
              : item
          );
          
          set({ 
            cart: updatedCart,
            cartLoading: false 
          });
        } catch (error) {
          set({ 
            cartError: error instanceof Error ? error.message : 'Không thể cập nhật sản phẩm trong giỏ hàng', 
            cartLoading: false 
          });
        }
      },

      removeFromCart: async (productId: string) => {
        set({ cartLoading: true, cartError: null });
        try {
          const config = await setConfig();
          await deleteCart(productId, config);
          
          const updatedCart = get().cart.filter(item => item.product_id !== productId);
          
          set({ 
            cart: updatedCart,
            cartLoading: false 
          });
        } catch (error) {
          set({ 
            cartError: error instanceof Error ? error.message : 'Không thể xóa sản phẩm khỏi giỏ hàng', 
            cartLoading: false 
          });
        }
      },

      toggleSelectCartItem: async (productId: string) => {
        const currentSelectedItems = get().selectedItems;
        const newSelectedValue = !currentSelectedItems[productId];
        const updatedSelected = { ...currentSelectedItems, [productId]: newSelectedValue };
        
        try {
          await get().updateSelectedItems(updatedSelected);
        } catch (error) {
          set({ 
            cartError: error instanceof Error ? error.message : 'Không thể cập nhật trạng thái chọn sản phẩm', 
          });
        }
      },

      updateSelectedItems: async (selected: { [key: string]: boolean }) => {
        set({ selectedItems: selected, cartLoading: true });
        try {
          const productSelected = Object.entries(selected)
            .filter(([_, isSelected]) => isSelected)
            .map(([id]) => id);
          
          const config = await setConfig();
          await selectedCart(config, productSelected);
          
          // Update cart items with new selection state
          const updatedCart = get().cart.map(item => ({
            ...item,
            selected: !!selected[item.product_id]
          }));
          
          set({ 
            cart: updatedCart,
            cartLoading: false 
          });
        } catch (error) {
          set({ 
            cartError: error instanceof Error ? error.message : 'Không thể cập nhật trạng thái chọn sản phẩm', 
            cartLoading: false 
          });
        }
      },

      clearErrors: () => {
        set({ 
          error: null,
          productsError: null,
          cartError: null 
        });
      },
    }),
    {
      name: 'product-management-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        cartId: state.cartId,
      }),
    }
  )
);

export default useStore;