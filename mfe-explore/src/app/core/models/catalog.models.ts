export interface HomeData {
  bannerTitle: string;
  bannerSubtitle: string;
  featuredCategories: Category[];
  featuredProducts: Product[];
}

export interface Category {
  id: string;
  name: string;
  filter: string;
  imageUrl: string;
  description: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  color: string;
  motor: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  openingHours: string;
}

export type CategoryFilter = 'classic' | 'autonomous' | 'all';

export interface CatalogState {
  homeData: HomeData | null;
  products: Product[];
  stores: Store[];
  activeFilter: CategoryFilter;
  loading: boolean;
  error: string | null;
}
