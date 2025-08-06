import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../hooks/useAuth";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import { COLORS } from "../constants/theme";
// @ts-ignore
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BoxesNavbarIcon from "../assets/icons/boxes-navbar.svg";
import ScanIcon from "../assets/icons/scan.svg";
import WalletIcon from "../assets/icons/wallet.svg";
import PersonIcon from "../assets/icons/person.svg";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.lightGray,
          paddingBottom: 10,
          paddingTop: 10,
          height: 80,
        },
        headerShown: false,
      }}>
      <Tab.Screen
        name="Shipments"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <BoxesNavbarIcon width={size} height={size} fill={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={DashboardScreen} // Using DashboardScreen as placeholder
        options={{
          tabBarIcon: ({ color, size }) => (
            <ScanIcon width={size} height={size} fill={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={DashboardScreen} // Using DashboardScreen as placeholder
        options={{
          tabBarIcon: ({ color, size }) => (
            <WalletIcon width={size} height={size} fill={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <PersonIcon width={size} height={size} fill={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Root Stack Navigator
function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {/* {!isAuthenticated ? (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      ) : (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      )} */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
