# ShipPex - Shipment Tracker App

A React Native application for tracking shipments with authentication and real-time status updates.

## Features

- **Splash Screen**: Animated splash screen with logo and login transition
- **Authentication**: Secure login system with credential validation
- **Shipment List**: Display shipments with status, pull-to-refresh functionality
- **Modern UI**: Clean, professional design following best practices

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd shipment
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install Expo CLI globally** (if not already installed)
   ```bash
   npm install -g @expo/cli
   ```

## Running the App

### Development Mode

1. **Start the development server**

   ```bash
   npm start
   # or
   expo start
   ```

2. **Run on iOS Simulator**

   ```bash
   npm run ios
   # or
   expo start --ios
   ```

3. **Run on Android Emulator**

   ```bash
   npm run android
   # or
   expo start --android
   ```

4. **Run on Web**
   ```bash
   npm run web
   # or
   expo start --web
   ```

### Building for Production

1. **Build APK for Android**

   ```bash
   expo build:android
   ```

2. **Build IPA for iOS**
   ```bash
   expo build:ios
   ```

## Project Structure

```
src/
├── assets/           # Images, icons, and static assets
├── components/       # Reusable UI components
├── constants/        # App constants and theme
├── hooks/           # Custom React hooks
├── navigation/      # Navigation configuration
├── screens/         # App screens
├── services/        # API services and storage
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## API Integration

The app integrates with the ShipPex API endpoints:

- **Login**: `POST /api/method/login`
- **Shipment List**: `GET /api/method/frappe.client.get_list`
- **Shipment Status**: `GET /api/method/frappe.client.get_list`

### Test Credentials

- **URL**: `www.brandimic.com`
- **Email**: `test@brandimic.com`
- **Password**: `testy123@`

## Key Technologies

- **React Native**: Cross-platform mobile development
- **TypeScript**: Type-safe JavaScript
- **Expo**: Development platform and tools
- **React Navigation**: Navigation library
- **AsyncStorage**: Local data persistence
- **React Native Reanimated**: Smooth animations

## Development Guidelines

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write clean, readable code

### State Management

- Use React hooks for local state
- Implement custom hooks for reusable logic
- Store authentication tokens securely

### UI/UX

- Follow the provided Figma design
- Ensure responsive design
- Implement smooth animations
- Handle loading and error states

## Troubleshooting

### Common Issues

1. **Metro bundler issues**

   ```bash
   npx expo start --clear
   ```

2. **iOS build issues**

   ```bash
   cd ios && pod install && cd ..
   ```

3. **Android build issues**
   ```bash
   npx expo run:android --clear
   ```

### Debug Mode

Enable debug mode by shaking the device or pressing `Cmd+D` (iOS) / `Cmd+M` (Android) in the simulator.
