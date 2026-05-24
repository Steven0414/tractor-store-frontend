export interface ProductVariant {
  sku: string;
  color: string;
  motor: string;
  price: number;
  imageUrl: string;
  stock: number;
}

export interface ProductDetail {
  id: string;
  name: string;
  description: string;
  category: string;
  variants: ProductVariant[];
}

export interface ProductDetailState {
  product: ProductDetail | null;
  selectedSku: string | null;
  loading: boolean;
  error: string | null;
}
