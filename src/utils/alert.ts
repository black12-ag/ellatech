import { Alert, Platform } from "react-native";

/**
 * Cross-platform alert that works on both Web and Native.
 * On web, `Alert.alert` is a no-op, so we fall back to `window.alert`.
 */
export const showAlert = (
  title: string,
  message?: string,
  onOk?: () => void,
) => {
  if (Platform.OS === "web") {
    // eslint-disable-next-line no-alert
    window.alert(`${title}${message ? `\n${message}` : ""}`);
    onOk?.();
  } else {
    Alert.alert(title, message, [{ text: "OK", onPress: onOk }]);
  }
};

/**
 * Cross-platform confirm dialog that works on both Web and Native.
 * On web, `Alert.alert` with buttons is a no-op, so we use `window.confirm`.
 */
export const showConfirm = (
  title: string,
  message: string,
  onConfirm: () => void,
  confirmText = "OK",
  cancelText = "Cancel",
) => {
  if (Platform.OS === "web") {
    // eslint-disable-next-line no-alert
    const ok = window.confirm(`${title}\n${message}`);
    if (ok) onConfirm();
  } else {
    Alert.alert(title, message, [
      { text: cancelText, style: "cancel" },
      { text: confirmText, style: "destructive", onPress: onConfirm },
    ]);
  }
};
