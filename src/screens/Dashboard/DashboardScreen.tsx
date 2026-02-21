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
        <View style={{ maxWidth: 620, width: "100%", alignSelf: "center" }}>
          <Text className="text-indigo-200 text-sm font-medium text-center">Welcome back,</Text>
          <Text className="text-white text-2xl font-extrabold mt-1 text-center">
            {user?.fullName ?? "User"}
          </Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View className="px-5 -mt-6">
        <View
          className="flex-row gap-3 mb-3"
          style={{ maxWidth: 620, width: "100%", alignSelf: "center" }}
        >
          {/* Products */}
          <View className="flex-1 bg-white rounded-2xl p-5 border border-slate-100">
            <Text className="text-2xl mb-2">{"\u{1F4E6}"}</Text>
            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Products
            </Text>
            <Text className="text-slate-900 text-3xl font-extrabold mt-1">
              {totalProducts}
            </Text>
          </View>

          {/* Total Stock */}
          <View className="flex-1 bg-white rounded-2xl p-5 border border-slate-100">
            <Text className="text-2xl mb-2">{"\u{1F3F7}\uFE0F"}</Text>
            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Total Stock
            </Text>
            <Text className="text-slate-900 text-3xl font-extrabold mt-1">
              {totalStock}
            </Text>
          </View>
        </View>

        <View
          className="flex-row gap-3"
          style={{ maxWidth: 620, width: "100%", alignSelf: "center" }}
        >
          {/* Total Value */}
          <View className="flex-1 bg-white rounded-2xl p-5 border border-slate-100">
            <Text className="text-2xl mb-2">{"\u{1F4B0}"}</Text>
            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Total Value
            </Text>
            <Text className="text-indigo-600 text-2xl font-extrabold mt-1">
              ${totalValue.toFixed(2)}
            </Text>
          </View>

          {/* Low Stock */}
          <View className="flex-1 bg-white rounded-2xl p-5 border border-slate-100">
            <Text className="text-2xl mb-2">{"\u{26A0}\uFE0F"}</Text>
            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Low Stock
            </Text>
            <Text
              className={`text-3xl font-extrabold mt-1 ${
                lowStock > 0 ? "text-red-500" : "text-emerald-500"
              }`}
            >
              {lowStock}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-5 mt-7">
        <Text
          className="text-slate-900 text-lg font-extrabold mb-3"
          style={{ maxWidth: 620, width: "100%", alignSelf: "center" }}
        >
          Quick Actions
        </Text>

        <TouchableOpacity
          className="bg-indigo-600 rounded-2xl p-5 mb-3 flex-row items-center"
          style={{ maxWidth: 620, width: "100%", alignSelf: "center" }}
          onPress={onNavigateProducts}
          activeOpacity={0.85}
        >
          <View className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center mr-4">
            <Text className="text-xl">{"\u{2795}"}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-base">Add Product</Text>
            <Text className="text-indigo-200 text-sm mt-0.5">
              Register a new inventory item
            </Text>
          </View>
          <Text className="text-white/50 text-lg">{"\u{203A}"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white border-2 border-slate-100 rounded-2xl p-5 mb-3 flex-row items-center"
          style={{ maxWidth: 620, width: "100%", alignSelf: "center" }}
          onPress={onNavigateHistory}
          activeOpacity={0.85}
        >
          <View className="w-12 h-12 rounded-2xl bg-slate-50 items-center justify-center mr-4">
            <Text className="text-xl">{"\u{1F4CB}"}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-slate-900 font-bold text-base">
              Transaction History
            </Text>
            <Text className="text-slate-400 text-sm mt-0.5">
              {transactions.length} total transactions
            </Text>
          </View>
          <Text className="text-slate-300 text-lg">{"\u{203A}"}</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Products */}
      {products.length > 0 && (
        <View className="px-5 mt-5 mb-8">
          <Text
            className="text-slate-900 text-lg font-extrabold mb-3"
            style={{ maxWidth: 620, width: "100%", alignSelf: "center" }}
          >
            Recent Products
          </Text>
          {products.slice(0, 3).map((p) => (
            <View
              key={p.id}
              className="bg-white rounded-2xl p-4 mb-2 flex-row items-center border border-slate-100"
              style={{ maxWidth: 620, width: "100%", alignSelf: "center" }}
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
