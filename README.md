# InsaneTradex — Indian Stock Market Virtual Trading Simulator

A beginner/intermediate college Web Development project built with HTML, CSS, JavaScript and React.

## Features
- Dark responsive trading dashboard
- Sample NIFTY 50, SENSEX and BANK NIFTY index cards
- Sample Indian company stock list with search
- Stock selection and illustrative price chart
- Add/remove stocks from a watchlist
- Virtual buy and sell orders
- Virtual cash balance and portfolio holdings
- LocalStorage saves the demo account in the browser
- Reset demo account button

## Important
This is an educational simulation. It does not connect to NSE or BSE, does not display live market data, and does not place real trades. Prices and index values are illustrative sample data. No real money is involved.

## Requirements
- Node.js (LTS version)
- npm
- VS Code (recommended)

## Run locally
1. Extract the ZIP folder.
2. Open the `insanetradex` folder in VS Code.
3. Open the terminal in that folder.
4. Run:

```bash
npm install
npm run dev
```

5. Open the local URL printed by Vite (usually `http://localhost:5173`).

## Create production build

```bash
npm run build
```

Vite creates the production website inside the `dist` folder.

## Deploy using Vercel
1. Create a GitHub repository and upload the project files.
2. Sign in to Vercel using GitHub.
3. Choose **Add New → Project** and import your `insanetradex` repository.
4. Vercel detects Vite automatically.
5. Set Build Command to `npm run build` and Output Directory to `dist`.
6. Click Deploy.

## Project structure

```text
insanetradex/
├── index.html
├── package.json
├── README.md
└── src/
    ├── App.jsx
    ├── main.jsx
    └── styles.css
```

## Technology used
- HTML5 — page structure
- CSS3 — dark responsive interface
- JavaScript — trading calculations and interactions
- React — reusable UI and state management
- Recharts — sample stock chart
- LocalStorage — saves watchlist, balance and holdings
- Vite — development server and build tool
