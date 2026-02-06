import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useApp } from "../../context/AppContext";

interface Props {
  onLogout: () => void;
}

export const ProfileScreen: React.FC<Props> = ({ onLogout }) => {
  const { user, products, transactions } = useApp();

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: onLogout },
    ]);
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
          <Text className="text-4xl font-black text-indigo-600">
            {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
          </Text>
        </View>
        <Text className="text-white text-xl font-extrabold">
          {user?.fullName ?? "User"}
        </Text>
        <Text className="text-indigo-200 text-sm mt-1 font-medium">
          {user?.email ?? "-"}
        </Text>
      </View>

      <View className="px-5 mt-6">
        {/* Account Info */}
        <View className="bg-white rounded-2xl p-5 shadow-sm shadow-slate-200 border border-slate-100 mb-4">
          <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">
            Account Details
          </Text>

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
        <View className="bg-white rounded-2xl p-5 shadow-sm shadow-slate-200 border border-slate-100 mb-6">
          <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">
            Activity Summary
          </Text>
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
          className="bg-red-50 border-2 border-red-100 rounded-2xl py-4 items-center"
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text className="text-red-500 font-bold text-base">Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;
