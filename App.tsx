import "./global.css";

import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { AppProvider, useApp } from "./src/context/AppContext";
import { RegisterScreen } from "./src/screens/Register/RegisterScreen";
import { AppNavigator } from "./src/navigation/AppNavigator";

/** Inner component that reads context */
const AppContent: React.FC = () => {
  const { user, logout } = useApp();
  const [showApp, setShowApp] = useState(false);

  if (!user || !showApp) {
    return (
      <>
        <StatusBar style="light" />
        <RegisterScreen onSuccess={() => setShowApp(true)} />
      </>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator
        onLogout={() => {
          logout();
          setShowApp(false);
        }}
      />
    </>
  );
};

/** Root: wraps everything in AppProvider */
export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
