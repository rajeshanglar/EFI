@echo off
REM Poppins Font Download Script for Windows
REM This script downloads Poppins fonts from Google Fonts

echo Downloading Poppins fonts...

REM Create fonts directories
mkdir android\app\src\main\assets\fonts 2>nul
mkdir ios\Efi 2>nul

REM Download Poppins fonts using PowerShell
echo Downloading Poppins-Regular.ttf...
powershell -Command "Invoke-WebRequest -Uri 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2' -OutFile 'android\app\src\main\assets\fonts\Poppins-Regular.ttf'"

echo Downloading Poppins-Medium.ttf...
powershell -Command "Invoke-WebRequest -Uri 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLDzWV1xlFQ.woff2' -OutFile 'android\app\src\main\assets\fonts\Poppins-Medium.ttf'"

echo Downloading Poppins-SemiBold.ttf...
powershell -Command "Invoke-WebRequest -Uri 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6V1xlFQ.woff2' -OutFile 'android\app\src\main\assets\fonts\Poppins-SemiBold.ttf'"

echo Downloading Poppins-Bold.ttf...
powershell -Command "Invoke-WebRequest -Uri 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCzWV1xlFQ.woff2' -OutFile 'android\app\src\main\assets\fonts\Poppins-Bold.ttf'"

echo Downloading Poppins-Light.ttf...
powershell -Command "Invoke-WebRequest -Uri 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLDzWV1xlFQ.woff2' -OutFile 'android\app\src\main\assets\fonts\Poppins-Light.ttf'"

REM Copy to iOS directory
copy android\app\src\main\assets\fonts\*.ttf ios\Efi\

echo Fonts downloaded successfully!
echo Don't forget to:
echo 1. Add fonts to Xcode project
echo 2. Update ios\Efi\Info.plist with UIAppFonts

pause
