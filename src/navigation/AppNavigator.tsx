import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
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
  icon: string;
  active: boolean;
  onPress: () => void;
}> = ({ label, icon, active, onPress }) => (
  <TouchableOpacity
    className="flex-1 items-center py-2"
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View
      className={`w-10 h-10 rounded-xl items-center justify-center mb-0.5 ${
        active ? "bg-indigo-50" : ""
      }`}
    >
      <Text
        className={`text-lg font-extrabold ${
          active ? "text-indigo-600" : "text-slate-300"
        }`}
      >
        {icon}
      </Text>
    </View>
    <Text
      className={`text-[10px] font-bold ${
        active ? "text-indigo-600" : "text-slate-300"
      }`}
    >
      {label}
    </Text>
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
      <View className="bg-white border-t border-slate-100 flex-row pt-1 pb-7 px-3 shadow-t-lg shadow-slate-200">
        <TabButton
          label="Home"
          icon="H"
          active={activeTab === "dashboard"}
          onPress={() => setActiveTab("dashboard")}
        />
        <TabButton
          label="Products"
          icon="P"
          active={activeTab === "products"}
          onPress={goProducts}
        />
        <TabButton
          label="History"
          icon="T"
          active={activeTab === "history"}
          onPress={goHistory}
        />
        <TabButton
          label="Profile"
          icon="U"
          active={activeTab === "profile"}
          onPress={() => setActiveTab("profile")}
        />
      </View>
    </View>
  );
};

export default AppNavigator;
