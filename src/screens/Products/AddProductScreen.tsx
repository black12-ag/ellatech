import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useApp } from "../../context/AppContext";
import { showAlert } from "../../utils/alert";

interface Props {
  onBack: () => void;
}

export const AddProductScreen: React.FC<Props> = ({ onBack }) => {
  const { addProduct } = useApp();
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    if (!sku.trim()) { setError("SKU is required"); return; }
    if (!name.trim()) { setError("Product name is required"); return; }
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
      setError("Enter a valid price greater than 0"); return;
    }
    if (!quantity.trim() || isNaN(Number(quantity)) || Number(quantity) < 0) {
      setError("Enter a valid quantity (0 or more)"); return;
    }

    const result = addProduct(
      sku.trim(), name.trim(), parseFloat(price), parseInt(quantity, 10),
    );

    if (!result.success) { setError(result.error ?? "Failed to add product"); return; }

    showAlert(
      "\u{2705} Product Added",
      `"${name.trim()}" has been added to your inventory.`,
      onBack,
    );
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
        <View className="bg-indigo-600 pt-14 pb-8 px-5">
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            className="flex-row items-center mb-3"
          >
            <Text className="text-lg mr-1">{"\u{2190}"}</Text>
            <Text className="text-indigo-200 text-base font-semibold">Back</Text>
          </TouchableOpacity>
          <Text className="text-white text-2xl font-extrabold">Add Product</Text>
          <Text className="text-indigo-200 text-sm mt-1 font-medium">
            Register a new item in your inventory
          </Text>
        </View>

        {/* Form */}
        <View className="px-5 pt-6">
          {error && (
            <View className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5 flex-row items-center">
              <Text className="text-lg mr-2">{"\u{26A0}\uFE0F"}</Text>
              <Text className="text-red-600 text-sm flex-1 font-medium">{error}</Text>
            </View>
          )}

          {/* SKU */}
          <Text className="text-sm font-semibold text-slate-700 mb-2 ml-1">SKU</Text>
          <TextInput
            className="bg-white border-2 border-slate-200 rounded-2xl px-4 py-4 text-base text-slate-800 mb-4"
            placeholder="e.g. PROD-001"
            placeholderTextColor="#94a3b8"
            value={sku}
            onChangeText={setSku}
            autoCapitalize="characters"
          />

          {/* Product Name */}
          <Text className="text-sm font-semibold text-slate-700 mb-2 ml-1">Product Name</Text>
          <TextInput
            className="bg-white border-2 border-slate-200 rounded-2xl px-4 py-4 text-base text-slate-800 mb-4"
            placeholder="e.g. Wireless Mouse"
            placeholderTextColor="#94a3b8"
            value={name}
            onChangeText={setName}
          />

          {/* Price & Quantity Row */}
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-slate-700 mb-2 ml-1">Price ($)</Text>
              <TextInput
                className="bg-white border-2 border-slate-200 rounded-2xl px-4 py-4 text-base text-slate-800"
                placeholder="0.00"
                placeholderTextColor="#94a3b8"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-slate-700 mb-2 ml-1">Quantity</Text>
              <TextInput
                className="bg-white border-2 border-slate-200 rounded-2xl px-4 py-4 text-base text-slate-800"
                placeholder="0"
                placeholderTextColor="#94a3b8"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="number-pad"
              />
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            className="bg-indigo-600 rounded-2xl py-4 items-center flex-row justify-center"
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <Text className="mr-2">{"\u{2795}"}</Text>
            <Text className="text-white font-bold text-lg">Add Product</Text>
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity
            className="rounded-2xl py-3.5 items-center mt-3"
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text className="text-slate-400 font-semibold text-sm">Cancel</Text>
          </TouchableOpacity>
        </View>

        <View className="h-10" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddProductScreen;
