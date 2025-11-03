# TrackEase - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies

Open PowerShell in the project directory and run:

```powershell
npm install
```

Wait for all packages to install (may take 2-5 minutes).

### Step 2: Create App Icons (Optional)

The app needs icon images. For a quick start:

1. Download any 1024x1024 image or create a simple green square
2. Save as `icon.png`, `adaptive-icon.png`, and `splash.png` in the `assets` folder
3. Or skip this - Expo will use default icons

### Step 3: Start the App

```powershell
npm start
```

Then scan the QR code with the **Expo Go** app on your phone.

---

## 📱 Testing on Your Phone

### Android
1. Install "Expo Go" from Google Play Store
2. Open Expo Go
3. Scan the QR code from your computer terminal

### iOS (iPhone)
1. Install "Expo Go" from App Store
2. Open Camera app
3. Scan the QR code
4. Tap the notification to open in Expo Go

---

## 🎯 First Time Using the App

1. **Welcome Screen**: Enter your mobile number
2. **Business Setup**: Enter business name and type
3. **Settings**: Customize receipt message and low stock threshold
4. **Add Products**: Start by adding 2-3 products to test
5. **Make a Sale**: Go to Sales tab, tap products, checkout
6. **View Dashboard**: See your sales summary

---

## 💡 Key Features to Try

### Add a Product
- Tap Inventory → + button
- Fill in: Name, Category, Price, Stock
- Save

### Make Your First Sale
- Tap Sales tab
- Tap a product to add to cart
- Tap Checkout
- Select payment method
- Complete sale

### Track Payments
- Make a sale with "Pay Later" payment
- View in Outstanding Payments
- Mark as paid when customer pays

### View Reports
- Tap Reports tab
- See daily sales
- Switch to weekly/monthly view
- Check payment method breakdown

---

## 🔧 Common Commands

```powershell
# Start the app
npm start

# Start and clear cache
npm start --clear

# Install new dependencies
npm install

# Run on Android emulator (if installed)
npm run android

# Run on iOS simulator (Mac only)
npm run ios
```

---

## ⚠️ Troubleshooting

### "Cannot find module" errors
```powershell
Remove-Item node_modules -Recurse -Force
npm install
```

### App won't refresh on phone
- Shake your phone
- Tap "Reload" in the menu
- Or press `r` in the terminal

### QR code won't scan
- Make sure phone and computer are on same WiFi
- Try using Expo Go's "Enter URL manually" option
- Copy the `exp://` URL from terminal

### Port already in use
- Close other Metro bundler instances
- Or press `r` to restart in terminal

---

## 📚 Learning Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Tutorial](https://reactnative.dev/docs/tutorial)
- [React Navigation Guide](https://reactnavigation.org/docs/getting-started)

---

## 🎨 Customization Ideas

1. **Change Colors**: Edit the green (#4CAF50) in screen files
2. **Add Categories**: Edit the categories array in storage.js
3. **Receipt Format**: Modify generateReceiptText in CheckoutScreen.js
4. **Currency**: Change "RM" to your currency throughout the app

---

## 📊 Sample Data for Testing

Try adding these products:

**Food Category:**
- Nasi Lemak - RM 5.00 - Stock: 20
- Roti Canai - RM 2.50 - Stock: 30
- Mee Goreng - RM 6.00 - Stock: 15

**Drinks Category:**
- Teh Tarik - RM 2.00 - Stock: 50
- Kopi O - RM 1.80 - Stock: 50
- Air Sirap - RM 1.50 - Stock: 40

Then make a few test sales to see the reports!

---

## 🆘 Need Help?

If you encounter issues:
1. Check the main README.md for detailed documentation
2. Google the error message
3. Check Expo documentation
4. Make sure all dependencies are installed correctly

---

**Happy Tracking! 🎉**
