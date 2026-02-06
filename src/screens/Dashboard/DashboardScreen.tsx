import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useApp } from "../../context/AppContext";

interface Props {
  onNavigateProducts: () => void;
  onNavigateHistory: () => void;
}

export const DashboardScreen: React.FC<Props> = ({
  onNavigateProducts,
  onNavigateHistory,
}) => {
  const { user, products, transactions } = useApp();

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const lowStock = products.filter((p) => p.quantity <= 5).length;

  return (
    <ScrollView className="flex-1 bg-slate-50" showsVerticalScrollIndicator={false}>
      {/* Greeting header */}
      <View className="bg-indigo-600 pt-14 pb-10 px-6">
        <Text className="text-indigo-200 text-sm font-medium">Welcome back,</Text>
        <Text className="text-white text-2xl font-extrabold mt-1">
          {user?.fullName ?? "User"}
        </Text>
      </View>

      {/* Stats Grid */}
      <View className="px-5 -mt-6">
        <View className="flex-row gap-3 mb-3">
          <View className="flex-1 bg-white rounded-2xl p-5 shadow-sm shadow-slate-200 border border-slate-100">
            <View className="w-10 h-10 rounded-xl bg-indigo-50 items-center justify-center mb-3">
              <Text className="text-indigo-600 font-black text-sm">P</Text>
            </View>
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wide">
              Products
            </Text>
            <Text className="text-slate-900 text-3xl font-extrabold mt-1">{totalProducts}</Text>
          </View>

          <View className="flex-1 bg-white rounded-2xl p-5 shadow-sm shadow-slate-200 border border-slate-100">
            <View className="w-10 h-10 rounded-xl bg-emerald-50 items-center justify-center mb-3">
              <Text className="text-emerald-600 font-black text-sm">#</Text>
            </View>
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wide">
              Total Stock
            </Text>
            <Text className="text-slate-900 text-3xl font-extrabold mt-1">{totalStock}</Text>
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 bg-white rounded-2xl p-5 shadow-sm shadow-slate-200 border border-slate-100">
            <View className="w-10 h-10 rounded-xl bg-amber-50 items-center justify-center mb-3">
              <Text className="text-amber-600 font-black text-sm">$</Text>
            </View>
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wide">
              Total Value
            </Text>
            <Text className="text-indigo-600 text-2xl font-extrabold mt-1">
              ${totalValue.toFixed(2)}
            </Text>
          </View>

          <View className="flex-1 bg-white rounded-2xl p-5 shadow-sm shadow-slate-200 border border-slate-100">
            <View className="w-10 h-10 rounded-xl bg-red-50 items-center justify-center mb-3">
              <Text className="text-red-500 font-black text-sm">!</Text>
            </View>
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wide">
              Low Stock
            </Text>
            <Text
              className={`text-3xl font-extrabold mt-1 ${lowStock > 0 ? "text-red-500" : "text-emerald-500"}`}
            >
              {lowStock}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-5 mt-7">
        <Text className="text-slate-900 text-lg font-extrabold mb-3">Quick Actions</Text>

        <TouchableOpacity
          className="bg-indigo-600 rounded-2xl p-5 mb-3 flex-row items-center shadow-lg shadow-indigo-500/20"
          onPress={onNavigateProducts}
          activeOpacity={0.85}
        >
          <View className="w-12 h-12 rounded-xl bg-white/20 items-center justify-center mr-4">
            <Text className="text-white text-xl font-extrabold">+</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-base">Add Product</Text>
            <Text className="text-indigo-200 text-sm mt-0.5">
              Register a new inventory item
            </Text>
          </View>
          <Text className="text-white/60 font-bold text-lg">{"->"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white border-2 border-slate-100 rounded-2xl p-5 mb-3 flex-row items-center"
          onPress={onNavigateHistory}
          activeOpacity={0.85}
        >
          <View className="w-12 h-12 rounded-xl bg-slate-100 items-center justify-center mr-4">
            <Text className="text-slate-600 text-lg font-extrabold">=</Text>
          </View>
          <View className="flex-1">
            <Text className="text-slate-900 font-bold text-base">
              Transaction History
            </Text>
            <Text className="text-slate-400 text-sm mt-0.5">
              {transactions.length} total transactions
            </Text>
          </View>
          <Text className="text-slate-300 font-bold text-lg">{"->"}</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Products */}
      {products.length > 0 && (
        <View className="px-5 mt-5 mb-8">
          <Text className="text-slate-900 text-lg font-extrabold mb-3">
            Recent Products
          </Text>
          {products.slice(0, 3).map((p) => (
            <View
              key={p.id}
              className="bg-white rounded-2xl p-4 mb-2 flex-row items-center border border-slate-100"
            >
              <View className="w-11 h-11 rounded-xl bg-indigo-50 items-center justify-center mr-3">
                <Text className="text-indigo-700 font-extrabold text-xs">
                  {p.sku.slice(0, 3)}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-slate-900 font-bold">{p.name}</Text>
                <Text className="text-slate-400 text-xs mt-0.5">SKU: {p.sku}</Text>
              </View>
              <View className="items-end">
                <Text className="text-slate-900 font-extrabold text-lg">{p.quantity}</Text>
                <Text className="text-slate-400 text-[10px] font-medium">in stock</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View className="h-8" />
    </ScrollView>
  );
};

export default DashboardScreen;
