import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useApp } from "../../context/AppContext";
import type { TransactionType } from "../../types";

interface Props {
  productId: string;
  onBack: () => void;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const ProductDetailScreen: React.FC<Props> = ({ productId, onBack }) => {
  const { getProduct, adjustStock, getProductTransactions } = useApp();
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustType, setAdjustType] = useState<TransactionType>("add");

  const product = getProduct(productId);
  const productTxns = useMemo(
    () => getProductTransactions(productId),
    [getProductTransactions, productId],
  );

  if (!product) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center px-8">
        <Text className="text-slate-400 text-lg font-semibold">Product not found</Text>
        <TouchableOpacity
          className="mt-5 bg-indigo-600 rounded-xl px-6 py-3"
          onPress={onBack}
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleAdjust = () => {
    const qty = parseInt(adjustQty, 10);
    if (!adjustQty.trim() || isNaN(qty) || qty <= 0) {
      Alert.alert("Invalid Input", "Enter a quantity greater than 0");
      return;
    }
    const result = adjustStock(productId, adjustType, qty);
    if (!result.success) {
      Alert.alert("Error", result.error ?? "Failed to adjust stock");
      return;
    }
    Alert.alert(
      "Stock Updated",
      `${adjustType === "add" ? "Added" : "Removed"} ${qty} unit${qty > 1 ? "s" : ""} successfully`,
    );
    setAdjustQty("");
  };

  return (
    <ScrollView className="flex-1 bg-slate-50" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="bg-indigo-600 pt-14 pb-8 px-5">
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          className="flex-row items-center mb-3"
        >
          <Text className="text-indigo-200 text-base font-semibold">{"<-"} Back</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl font-extrabold">{product.name}</Text>
        <View className="bg-white/15 self-start px-3 py-1 rounded-lg mt-2">
          <Text className="text-white text-sm font-bold">SKU: {product.sku}</Text>
        </View>
      </View>

      {/* Status Card */}
      <View className="px-5 -mt-4">
        <View className="bg-white rounded-2xl p-5 shadow-sm shadow-slate-200 border border-slate-100 mb-4">
          <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">
            Product Status
          </Text>

          <View className="flex-row mb-4">
            <View className="flex-1">
              <Text className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                SKU
              </Text>
              <Text className="text-base font-extrabold text-slate-900 mt-1">
                {product.sku}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                Price
              </Text>
              <Text className="text-base font-extrabold text-indigo-600 mt-1">
                ${product.price.toFixed(2)}
              </Text>
            </View>
          </View>

          <View className="flex-row">
            <View className="flex-1">
              <Text className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                Quantity
              </Text>
              <Text
                className={`text-3xl font-extrabold mt-1 ${
                  product.quantity <= 5 ? "text-red-500" : "text-emerald-500"
                }`}
              >
                {product.quantity}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                Last Updated
              </Text>
              <Text className="text-sm font-bold text-slate-600 mt-1">
                {formatDate(product.updatedAt)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Adjust Stock */}
      <View className="px-5 mb-6">
        <Text className="text-slate-900 text-lg font-extrabold mb-3">Adjust Stock</Text>

        <View className="bg-white rounded-2xl p-5 shadow-sm shadow-slate-200 border border-slate-100">
          {/* Type Toggle */}
          <View className="flex-row bg-slate-100 rounded-xl p-1 mb-4">
            <TouchableOpacity
              className={`flex-1 py-3 rounded-lg items-center ${
                adjustType === "add" ? "bg-emerald-500 shadow-sm shadow-emerald-500/30" : ""
              }`}
              onPress={() => setAdjustType("add")}
              activeOpacity={0.8}
            >
              <Text
                className={`font-bold ${
                  adjustType === "add" ? "text-white" : "text-slate-400"
                }`}
              >
                + Add Stock
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 rounded-lg items-center ${
                adjustType === "remove" ? "bg-red-500 shadow-sm shadow-red-500/30" : ""
              }`}
              onPress={() => setAdjustType("remove")}
              activeOpacity={0.8}
            >
              <Text
                className={`font-bold ${
                  adjustType === "remove" ? "text-white" : "text-slate-400"
                }`}
              >
                - Remove
              </Text>
            </TouchableOpacity>
          </View>

          {/* Qty Input */}
          <TextInput
            className="bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-4 text-lg text-slate-800 mb-4 text-center font-bold"
            placeholder="Enter quantity"
            placeholderTextColor="#94a3b8"
            value={adjustQty}
            onChangeText={setAdjustQty}
            keyboardType="number-pad"
          />

          <TouchableOpacity
            className={`rounded-2xl py-4 items-center shadow-lg ${
              adjustType === "add"
                ? "bg-emerald-500 shadow-emerald-500/30"
                : "bg-red-500 shadow-red-500/30"
            }`}
            onPress={handleAdjust}
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold text-base">
              {adjustType === "add" ? "Add to Stock" : "Remove from Stock"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Product Transaction History */}
      {productTxns.length > 0 && (
        <View className="px-5 mb-8">
          <Text className="text-slate-900 text-lg font-extrabold mb-3">History</Text>
          {productTxns.map((txn) => (
            <View
              key={txn.id}
              className="bg-white rounded-xl p-4 mb-2 flex-row items-center border border-slate-100"
            >
              <View
                className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                  txn.type === "remove" ? "bg-red-50" : "bg-emerald-50"
                }`}
              >
                <Text className={`font-extrabold ${
                  txn.type === "remove" ? "text-red-500" : "text-emerald-500"
                }`}>
                  {txn.type === "remove" ? "-" : "+"}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-slate-900 font-semibold text-sm">
                  {txn.type === "initial"
                    ? "Initial Stock"
                    : txn.type === "add"
                      ? "Stock Added"
                      : "Stock Removed"}
                </Text>
                <Text className="text-slate-400 text-xs mt-0.5 font-medium">
                  {formatDate(txn.timestamp)}
                </Text>
              </View>
              <View className="items-end">
                <Text
                  className={`font-extrabold ${
                    txn.type === "remove" ? "text-red-500" : "text-emerald-500"
                  }`}
                >
                  {txn.type === "remove" ? "-" : "+"}
                  {txn.quantity}
                </Text>
                <Text className="text-slate-400 text-[10px] font-medium">
                  {txn.previousQuantity} {"->"} {txn.newQuantity}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View className="h-6" />
    </ScrollView>
  );
};

export default ProductDetailScreen;
