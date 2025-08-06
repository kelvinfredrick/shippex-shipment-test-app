import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  runOnJS,
} from "react-native-reanimated";
import { useAuth } from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../constants/theme";
import { validateLoginForm } from "../utils/validation";
import { storage } from "../services/storage";
// @ts-ignore
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const LoginScreen: React.FC = () => {
  // State for the input fields
  const [url, setUrl] = useState("www.brandimic.com");
  const [email, setEmail] = useState("ali@brandimic.com");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const { login, error, clearError, setUser } = useAuth();
  const navigation = useNavigation();

  // Draggable animation values
  const translateY = useSharedValue(0);
  const isActive = useSharedValue(false);

  const scrollTo = (destination: number) => {
    "worklet";
    translateY.value = withSpring(destination, {
      damping: 50,
      stiffness: 300,
    });
  };

  const closeSheet = () => {
    "worklet";
    runOnJS(navigation.goBack)();
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      isActive.value = true;
    })
    .onUpdate((e) => {
      // Only allow downward dragging
      const newValue = Math.max(0, e.translationY);
      translateY.value = newValue;
    })
    .onEnd(() => {
      const shouldClose = translateY.value > 100; // Threshold to close
      if (shouldClose) {
        scrollTo(SCREEN_HEIGHT);
        closeSheet();
      } else {
        scrollTo(0);
      }
      isActive.value = false;
    });

  const handleLogin = async () => {
    // Clear previous errors
    setValidationErrors({});
    clearError();

    // Validate form
    const validation = validateLoginForm({ url, email, password });
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setIsLoading(true);

    // Simulate loading for 1 second then navigate directly to dashboard
    setTimeout(async () => {
      setIsLoading(false);

      // Create mock user data
      const mockUser = {
        id: "test-user",
        email: email,
        name: "Ibrahim Shaker",
      };

      // Save to storage and set user state (simulating successful login)
      try {
        await storage.setItem("user", JSON.stringify(mockUser));
        await storage.setItem("token", "mock-token-123");
        setUser(mockUser);
        console.log("✅ Mock login successful - user saved to storage");

        // Navigate directly to dashboard
        navigation.navigate("Main" as never);
      } catch (error) {
        console.error("❌ Error saving mock user:", error);
      }
    }, 1000);
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return validationErrors[fieldName];
  };

  const rModalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Draggable Modal Container */}
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.modalContainer, rModalStyle]}>
          {/* Drag Handle */}
          <View style={styles.dragHandle} />

          {/* Content */}
          <View style={styles.contentContainer}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}>
                <MaterialIcons
                  name="arrow-back-ios"
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.backButtonText}> Cancel</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>
              Please enter your First, Last name and your phone number in order
              to register
            </Text>

            {/* Input Fields */}
            <View style={styles.inputGroup}>
              {/* URL Input */}
              <View
                style={[
                  styles.inputContainer,
                  styles.urlInputContainer,
                  getFieldError("url") && styles.inputError,
                ]}>
                <Text style={styles.inputLabel}>URL</Text>
                <View style={styles.urlWrapper}>
                  <Text style={styles.urlPrefix}>https://</Text>
                  <TextInput
                    style={styles.input}
                    value={url}
                    onChangeText={(text) => {
                      setUrl(text);
                      if (getFieldError("url")) {
                        setValidationErrors((prev) => ({ ...prev, url: "" }));
                      }
                    }}
                    keyboardType="url"
                    autoCapitalize="none"
                    placeholder="Enter URL"
                    placeholderTextColor={COLORS.gray}
                  />
                </View>
                {getFieldError("url") && (
                  <Text style={styles.errorText}>{getFieldError("url")}</Text>
                )}
              </View>

              {/* Username / Email Input */}
              <View
                style={[
                  styles.inputContainer,
                  getFieldError("email") && styles.inputError,
                ]}>
                <Text style={styles.inputLabel}>Username / Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (getFieldError("email")) {
                      setValidationErrors((prev) => ({ ...prev, email: "" }));
                    }
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="Enter email"
                  placeholderTextColor={COLORS.gray}
                />
                {getFieldError("email") && (
                  <Text style={styles.errorText}>{getFieldError("email")}</Text>
                )}
              </View>

              {/* Password Input */}
              <View
                style={[
                  styles.inputContainer,
                  styles.passwordInputContainer,
                  getFieldError("password") && styles.inputError,
                ]}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (getFieldError("password")) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        password: "",
                      }));
                    }
                  }}
                  secureTextEntry
                  placeholder="Enter password"
                  placeholderTextColor={COLORS.gray}
                />
                {getFieldError("password") && (
                  <Text style={styles.errorText}>
                    {getFieldError("password")}
                  </Text>
                )}
              </View>
            </View>

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                isLoading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading}>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={COLORS.white} />
                  <Text style={styles.loginButtonText}>Logging in...</Text>
                </View>
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </GestureDetector>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    minHeight: SCREEN_HEIGHT * 0.98,
    zIndex: 1000,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#D1D5DB",
    borderRadius: 2.5,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 0,
    marginTop: 0,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 0,
    paddingVertical: 16,
    marginBottom: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 17,
    marginLeft: 2,
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
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    minHeight: 60,
    color: COLORS.primary,
  },
  inputError: {
    borderWidth: 1,
    borderColor: COLORS.error,
    backgroundColor: "#FEF2F2",
  },
  passwordInputContainer: {
    backgroundColor: COLORS.inputBackground,
    borderWidth: 2,
    borderColor: "#4838D1",
  },
  input: {
    fontSize: 17,
    color: COLORS.primary,
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
  errorContainer: {
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    position: "absolute",
    bottom: 50,
    marginLeft: 16,
    marginRight: 16,
    width: SCREEN_WIDTH - 35,
    left: 0,
    right: 0,
    marginTop: 20,
    minHeight: 56,
    justifyContent: "center",
    // Platform-specific shadow
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default LoginScreen;
