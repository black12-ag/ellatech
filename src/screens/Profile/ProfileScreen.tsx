import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { useApp } from "../../context/AppContext";
import { showConfirm } from "../../utils/alert";

interface Props {
  onLogout: () => void;
}

export const ProfileScreen: React.FC<Props> = ({ onLogout }) => {
  const { user, products, transactions } = useApp();
  const portfolioUrl = "https://ellatech-inventory-munir.netlify.app";

  const handleLogout = () => {
    showConfirm(
      "\u{1F6AA} Log Out",
      "Are you sure you want to log out?",
      onLogout,
      "Log Out",
    );
  };

  const handleOpenPortfolio = async () => {
    const supported = await Linking.canOpenURL(portfolioUrl);
    if (supported) {
      await Linking.openURL(portfolioUrl);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
    });

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-indigo-600 pt-14 pb-12 items-center">
        <View className="w-24 h-24 rounded-3xl bg-white items-center justify-center shadow-lg shadow-black/10 mb-4">
          <Text className="text-5xl">{"\u{1F464}"}</Text>
        </View>
        <Text className="text-white text-xl font-extrabold">
          {user?.fullName ?? "User"}
        </Text>
        <Text className="text-indigo-200 text-sm mt-1 font-medium">
          {user?.email ?? "-"}
        </Text>
      </View>

      <View
        className="px-5 mt-6"
        style={{ maxWidth: 620, width: "100%", alignSelf: "center" }}
      >
        {/* Account Info */}
        <View className="bg-white rounded-2xl p-5 border border-slate-100 mb-4">
          <View className="flex-row items-center mb-4">
            <Text className="text-base mr-2">{"\u{1F4DD}"}</Text>
            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Account Details
            </Text>
          </View>

          <View className="flex-row justify-between py-3 border-b border-slate-50">
            <Text className="text-slate-400 text-sm font-medium">Name</Text>
            <Text className="text-slate-900 font-bold text-sm">{user?.fullName}</Text>
          </View>
          <View className="flex-row justify-between py-3 border-b border-slate-50">
            <Text className="text-slate-400 text-sm font-medium">Email</Text>
            <Text className="text-slate-900 font-bold text-sm">{user?.email}</Text>
          </View>
          {user?.createdAt && (
            <View className="flex-row justify-between py-3">
              <Text className="text-slate-400 text-sm font-medium">Joined</Text>
              <Text className="text-slate-900 font-bold text-sm">
                {formatDate(user.createdAt)}
              </Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View className="bg-white rounded-2xl p-5 border border-slate-100 mb-6">
          <View className="flex-row items-center mb-4">
            <Text className="text-base mr-2">{"\u{1F4CA}"}</Text>
            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Activity Summary
            </Text>
          </View>
          <View className="flex-row">
            <View className="flex-1 items-center py-2">
              <Text className="text-3xl font-extrabold text-indigo-600">
                {products.length}
              </Text>
              <Text className="text-slate-400 text-xs mt-1 font-semibold">Products</Text>
            </View>
            <View className="w-px bg-slate-100" />
            <View className="flex-1 items-center py-2">
              <Text className="text-3xl font-extrabold text-indigo-600">
                {transactions.length}
              </Text>
              <Text className="text-slate-400 text-xs mt-1 font-semibold">Transactions</Text>
            </View>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          className="bg-white border-2 border-indigo-100 rounded-2xl py-4 items-center mb-3"
          onPress={handleOpenPortfolio}
          activeOpacity={0.8}
        >
          <Text className="text-indigo-600 font-bold text-base">Open Portfolio Link</Text>
          <Text className="text-indigo-400 text-xs mt-1">{portfolioUrl}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-50 border-2 border-red-100 rounded-2xl py-4 items-center flex-row justify-center"
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text className="mr-2">{"\u{1F6AA}"}</Text>
          <Text className="text-red-500 font-bold text-base">Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;
