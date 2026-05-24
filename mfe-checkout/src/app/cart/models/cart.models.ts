export interface CartItem {
  sku: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  total: number;
}

export interface MiniCart {
  itemCount: number;
  total: number;
}

export interface AddCartItemRequest {
  sku: string;
  name: string;
  quantity: number;
  price: number;
}

export interface CartState {
  miniCart: MiniCart | null;
  loading: boolean;
  error: string | null;
}
