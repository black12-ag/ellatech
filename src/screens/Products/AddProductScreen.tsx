import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { useApp } from "../../context/AppContext";

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastAddedName, setLastAddedName] = useState("");

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

    // Clear form fields after successful addition
    setSku("");
    setName("");
    setPrice("");
    setQuantity("");

    setLastAddedName(name.trim());
    setShowSuccessModal(true);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View className="flex-1 bg-black/40 items-center justify-center px-5">
          <View
            className="bg-white rounded-3xl p-6 border border-slate-100 items-center"
            style={{ maxWidth: 420, width: "100%" }}
          >
            <Text className="text-4xl mb-2">{"\u{2705}"}</Text>
            <Text className="text-slate-900 text-xl font-extrabold text-center">
              Product Added
            </Text>
            <Text className="text-slate-500 text-sm text-center mt-2">
              "{lastAddedName}" has been added to your inventory.
            </Text>
            <View className="flex-row mt-5 gap-3">
              <TouchableOpacity
                className="bg-slate-100 rounded-xl px-4 py-3"
                onPress={() => setShowSuccessModal(false)}
                activeOpacity={0.85}
              >
                <Text className="text-slate-700 font-semibold">Add Another</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-indigo-600 rounded-xl px-5 py-3"
                onPress={() => {
                  setShowSuccessModal(false);
                  onBack();
                }}
                activeOpacity={0.85}
              >
                <Text className="text-white font-semibold">Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
            className="flex-row items-center mb-3 self-start"
            style={{ maxWidth: 560, width: "100%", alignSelf: "center" }}
          >
            <Text className="text-lg mr-1">{"\u{2190}"}</Text>
            <Text className="text-indigo-200 text-base font-semibold">Back</Text>
          </TouchableOpacity>
          <View style={{ maxWidth: 560, width: "100%", alignSelf: "center" }}>
            <Text className="text-white text-2xl font-extrabold text-center">Add Product</Text>
            <Text className="text-indigo-200 text-sm mt-1 font-medium text-center">
              Register a new item in your inventory
            </Text>
          </View>
        </View>

        {/* Form */}
        <View className="px-5 pt-6">
          <View
            className="bg-white rounded-3xl p-5 border border-slate-100"
            style={{ maxWidth: 560, width: "100%", alignSelf: "center" }}
          >
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
        </View>

        <View className="h-10" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddProductScreen;
