/** Registered user */
export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

/** Product in inventory */
export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

/** Types of stock transaction */
export type TransactionType = "add" | "remove" | "initial";

/** A single stock-change record */
export interface Transaction {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  type: TransactionType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  timestamp: string;
}

/** Form data for creating a product */
export interface ProductFormData {
  sku: string;
  name: string;
  price: string;
  quantity: string;
}

/** Navigation param lists */
export type ProductStackParamList = {
  ProductList: undefined;
  AddProduct: undefined;
  ProductDetail: { productId: string };
};
