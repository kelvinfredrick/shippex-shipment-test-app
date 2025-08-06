import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  Dimensions,
} from "react-native";

const { height } = Dimensions.get("window");

interface LoginSheetProps {
  visible: boolean;
  onClose: () => void;
  onLogin?: (credentials: {
    url: string;
    email: string;
    password: string;
  }) => void;
}

const LoginBottomSheet: React.FC<LoginSheetProps> = ({
  visible,
  onClose,
  onLogin,
}) => {
  // State for the input fields
  const [url, setUrl] = useState("www.brandimic.com");
  const [email, setEmail] = useState("ali@brandimic.com");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (onLogin) {
      onLogin({ url, email, password });
    }
    onClose();
  };

  // Don't render if not visible
  if (!visible) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent={true}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose} // Close on tapping the background
        />
        <View style={styles.sheetContainer}>
          {/* Drag Handle */}
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>← Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>
              Please enter your First, Last name and your phone number in order
              to register
            </Text>

            {/* Input Fields */}
            <View style={styles.inputGroup}>
              {/* URL Input */}
              <View style={[styles.inputContainer, styles.urlInputContainer]}>
                <Text style={styles.inputLabel}>URL</Text>
                <View style={styles.urlWrapper}>
                  <Text style={styles.urlPrefix}>https://</Text>
                  <TextInput
                    style={styles.input}
                    value={url}
                    onChangeText={setUrl}
                    keyboardType="url"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Username / Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Username / Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password Input */}
              <View
                style={[styles.inputContainer, styles.passwordInputContainer]}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Styles for the Modal and Sheet
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 9999,
    elevation: 9999,
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    minHeight: height * 0.7,
    maxHeight: height * 0.9,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#D1D5DB", // A light grey color
    borderRadius: 2.5,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 16,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5, // Make it easier to tap
  },
  cancelButtonText: {
    color: "#4838D1",
    fontSize: 17,
    marginLeft: 2,
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 24,
    lineHeight: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputContainer: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    minHeight: 60,
  },
  passwordInputContainer: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#4838D1",
  },
  input: {
    fontSize: 17,
    color: "#111827",
    paddingTop: 10,
    minHeight: 40,
    ...Platform.select({
      android: {
        paddingVertical: 4,
      },
    }),
  },
  inputLabel: {
    position: "absolute",
    top: 10,
    left: 16,
    fontSize: 12,
    color: "#6B7280",
  },
  urlInputContainer: {
    // Specific styles for the URL input
  },
  urlWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  urlPrefix: {
    fontSize: 17,
    color: "#6B7280",
    marginRight: 4,
    paddingTop: 10,
  },
  loginButton: {
    backgroundColor: "#4838D1",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
    minHeight: 56,
    justifyContent: "center",
    // Platform-specific shadow
    ...Platform.select({
      ios: {
        shadowColor: "#4838D1",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default LoginBottomSheet;
