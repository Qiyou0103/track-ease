# TrackEase - Mobile Business Management Application

TrackEase is a mobile application designed to help Malaysian micro and small businesses transition from manual operations to digital management. Built with React Native and Expo.

## Features

### Core Features (MVP)

1. **Simple Onboarding & Setup**
   - User registration with mobile number
   - Business profile creation (name, type)
   - Initial inventory setup
   - Customizable categories and receipt messages

2. **Daily Sales & Inventory Tracking**
   - Point-of-Sale (POS) interface
   - Real-time inventory updates
   - Multiple payment methods (Cash, DuitNow QR, Bank Transfer, Pay Later)
   - Digital receipt generation

3. **Inventory Management**
   - View all products with stock levels
   - Low stock alerts
   - Out of stock indicators
   - Manual stock adjustments
   - Product categorization
   - Total inventory value tracking

4. **Payment & Credit Tracking**
   - Outstanding payments list
   - Mark payments as paid
   - Payment status tracking

5. **Reports & Analytics**
   - Daily/Weekly/Monthly sales views
   - Sales calendar
   - Transaction summaries
   - Payment method breakdown
   - Top-selling products

## Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **UI Components**: React Native Paper
- **Storage**: AsyncStorage (local device storage)
- **Icons**: Material Community Icons

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Expo Go app (on your mobile device)

### Step 1: Install Dependencies

```powershell
cd C:\Users\kahha\Downloads\trackease
npm install
```

### Step 2: Start the Development Server

```powershell
npm start
```

This will start the Expo development server and display a QR code.

### Step 3: Run on Your Device

1. Install the **Expo Go** app from Google Play Store (Android) or App Store (iOS)
2. Scan the QR code displayed in your terminal with:
   - **Android**: Expo Go app
   - **iOS**: Camera app, then open in Expo Go

### Alternative: Run on Emulator

**Android Emulator:**
```powershell
npm run android
```

**iOS Simulator (Mac only):**
```powershell
npm run ios
```

## Project Structure

```
trackease/
├── App.js                          # Main app entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── babel.config.js                 # Babel configuration
├── src/
│   ├── screens/
│   │   ├── OnboardingScreen.js     # First-time setup
│   │   ├── DashboardScreen.js      # Home dashboard
│   │   ├── SalesScreen.js          # POS interface
│   │   ├── InventoryScreen.js      # Inventory management
│   │   ├── ReportsScreen.js        # Sales reports
│   │   ├── SettingsScreen.js       # App settings
│   │   ├── AddProductScreen.js     # Add new products
│   │   ├── EditProductScreen.js    # Edit existing products
│   │   ├── CheckoutScreen.js       # Complete sales
│   │   └── OutstandingPaymentsScreen.js  # Manage credits
│   └── utils/
│       └── storage.js              # Data management functions
```

## How to Use

### First Launch

1. Enter your mobile number
2. Fill in your business details
3. Customize receipt message and settings
4. Start adding products!

### Adding Products

1. Navigate to Inventory tab
2. Tap the "+" button
3. Fill in product details:
   - Name
   - Category
   - Price
   - Opening stock
   - Optional: Add photo
4. Tap "Add Product"

### Making a Sale

1. Navigate to Sales tab
2. Tap products to add to cart
3. Review cart and tap "Checkout"
4. Select payment method
5. Complete sale
6. Share receipt with customer

### Managing Inventory

1. Navigate to Inventory tab
2. View stock levels and alerts
3. Edit products to adjust stock
4. Use "Adjust Stock" feature for easy updates

### Viewing Reports

1. Navigate to Reports tab
2. Select time period (Daily/Weekly/Monthly)
3. View sales statistics
4. Check payment method breakdown
5. Access calendar view for historical data

### Handling Outstanding Payments

1. Sales marked as "Pay Later" appear in Outstanding Payments
2. Access from Dashboard or Reports
3. Mark as paid when customer pays
4. Track total outstanding amounts

## Data Storage

All data is stored locally on your device using AsyncStorage. This means:
- ✅ Works offline
- ✅ Fast performance
- ✅ Privacy-focused (no cloud storage)
- ⚠️ Data is device-specific
- ⚠️ Uninstalling the app deletes all data

## Future Enhancements

Potential features for future versions:
- Customer management
- Expense tracking
- Profit & loss reports
- Supplier management
- Multi-user access
- Cloud backup
- E-commerce integration
- Barcode scanning

## Troubleshooting

### App won't start
```powershell
# Clear cache and restart
npm start --clear
```

### Dependencies issues
```powershell
# Reinstall dependencies
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install
```

### Reset app data
Use the "Reset Application" option in Settings (Danger Zone)

## Support

For issues or questions, check the Expo documentation:
- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)

## License

This project is for educational and small business use.

---

**Built with ❤️ for Malaysian micro and small businesses**
