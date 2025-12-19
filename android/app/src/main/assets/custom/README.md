# Poppins Font Setup Instructions

## Step 1: Download Poppins Fonts

Download the following Poppins font files from Google Fonts:
- Poppins-Regular.ttf
- Poppins-Medium.ttf
- Poppins-SemiBold.ttf
- Poppins-Bold.ttf
- Poppins-Light.ttf

## Step 2: Add Fonts to Project

### For Android:
1. Create the directory: `android/app/src/main/assets/fonts/`
2. Copy the font files to this directory

### For iOS:
1. Add font files to the Xcode project
2. Update `ios/Efi/Info.plist` to include font files

## Step 3: Font Files Needed

Place these files in the appropriate directories:

```
android/app/src/main/assets/fonts/
├── Poppins-Regular.ttf
├── Poppins-Medium.ttf
├── Poppins-SemiBold.ttf
├── Poppins-Bold.ttf
└── Poppins-Light.ttf

ios/Efi/
├── Poppins-Regular.ttf
├── Poppins-Medium.ttf
├── Poppins-SemiBold.ttf
├── Poppins-Bold.ttf
└── Poppins-Light.ttf
```

## Step 4: iOS Configuration

Add this to `ios/Efi/Info.plist`:

```xml
<key>UIAppFonts</key>
<array>
    <string>Poppins-Regular.ttf</string>
    <string>Poppins-Medium.ttf</string>
    <string>Poppins-SemiBold.ttf</string>
    <string>Poppins-Bold.ttf</string>
    <string>Poppins-Light.ttf</string>
</array>
```

## Step 5: Font Weights Mapping

- Regular: 400
- Medium: 500
- SemiBold: 600
- Bold: 700
- Light: 300

## Step 6: Usage in Code

The fonts will be automatically available in your React Native Paper theme and global styles once configured.
