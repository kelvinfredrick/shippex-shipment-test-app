import React, { useEffect, useState } from "react";
import { View, Pressable, Text, Dimensions, StatusBar } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  withDelay,
} from "react-native-reanimated";
import { COLORS } from "../constants/theme";
import LogoSvg from "../assets/logo/logo.svg";
import LogoWhiteSvg from "../assets/logo/logo-white.svg";
import DraggableLoginBottomSheet from "../components/DraggableLoginBottomSheet";
import { useAuth } from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const logoBaseSize = 100;
const screenDiagonal = Math.sqrt(width ** 2 + height ** 2);
const maxScale = screenDiagonal / logoBaseSize; // Ensure it covers the screen

interface SplashScreenProps {
  onFinish?: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation();

  // Shared animation values
  const logoScale = useSharedValue(0.3);
  const backgroundOpacity = useSharedValue(0);
  const finalLogoOpacity = useSharedValue(0);
  const finalLogoTranslateY = useSharedValue(20);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(20);

  useEffect(() => {
    // Start animation sequence
    logoScale.value = withDelay(
      1000,
      withTiming(1, { duration: 1500 }, () => {
        // Then scale up to cover screen
        logoScale.value = withTiming(maxScale, { duration: 1000 }, () => {
          // Fade in background image (logo covered entire screen)
          backgroundOpacity.value = withTiming(1, { duration: 500 });

          // Final logo & button
          finalLogoOpacity.value = withDelay(
            400,
            withTiming(1, { duration: 500 })
          );
          finalLogoTranslateY.value = withDelay(
            400,
            withTiming(0, { duration: 500 })
          );
          buttonOpacity.value = withDelay(
            600,
            withTiming(1, { duration: 500 })
          );
          buttonTranslateY.value = withDelay(
            600,
            withTiming(0, { duration: 500 })
          );
        });
      })
    );
  }, []);

  const initialLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: interpolate(
      logoScale.value,
      [0.3, 1, maxScale * 0.95, maxScale],
      [1, 1, 1, 0]
    ),
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
    position: "absolute",
    width,
    height,
    backgroundColor: COLORS.primary,
  }));

  const finalLogoStyle = useAnimatedStyle(() => ({
    opacity: finalLogoOpacity.value,
    transform: [{ translateY: finalLogoTranslateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Initial animated logo */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: height / 2 - logoBaseSize / 2,
            left: width / 2 - logoBaseSize / 2,
            width: logoBaseSize,
            height: logoBaseSize,
            alignItems: "center",
            justifyContent: "center",
          },
          initialLogoStyle,
        ]}>
        <LogoSvg width={60} height={60} />
      </Animated.View>

      {/* Background fill */}
      <Animated.View style={backgroundStyle} />

      {/* Final logo */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: height * 0.4,
            left: 0,
            right: 0,
            alignItems: "center",
          },
          finalLogoStyle,
        ]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <LogoWhiteSvg width={120 * 1.7} height={120 * 0.3} />
        </View>
      </Animated.View>

      {/* Login button */}
      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: 100,
            left: 0,
            right: 0,
            alignItems: "center",
          },
          buttonStyle,
        ]}>
        <Pressable
          onPress={() => {
            // Navigate to login screen
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              // If we can't go back, we're at the root, so navigate to login
              navigation.navigate("Login" as never);
            }
          }}
          style={{
            backgroundColor: COLORS.white,
            paddingVertical: 14,
            paddingHorizontal: 32,
            borderRadius: 8,
            minWidth: width - 36,
            alignItems: "center",
            marginRight: 16,
            marginLeft: 16,
          }}>
          <Text
            style={{
              color: COLORS.primary,
              fontSize: 16,
              fontWeight: "600",
            }}>
            Login
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
