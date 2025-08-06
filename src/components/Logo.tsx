import React from "react";
import { View, Text, StyleSheet } from "react-native";
import LogoSvg from "../assets/logo/logo.svg";
import LogoWhiteSvg from "../assets/logo/logo-white.svg";

interface LogoProps {
  size?: number;
  color?: string;
  variant?: "initial" | "final";
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  size = 60,
  color = "#2F50C1",
  variant = "initial",
  showText = false,
}) => {
  // Use your actual SVG logo files
  const renderInitialLogo = () => <LogoSvg width={size} height={size} />;

  const renderFinalLogo = () => (
    <LogoWhiteSvg width={size * 1.7} height={size * 0.3} />
  );

  if (variant === "final" && showText) {
    return <View style={styles.container}>{renderFinalLogo()}</View>;
  }

  if (variant === "final") {
    return renderFinalLogo();
  }

  return renderInitialLogo();
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "System",
  },
});

export default Logo;
