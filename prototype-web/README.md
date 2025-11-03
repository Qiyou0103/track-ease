# TrackEase — Web Prototype

This is a small mobile-first prototype for the TrackEase concept. It demonstrates:

- Initial setup (business name, currency)
- Add / update products with starting stock and price
- Record sales which reduce inventory
- Simple low-stock visual alert (<= 5)
- Export sales as a CSV

Files:
- `index.html` — main UI
- `style.css` — styles (mobile-first)
- `app.js` — small app logic using `localStorage`

How to open
1. In Windows PowerShell run:

```powershell
start .\prototype-web\index.html
```

2. The page will open in your default browser. Use DevTools (F12) and toggle the device toolbar to view mobile sizes.

Notes
- Data is stored locally in your browser (localStorage) and will persist unless cleared.
- This is a prototype: no backend, no authentication. It is intended for quick validation and demos.

Next steps you can request:
- Turn this into a single-page React prototype
- Add CSV import/export for inventory
- Wire to a backend (Node/Express or Firebase) for multi-device sync
