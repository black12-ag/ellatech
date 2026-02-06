import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { DashboardScreen } from "../screens/Dashboard/DashboardScreen";
import { ProductListScreen } from "../screens/Products/ProductListScreen";
import { AddProductScreen } from "../screens/Products/AddProductScreen";
import { ProductDetailScreen } from "../screens/Products/ProductDetailScreen";
import { TransactionHistoryScreen } from "../screens/Transactions/TransactionHistoryScreen";
import { ProfileScreen } from "../screens/Profile/ProfileScreen";

type Tab = "dashboard" | "products" | "history" | "profile";
type ProductSubScreen = "list" | "add" | { detail: string };

/* ── Tab bar button ─────────────────────────────────────── */
const TabButton: React.FC<{
  label: string;
  emoji: string;
  active: boolean;
  onPress: () => void;
}> = ({ label, emoji, active, onPress }) => (
  <TouchableOpacity
    className="flex-1 items-center pt-2 pb-1"
    onPress={onPress}
    activeOpacity={0.6}
  >
    <Text className={`text-[22px] mb-1 ${active ? "opacity-100" : "opacity-30"}`}>
      {emoji}
    </Text>
    <Text
      className={`text-[10px] font-semibold ${
        active ? "text-indigo-600" : "text-slate-400"
      }`}
    >
      {label}
    </Text>
    {active && (
      <View className="w-1 h-1 rounded-full bg-indigo-600 mt-1" />
    )}
  </TouchableOpacity>
);

/* ── Main navigator ─────────────────────────────────────── */
interface Props {
  onLogout: () => void;
}

export const AppNavigator: React.FC<Props> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [productScreen, setProductScreen] = useState<ProductSubScreen>("list");

  const goProducts = useCallback(() => {
    setActiveTab("products");
    setProductScreen("list");
  }, []);

  const goAddProduct = useCallback(() => {
    setProductScreen("add");
    setActiveTab("products");
  }, []);

  const goProductDetail = useCallback((id: string) => {
    setProductScreen({ detail: id });
  }, []);

  const goProductList = useCallback(() => {
    setProductScreen("list");
  }, []);

  const goHistory = useCallback(() => {
    setActiveTab("history");
  }, []);

  const renderScreen = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardScreen
            onNavigateProducts={goAddProduct}
            onNavigateHistory={goHistory}
          />
        );
      case "products":
        if (productScreen === "add")
          return <AddProductScreen onBack={goProductList} />;
        if (typeof productScreen === "object" && "detail" in productScreen)
          return (
            <ProductDetailScreen
              productId={productScreen.detail}
              onBack={goProductList}
            />
          );
        return (
          <ProductListScreen
            onAddProduct={goAddProduct}
            onViewProduct={goProductDetail}
          />
        );
      case "history":
        return <TransactionHistoryScreen />;
      case "profile":
        return <ProfileScreen onLogout={onLogout} />;
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className="flex-1">{renderScreen()}</View>

      {/* Bottom Tab Bar */}
      <View
        className="bg-white border-t border-slate-100 flex-row px-4"
        style={{ paddingBottom: Platform.OS === "ios" ? 24 : 12 }}
      >
        <TabButton
          label="Home"
          emoji={"\u{1F3E0}"}
          active={activeTab === "dashboard"}
          onPress={() => setActiveTab("dashboard")}
        />
        <TabButton
          label="Products"
          emoji={"\u{1F4E6}"}
          active={activeTab === "products"}
          onPress={goProducts}
        />
        <TabButton
          label="History"
          emoji={"\u{1F4CB}"}
          active={activeTab === "history"}
          onPress={goHistory}
        />
        <TabButton
          label="Profile"
          emoji={"\u{1F464}"}
          active={activeTab === "profile"}
          onPress={() => setActiveTab("profile")}
        />
      </View>
    </View>
  );
};

export default AppNavigator;
