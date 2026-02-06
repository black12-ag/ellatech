import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { User, Product, Transaction, TransactionType } from "../types";

/* ── helpers ─────────────────────────────────────────────── */
const uid = () => `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
const now = () => new Date().toISOString();

/* ── context shape ───────────────────────────────────────── */
interface AppState {
  /* user */
  user: User | null;
  registerUser: (email: string, fullName: string) => { success: boolean; error?: string };
  logout: () => void;

  /* products */
  products: Product[];
  addProduct: (sku: string, name: string, price: number, qty: number) => { success: boolean; error?: string };
  adjustStock: (productId: string, type: TransactionType, qty: number) => { success: boolean; error?: string };
  getProduct: (id: string) => Product | undefined;

  /* transactions */
  transactions: Transaction[];
  getProductTransactions: (productId: string) => Transaction[];
}

const AppContext = createContext<AppState | null>(null);

/* ── provider ────────────────────────────────────────────── */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  /* ── user ─── */
  const registerUser = useCallback((email: string, fullName: string) => {
    if (!email.includes("@")) return { success: false, error: "Invalid email address" };
    if (fullName.trim().length < 2) return { success: false, error: "Name must be at least 2 characters" };

    setUser({ id: uid(), email: email.trim(), fullName: fullName.trim(), createdAt: now() });
    return { success: true };
  }, []);

  const logout = useCallback(() => setUser(null), []);

  /* ── products ─── */
  const addProduct = useCallback(
    (sku: string, name: string, price: number, qty: number) => {
      const duplicate = products.find(
        (p) => p.sku.toLowerCase() === sku.toLowerCase(),
      );
      if (duplicate) return { success: false, error: `SKU "${sku}" already exists` };
      if (price <= 0) return { success: false, error: "Price must be greater than 0" };
      if (qty < 0) return { success: false, error: "Quantity cannot be negative" };

      const ts = now();
      const product: Product = {
        id: uid(),
        sku: sku.trim().toUpperCase(),
        name: name.trim(),
        price,
        quantity: qty,
        createdAt: ts,
        updatedAt: ts,
      };

      setProducts((prev) => [product, ...prev]);

      /* log the initial stock as a transaction */
      if (qty > 0) {
        const txn: Transaction = {
          id: uid(),
          productId: product.id,
          productName: product.name,
          productSku: product.sku,
          type: "initial",
          quantity: qty,
          previousQuantity: 0,
          newQuantity: qty,
          timestamp: ts,
        };
        setTransactions((prev) => [txn, ...prev]);
      }

      return { success: true };
    },
    [products],
  );

  const adjustStock = useCallback(
    (productId: string, type: TransactionType, qty: number) => {
      if (qty <= 0) return { success: false, error: "Quantity must be greater than 0" };

      const product = products.find((p) => p.id === productId);
      if (!product) return { success: false, error: "Product not found" };

      const prevQty = product.quantity;
      const newQty = type === "add" ? prevQty + qty : prevQty - qty;

      if (newQty < 0) return { success: false, error: "Stock cannot go below 0" };

      const ts = now();
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, quantity: newQty, updatedAt: ts } : p,
        ),
      );

      const txn: Transaction = {
        id: uid(),
        productId,
        productName: product.name,
        productSku: product.sku,
        type,
        quantity: qty,
        previousQuantity: prevQty,
        newQuantity: newQty,
        timestamp: ts,
      };
      setTransactions((prev) => [txn, ...prev]);

      return { success: true };
    },
    [products],
  );

  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products],
  );

  const getProductTransactions = useCallback(
    (productId: string) => transactions.filter((t) => t.productId === productId),
    [transactions],
  );

  /* ── memo ─── */
  const value = useMemo<AppState>(
    () => ({
      user,
      registerUser,
      logout,
      products,
      addProduct,
      adjustStock,
      getProduct,
      transactions,
      getProductTransactions,
    }),
    [
      user,
      registerUser,
      logout,
      products,
      addProduct,
      adjustStock,
      getProduct,
      transactions,
      getProductTransactions,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/* ── hook ─────────────────────────────────────────────────── */
export const useApp = (): AppState => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
};
