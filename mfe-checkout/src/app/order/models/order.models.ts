export interface OrderItem {
  sku: string;
  name: string;
  quantity: number;
  price: number;
}

export interface PlaceOrderRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: string;
  items: OrderItem[];
}

export interface PlaceOrderResponse {
  orderId: string;
  status: string;
  total: number;
}

export interface ProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
}

export interface OrderState {
  loading: boolean;
  error: ProblemDetail | null;
  confirmed: boolean;
  orderId: string | null;
  total: number | null;
}
