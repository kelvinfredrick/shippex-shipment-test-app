import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
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
import { COLORS } from "../constants/theme";
// @ts-ignore
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// Show 80% of the screen height
const SHEET_HEIGHT = SCREEN_HEIGHT * 1;
const MAX_TRANSLATE_Y = -(SCREEN_HEIGHT - SHEET_HEIGHT - 10);

interface DraggableLoginBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onLogin?: (credentials: {
    url: string;
    email: string;
    password: string;
  }) => void;
}

const DraggableLoginBottomSheet: React.FC<DraggableLoginBottomSheetProps> = ({
  visible,
  onClose,
  onLogin,
}) => {
  // State for the input fields
  const [url, setUrl] = useState("www.brandimic.com");
  const [email, setEmail] = useState("ali@brandimic.com");
  const [password, setPassword] = useState("");

  // Start at 0 since container is positioned at bottom
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
    runOnJS(onClose)();
  };

  useEffect(() => {
    if (visible) {
      scrollTo(MAX_TRANSLATE_Y);
    } else {
      scrollTo(0);
    }
  }, [visible]);

  const handleLogin = () => {
    if (onLogin) {
      onLogin({ url, email, password });
    }
    onClose();
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      isActive.value = true;
    })
    .onUpdate((e) => {
      // Ensure we don't go beyond the top of the screen
      const newValue = translateY.value + e.translationY;
      translateY.value = Math.max(MAX_TRANSLATE_Y, Math.min(0, newValue));
    })
    .onEnd(() => {
      const shouldClose =
        translateY.value > MAX_TRANSLATE_Y + SHEET_HEIGHT * 0.2; // 20% threshold
      if (shouldClose) {
        scrollTo(0);
        closeSheet();
      } else {
        scrollTo(MAX_TRANSLATE_Y);
      }
      isActive.value = false;
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const rBackdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [0, MAX_TRANSLATE_Y],
      [0, 0.5],
      Extrapolate.CLAMP
    );
    return {
      opacity,
    };
  });

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <Animated.View
        style={[styles.backdrop, rBackdropStyle]}
        onTouchEnd={onClose}
      />

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
          {/* Drag Handle */}
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <MaterialIcons
                name="arrow-back-ios"
                size={20}
                color={COLORS.primary}
              />
              <Text style={styles.cancelButtonText}> Cancel</Text>
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
        </Animated.View>
      </GestureDetector>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 999,
  },
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: "100%",
    backgroundColor: "#FFFFFF",
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    zIndex: 1000,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 16,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
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
    color: COLORS.primary,
  },
  passwordInputContainer: {
    backgroundColor: "transparent",
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
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
    minHeight: 56,
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
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
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default DraggableLoginBottomSheet;
