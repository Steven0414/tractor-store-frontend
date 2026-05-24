export interface InventoryStatus {
  sku: string;
  quantity: number;
  available: boolean;
}

export interface InventoryState {
  sku: string | null;
  quantity: number;
  available: boolean;
  loading: boolean;
  error: string | null;
}
