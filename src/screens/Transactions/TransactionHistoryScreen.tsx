import React, { useState, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useApp } from "../../context/AppContext";
import type { Transaction } from "../../types";

const PAGE_SIZE = 10;

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const typeLabel = (t: Transaction) => {
  switch (t.type) {
    case "initial": return "Initial Stock";
    case "add":     return "Stock Added";
    case "remove":  return "Stock Removed";
  }
};

export const TransactionHistoryScreen: React.FC = () => {
  const { transactions } = useApp();
  const [page, setPage] = useState(1);

  const paginated = useMemo(
    () => transactions.slice(0, page * PAGE_SIZE),
    [transactions, page],
  );

  const hasMore = paginated.length < transactions.length;

  const renderItem = ({ item }: { item: Transaction }) => (
    <View className="bg-white rounded-2xl p-4 mb-3 mx-5 border border-slate-100">
      <View className="flex-row items-center">
        <View
          className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
            item.type === "remove" ? "bg-red-50" : "bg-emerald-50"
          }`}
        >
          <Text className="text-base">
            {item.type === "remove" ? "\u{1F53D}" : "\u{1F53C}"}
          </Text>
        </View>

        <View className="flex-1">
          <Text className="text-slate-900 font-bold text-sm">{item.productName}</Text>
          <Text className="text-slate-400 text-xs mt-0.5 font-medium">
            {item.productSku}  |  {typeLabel(item)}
          </Text>
        </View>

        <View className="items-end">
          <Text
            className={`font-extrabold text-base ${
              item.type === "remove" ? "text-red-500" : "text-emerald-500"
            }`}
          >
            {item.type === "remove" ? "-" : "+"}
            {item.quantity}
          </Text>
          <Text className="text-slate-400 text-[10px] font-medium">
            {formatDate(item.timestamp)}
          </Text>
        </View>
      </View>

      <View className="mt-3 pt-3 border-t border-slate-50 flex-row">
        <Text className="text-slate-400 text-xs font-medium flex-1">
          Qty: {item.previousQuantity} {"\u{2192}"} {item.newQuantity}
        </Text>
      </View>
    </View>
  );

  const EmptyList = () => (
    <View className="items-center justify-center pt-24 px-10">
      <Text className="text-6xl mb-5">{"\u{1F4CB}"}</Text>
      <Text className="text-slate-900 text-xl font-extrabold text-center">
        No Transactions Yet
      </Text>
      <Text className="text-slate-400 text-sm text-center mt-2 leading-5">
        Stock changes will appear here once{"\n"}you add products and adjust stock
      </Text>
    </View>
  );

  const Footer = () =>
    hasMore ? (
      <TouchableOpacity
        className="mx-5 mb-6 py-3.5 bg-indigo-50 rounded-2xl items-center flex-row justify-center"
        onPress={() => setPage((p) => p + 1)}
        activeOpacity={0.8}
      >
        <Text className="mr-2">{"\u{1F504}"}</Text>
        <Text className="text-indigo-600 font-bold text-sm">Load More</Text>
      </TouchableOpacity>
    ) : transactions.length > 0 ? (
      <View className="items-center mb-6 py-3">
        <Text className="text-slate-300 text-xs font-medium">
          {"\u{2705}"} All {transactions.length} transactions shown
        </Text>
      </View>
    ) : null;

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-indigo-600 pt-14 pb-7 px-5">
        <View className="flex-row items-center">
          <Text className="text-2xl mr-3">{"\u{1F4CB}"}</Text>
          <View>
            <Text className="text-white text-2xl font-extrabold">Transactions</Text>
            <Text className="text-indigo-200 text-sm mt-0.5 font-medium">
              {transactions.length} total stock change{transactions.length !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={paginated}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
        ListEmptyComponent={<EmptyList />}
        ListFooterComponent={<Footer />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default TransactionHistoryScreen;
