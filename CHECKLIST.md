# TrackEase Setup Checklist

Use this checklist to get TrackEase up and running!

## ✅ Pre-Installation

- [ ] Node.js installed (version 14 or higher)
  - Check: Run `node --version` in PowerShell
  - Download from: https://nodejs.org/

- [ ] npm installed (comes with Node.js)
  - Check: Run `npm --version` in PowerShell

- [ ] Smartphone ready (Android or iOS)

- [ ] Expo Go app installed on phone
  - Android: Google Play Store
  - iOS: App Store

## ✅ Installation

- [ ] Open PowerShell in the trackease folder
  - Right-click folder → "Open in Terminal" or "Open PowerShell here"

- [ ] Run installation
  ```powershell
  npm install
  ```
  - Wait for completion (2-5 minutes)
  - Should see "added XXX packages"

- [ ] (Optional) Run the install script
  ```powershell
  .\install.ps1
  ```

## ✅ Assets (Optional but Recommended)

- [ ] Create app icon (1024x1024 px)
  - Save as: `assets/icon.png`
  - Tip: Simple green background with "TE" text

- [ ] Create splash screen (1284x2778 px or similar)
  - Save as: `assets/splash.png`
  - Tip: Green background with app name

- [ ] Create adaptive icon for Android (1024x1024 px)
  - Save as: `assets/adaptive-icon.png`

*Note: App will work with default Expo icons if you skip this*

## ✅ First Run

- [ ] Start the development server
  ```powershell
  npm start
  ```

- [ ] Wait for QR code to appear in terminal

- [ ] Scan QR code with phone
  - **Android**: Open Expo Go app → Scan QR
  - **iOS**: Open Camera app → Scan QR → Open in Expo Go

- [ ] App should load on your phone!

## ✅ Initial Setup (In the App)

- [ ] Complete onboarding
  - [ ] Enter mobile number
  - [ ] Enter business name and type
  - [ ] Set receipt message
  - [ ] Set low stock threshold

- [ ] Add your first products
  - [ ] At least 3-5 products to test with
  - [ ] Include name, category, price, stock

## ✅ Test Features

- [ ] Make a test sale
  - [ ] Add products to cart
  - [ ] Complete checkout
  - [ ] Try different payment methods

- [ ] Check inventory
  - [ ] View stock levels
  - [ ] Edit a product
  - [ ] Adjust stock quantities

- [ ] View dashboard
  - [ ] See today's sales
  - [ ] Check top products

- [ ] Check reports
  - [ ] View daily report
  - [ ] Try weekly/monthly views
  - [ ] Check calendar

- [ ] Test credit tracking
  - [ ] Make sale with "Pay Later"
  - [ ] View in Outstanding Payments
  - [ ] Mark as paid

- [ ] Modify settings
  - [ ] Edit business info
  - [ ] Update receipt message

## ✅ Troubleshooting Checks

If something doesn't work:

- [ ] Phone and computer on same WiFi?
- [ ] QR code scanning failed?
  - [ ] Try manual URL entry in Expo Go
  - [ ] Check firewall settings

- [ ] App won't refresh?
  - [ ] Shake phone → Reload
  - [ ] Press 'r' in PowerShell terminal

- [ ] Errors in terminal?
  - [ ] Clear cache: `npm start --clear`
  - [ ] Reinstall: Delete node_modules, run `npm install`

- [ ] White screen on phone?
  - [ ] Check terminal for errors
  - [ ] Reload app on phone

## ✅ Production Readiness (When Ready to Deploy)

- [ ] Test all features thoroughly
- [ ] Add real product data
- [ ] Test with real transactions
- [ ] Train staff on usage
- [ ] Create backup plan for data
- [ ] Consider building standalone app
  - Run: `expo build:android` or `expo build:ios`

## 📚 Documentation Read

- [ ] README.md - Full documentation
- [ ] QUICKSTART.md - Quick start guide
- [ ] USER_GUIDE.md - Business owner guide (Malay/English)
- [ ] PROJECT_SUMMARY.md - Technical overview

## 🎯 Next Steps

Once everything works:

1. **Daily Use**:
   - Record all sales immediately
   - Check stock levels daily
   - Update outstanding payments

2. **Weekly Tasks**:
   - Review weekly reports
   - Restock low items
   - Check payment status

3. **Monthly Planning**:
   - Analyze monthly trends
   - Identify best sellers
   - Plan inventory

## 🎉 Completion

- [ ] All features tested ✓
- [ ] Team trained ✓
- [ ] Ready to use daily ✓

**Congratulations! TrackEase is ready to help your business! 🚀**

---

## Quick Command Reference

```powershell
# Start app
npm start

# Start with cache cleared
npm start --clear

# Install dependencies
npm install

# Reinstall from scratch
Remove-Item node_modules -Recurse -Force
npm install
```

---

**Need Help?** Check the documentation files or search for the error message online.

**Good luck with your business! 💚**
