import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useApp } from "../../context/AppContext";
import type { Product } from "../../types";

interface Props {
  onAddProduct: () => void;
  onViewProduct: (productId: string) => void;
}

export const ProductListScreen: React.FC<Props> = ({
  onAddProduct,
  onViewProduct,
}) => {
  const { products } = useApp();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q),
    );
  }, [products, search]);

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-3 border border-slate-100 active:scale-[0.98]"
      style={{ maxWidth: 620, width: "100%", alignSelf: "center" }}
      onPress={() => onViewProduct(item.id)}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center">
        <View className="w-12 h-12 rounded-xl bg-indigo-50 items-center justify-center mr-3">
          <Text className="text-indigo-700 font-extrabold text-xs">
            {item.sku.slice(0, 3)}
          </Text>
        </View>

        <View className="flex-1">
          <Text className="text-slate-900 font-bold text-base">{item.name}</Text>
          <Text className="text-slate-400 text-xs mt-0.5 font-medium">
            SKU: {item.sku}  |  ${item.price.toFixed(2)}
          </Text>
        </View>

        <View className="items-end">
          <Text
            className={`text-xl font-extrabold ${
              item.quantity <= 5 ? "text-red-500" : "text-slate-900"
            }`}
          >
            {item.quantity}
          </Text>
          <Text className="text-slate-400 text-[10px] font-medium">in stock</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyList = () => (
    <View
      className="items-center justify-center pt-24 px-10"
      style={{ maxWidth: 620, width: "100%", alignSelf: "center" }}
    >
      <Text className="text-6xl mb-5">{"\u{1F4E6}"}</Text>
      <Text className="text-slate-900 text-xl font-extrabold text-center">
        No Products Yet
      </Text>
      <Text className="text-slate-400 text-sm text-center mt-2 leading-5">
        Add your first product to start{"\n"}tracking your inventory
      </Text>
      <TouchableOpacity
        className="bg-indigo-600 rounded-2xl px-8 py-3.5 mt-6 flex-row items-center"
        onPress={onAddProduct}
        activeOpacity={0.85}
      >
        <Text className="mr-2">{"\u{2795}"}</Text>
        <Text className="text-white font-bold text-sm">Add Product</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-indigo-600 pt-14 pb-7 px-5">
        <View
          className="flex-row items-center justify-between mb-4"
          style={{ maxWidth: 620, width: "100%", alignSelf: "center" }}
        >
          <Text className="text-white text-2xl font-extrabold">Products</Text>
          <TouchableOpacity
            className="bg-white rounded-xl px-5 py-2.5 flex-row items-center"
            onPress={onAddProduct}
            activeOpacity={0.85}
          >
            <Text className="mr-1.5">{"\u{2795}"}</Text>
            <Text className="text-indigo-600 font-bold text-sm">Add</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View
          className="flex-row items-center bg-white/15 rounded-2xl px-4"
          style={{ maxWidth: 620, width: "100%", alignSelf: "center" }}
        >
          <Text className="mr-3 text-base">{"\u{1F50D}"}</Text>
          <TextInput
            className="flex-1 py-3.5 text-base text-white"
            placeholder="Search by name or SKU..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Text className="text-white/50 font-bold text-lg">{"\u{2715}"}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Product count */}
      {products.length > 0 && (
        <View
          className="px-6 pt-4 pb-1"
          style={{ maxWidth: 620, width: "100%", alignSelf: "center" }}
        >
          <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wide">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            {search ? " found" : " total"}
          </Text>
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 24, paddingHorizontal: 20 }}
        ListEmptyComponent={<EmptyList />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ProductListScreen;
