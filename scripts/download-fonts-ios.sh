#!/bin/bash
# Poppins Font Download Script for macOS/Linux
# This script downloads Poppins fonts from Google Fonts for iOS

echo "Downloading Poppins fonts for iOS..."

# Create fonts directory if it doesn't exist
mkdir -p ios/Efi

# Download Poppins fonts
echo "Downloading Poppins-Regular.ttf..."
curl -L -o ios/Efi/Poppins-Regular.ttf "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Regular.ttf"

echo "Downloading Poppins-Medium.ttf..."
curl -L -o ios/Efi/Poppins-Medium.ttf "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Medium.ttf"

echo "Downloading Poppins-SemiBold.ttf..."
curl -L -o ios/Efi/Poppins-SemiBold.ttf "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-SemiBold.ttf"

echo "Downloading Poppins-Bold.ttf..."
curl -L -o ios/Efi/Poppins-Bold.ttf "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Bold.ttf"

echo "Downloading Poppins-Light.ttf..."
curl -L -o ios/Efi/Poppins-Light.ttf "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Light.ttf"

echo ""
echo "Fonts downloaded successfully to ios/Efi/"
echo ""
echo "Next steps:"
echo "1. Open ios/Efi.xcworkspace in Xcode"
echo "2. Drag the font files from ios/Efi/ into Xcode project (if not already added)"
echo "3. Ensure fonts are added to 'Copy Bundle Resources' in Build Phases"
echo "4. Info.plist already has UIAppFonts configured"
echo "5. Clean and rebuild: cd ios && rm -rf build && cd .. && npx react-native run-ios"

