# TrackEase Installation Script
# This script will help you set up the TrackEase application

Write-Host "================================" -ForegroundColor Green
Write-Host "   TrackEase Installation" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
Write-Host "Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm is not installed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Cyan
Write-Host ""

# Install dependencies
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "================================" -ForegroundColor Green
    Write-Host "  Installation Complete! ✓" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Install 'Expo Go' app on your phone from Play Store/App Store" -ForegroundColor White
    Write-Host "2. Run: npm start" -ForegroundColor White
    Write-Host "3. Scan the QR code with Expo Go (Android) or Camera (iOS)" -ForegroundColor White
    Write-Host ""
    Write-Host "For detailed instructions, see QUICKSTART.md" -ForegroundColor Cyan
    Write-Host ""
    
    # Ask if user wants to start the app now
    $response = Read-Host "Would you like to start the app now? (y/n)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        Write-Host ""
        Write-Host "Starting TrackEase..." -ForegroundColor Green
        npm start
    }
} else {
    Write-Host ""
    Write-Host "✗ Installation failed!" -ForegroundColor Red
    Write-Host "Please check the error messages above and try again." -ForegroundColor Red
    Write-Host ""
}
