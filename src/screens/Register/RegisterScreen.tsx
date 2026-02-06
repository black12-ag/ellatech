import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useApp } from "../../context/AppContext";

interface Props {
  onSuccess?: () => void;
}

export const RegisterScreen: React.FC<Props> = ({ onSuccess }) => {
  const { registerUser } = useApp();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);
    if (!fullName.trim()) { setError("Full name is required"); return; }
    if (!email.trim()) { setError("Email is required"); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = registerUser(email, fullName);
    setLoading(false);

    if (!result.success) { setError(result.error ?? "Registration failed"); return; }
    onSuccess?.();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="flex-1 bg-slate-50"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="bg-indigo-600 pb-24 pt-20 items-center">
          <View className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
          <View className="absolute bottom-10 -left-10 w-28 h-28 rounded-full bg-white/5" />

          <View className="w-24 h-24 rounded-3xl bg-white items-center justify-center shadow-2xl shadow-black/20 mb-5">
            <Text className="text-5xl">{"\u{1F4E6}"}</Text>
          </View>
          <Text className="text-3xl font-extrabold text-white tracking-tight">
            Ellatech
          </Text>
          <Text className="text-base text-indigo-200 mt-1 font-medium">
            Inventory Management
          </Text>
        </View>

        {/* Form Card */}
        <View className="mx-5 -mt-14 bg-white rounded-3xl p-7 shadow-2xl shadow-slate-900/10 border border-slate-100">
          <Text className="text-2xl font-extrabold text-slate-900">
            Create Account
          </Text>
          <Text className="text-sm text-indigo-500 mt-1 mb-7 font-medium">
            Start managing your inventory today
          </Text>

          {error && (
            <View className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5 flex-row items-center">
              <Text className="text-lg mr-2">{"\u{26A0}\uFE0F"}</Text>
              <Text className="text-red-600 text-sm flex-1 font-medium">{error}</Text>
            </View>
          )}

          {/* Full Name */}
          <Text className="text-sm font-semibold text-slate-700 mb-2 ml-1">
            Full Name
          </Text>
          <View className="flex-row items-center bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 mb-4">
            <Text className="text-lg mr-3">{"\u{1F464}"}</Text>
            <TextInput
              className="flex-1 py-4 text-base text-slate-800"
              placeholder="Enter your full name"
              placeholderTextColor="#94a3b8"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          {/* Email */}
          <Text className="text-sm font-semibold text-slate-700 mb-2 ml-1">
            Email Address
          </Text>
          <View className="flex-row items-center bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 mb-7">
            <Text className="text-lg mr-3">{"\u{2709}\uFE0F"}</Text>
            <TextInput
              className="flex-1 py-4 text-base text-slate-800"
              placeholder="you@example.com"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Submit */}
          <TouchableOpacity
            className={`rounded-2xl py-4 items-center ${
              loading ? "bg-indigo-400" : "bg-indigo-600"
            }`}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View className="flex-row items-center">
                <Text className="text-white font-bold text-lg">
                  Get Started
                </Text>
                <Text className="text-white text-lg ml-2">
                  {"\u{1F680}"}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Feature pills */}
        <View className="flex-row justify-center mt-7 flex-wrap gap-3 px-6">
          {[
            { icon: "\u{1F4E6}", label: "Track Products", bg: "bg-emerald-50", text: "text-emerald-600" },
            { icon: "\u{1F4CA}", label: "Real-time Stats", bg: "bg-blue-50", text: "text-blue-600" },
            { icon: "\u{2705}", label: "Stock Control", bg: "bg-violet-50", text: "text-violet-600" },
          ].map((pill) => (
            <View key={pill.label} className={`flex-row items-center ${pill.bg} px-4 py-2.5 rounded-full`}>
              <Text className="text-sm mr-1.5">{pill.icon}</Text>
              <Text className={`${pill.text} text-xs font-semibold`}>{pill.label}</Text>
            </View>
          ))}
        </View>

        <View className="h-12" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
