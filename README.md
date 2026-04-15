# TrackEase

TrackEase is a React Native and Expo mobile app for small business sales, inventory, and basic credit tracking. It is designed for offline-first use on a single device, with local persistence handled through AsyncStorage.

## What It Does

TrackEase helps a shop owner or staff member:

- set up a business profile on first launch
- add and edit products with stock levels and categories
- record sales through a simple POS flow
- handle multiple payment methods, including pay-later sales
- monitor low-stock items and total inventory value
- review sales reports and payment breakdowns
- manage outstanding payments from one place

## Features

### Onboarding and Setup

- First-launch setup flow
- Mobile number, business name, and business type capture
- Custom receipt message
- Configurable low-stock threshold
- Saved business details for later editing in Settings

### Sales and Checkout

- Tab-based POS screen for browsing products
- Search and category filtering
- Cart management with quantity updates
- Checkout flow with order summary
- Payment methods:
  - Cash
  - DuitNow QR
  - Bank Transfer
  - Pay Later
- Receipt generation and sharing
- Automatic inventory deduction after checkout

### Inventory Management

- Product list with current stock levels
- Low-stock and out-of-stock indicators
- Total inventory value display
- Add new products
- Edit existing products
- Manual stock adjustments
- Optional product image upload

### Outstanding Payments

- List of unpaid sales
- Total outstanding amount summary
- Mark payments as paid
- Payment timestamp tracking

### Reports and Analytics

- Daily, weekly, and monthly views
- Sales calendar view
- Total sales and transaction counts
- Paid vs unpaid summaries
- Payment-method breakdown
- Top-selling products

### Settings

- Update business profile details
- Change receipt message
- Adjust low-stock threshold
- View app information
- Reset application data with confirmation

## Technology Stack

- React Native
- Expo
- React Navigation
- React Native Paper
- AsyncStorage
- Expo Image Picker
- Expo Sharing
- React Native Calendars
- Material Community Icons

## Project Structure

```text
track-ease/
├── App.js
├── app.json
├── babel.config.js
├── package.json
├── README.md
├── QUICKSTART.md
├── USER_GUIDE.md
├── PROJECT_SUMMARY.md
├── CHECKLIST.md
├── install.ps1
├── assets/
├── OnePage ver/
├── seperate ver/
└── src/
    ├── screens/
    │   ├── OnboardingScreen.js
    │   ├── DashboardScreen.js
    │   ├── SalesScreen.js
    │   ├── InventoryScreen.js
    │   ├── ReportsScreen.js
    │   ├── SettingsScreen.js
    │   ├── AddProductScreen.js
    │   ├── EditProductScreen.js
    │   ├── CheckoutScreen.js
    │   └── OutstandingPaymentsScreen.js
    └── utils/
        └── storage.js
```

The root app in [App.js](App.js) wires the onboarding stack, main tab navigator, and modal-style screens for add product, edit product, checkout, and outstanding payments.

## Requirements

- Node.js 14 or newer
- npm or yarn
- Expo CLI or the Expo tools bundled through `npx`
- Expo Go on a physical device for the easiest testing flow

## Installation

From the project root:

```powershell
npm install
```

## Run the App

Start the development server:

```powershell
npm start
```

Useful platform commands:

```powershell
npm run android
npm run ios
npm run web
```

Notes:

- Android and iOS mobile testing work best with Expo Go.
- iOS Simulator requires macOS.
- If the app is stuck on launch, restart with a cleared cache:

```powershell
npm start --clear
```

## First-Time Setup Flow

1. Open the app for the first time.
2. Complete the onboarding screens.
3. Enter your mobile number, business name, business type, receipt message, and low-stock threshold.
4. Finish setup to enter the main app.

The onboarding state is tracked locally, so the setup screen only appears on first launch unless app data is reset.

## Typical Usage

### Add a Product

1. Open the Inventory tab.
2. Tap the add button.
3. Enter the product name, price, quantity, and category.
4. Optionally add an image.
5. Save the product.

### Record a Sale

1. Open the Sales tab.
2. Search for products or filter by category.
3. Add items to the cart.
4. Open Checkout.
5. Choose a payment method and complete the sale.

### Handle Pay-Later Transactions

1. Complete a sale using Pay Later.
2. Open Outstanding Payments from the dashboard, reports, or the dedicated screen.
3. Mark the sale as paid when the customer settles the balance.

### Review Reports

1. Open the Reports tab.
2. Switch between daily, weekly, and monthly views.
3. Check totals, payment breakdowns, and top-selling products.
4. Use the calendar to review sales by date.

## Data Storage

TrackEase stores data locally on the device with AsyncStorage.

### Stored Data

- business info
- products
- sales
- categories

### Storage Characteristics

- works offline
- no cloud account required
- fast and lightweight
- device-specific data only
- uninstalling the app removes the data

## Data Model

### Business Info

```javascript
{
  businessName: string,
  businessType: string,
  mobileNumber: string,
  receiptMessage: string,
  lowStockThreshold: number,
  createdAt: ISODateString
}
```

### Product

```javascript
{
  id: string,
  name: string,
  price: number,
  quantity: number,
  category: string,
  image: string | null,
  createdAt: ISODateString
}
```

### Sale

```javascript
{
  id: string,
  items: Array<{
    id: string,
    name: string,
    price: number,
    quantity: number,
    newQuantity: number
  }>,
  total: number,
  paymentMethod: string,
  isPaid: boolean,
  paidAt: string | null,
  createdAt: string
}
```

## Navigation Overview

- Onboarding screen on first launch
- Main tab navigator for Dashboard, Sales, Inventory, Reports, and Settings
- Additional stack screens for Add Product, Edit Product, Checkout, and Outstanding Payments

## Troubleshooting

### App will not start

```powershell
npm start --clear
```

### Dependencies seem broken

```powershell
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install
```

### Reset the app

Use the Reset Application option in Settings if you want to clear local data and restart onboarding.

## Related Documentation

- [QUICKSTART.md](QUICKSTART.md) for the shortest setup path
- [CHECKLIST.md](CHECKLIST.md) for installation checks
- [USER_GUIDE.md](USER_GUIDE.md) for end-user instructions
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for architecture and feature details

## License

This project is intended for educational and small business use.

---


