# Financial App

A comprehensive personal finance tracking and management application built with Google Apps Script (GAS) and HTML/JS frontend. This application provides a unified dashboard for tracking expenses, managing investments, and summarizing portfolio performance.

## 🚀 Features

The application is structured into three main tabs/views:

### 1. Summary
- **Portfolio Overview:** A high-level view of your current financial status.
- **Expenses Chart:** Visual summary of expenses for quick insights.

### 2. Expenses
- **Monthly Tracking:** Monitor spending and earnings filtered by month.
- **Financial Metrics:** Track the percentage and raw value differences between earnings and spendings, as well as capital available for investment.
- **Historical Analysis:** Bar charts displaying expenses across the last 4 months, categorized by segments.
- **Recurring Costs Handling:** Automatically accounts for fixed recurring costs (e.g., Spotify, Apple subscriptions) and installment plans (parcels).
- **Editable Expense Table:** View, filter, and edit expenses directly from the dashboard.
- **Resource Management:** Easily export data or add new entries.

### 3. Investments
- **Portfolio Tracking:** View total invested amounts, current balance, and earnings/losses in raw values and percentages.
- **Evolution Charts:** Line charts showing asset evolution over a 12-month period.
- **Asset Breakdown:** Detailed table displaying individual assets (Product, Group, Invested, Gross Profit, Gross Return, Position Value).
- **Export Capabilities:** Export your portfolio data for offline analysis.

## 🛠 Tech Stack

- **Backend:** Google Apps Script (`.js`/`.gs`) for handling logic, Google Sheets integration, and data processing.
- **Frontend:** HTML, CSS, and Vanilla JavaScript (`index.html`, `portfolioCard.html`, etc.) served via Google Apps Script's HTML Service.
- **APIs:** Integrations for real-time asset data (e.g., CoinGecko API for Bitcoin, currency exchange APIs for Dollar).
- **Deployment:** Managed via [clasp](https://github.com/google/clasp) (Command Line Apps Script Projects).

## 📁 Project Structure

```
├── .clasp.json             # Clasp configuration for GAS project
├── appsscript.json         # Apps Script manifest file
├── .env                    # Environment variables (e.g., API keys)
├── .gitignore              # Git ignore rules
├── index.html              # Main entry point for the UI
├── indexHeader.html        # Header and tab navigation UI
├── portfolioCard.html      # Portfolio summary component
├── expensesChart.html      # Expenses visualization component
├── assets.html             # Investment assets table component
├── buttonsResources.html   # Action buttons and modals (Export, Add, etc.)
├── main.js                 # Core frontend logic
├── archiving.js            # Logic for archiving and processing spreadsheet data
├── getBitCoin.js           # API integration for fetching BTC prices
├── getDolar.js             # API integration for fetching USD exchange rates
├── treatInvestmentTab.js   # Logic for processing investment data
├── updateMetrics.js        # Logic for calculating financial metrics
├── utils.js                # Shared utility functions
└── features/               # BDD Feature specifications (Gherkin format)
```

## ⚙️ Setup and Installation

### Prerequisites
- Node.js installed
- Google Clasp CLI installed (`npm install -g @google/clasp`)
- A Google account and a Google Sheet to act as the database.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/paulocmeirelles/finantial_app.git
   cd finantial_app
   ```

2. **Authenticate with Clasp:**
   ```bash
   clasp login
   ```

3. **Link to your Apps Script Project:**
   Update the `scriptId` in your `.clasp.json` to match your target Google Apps Script project.

4. **Environment Variables:**
   Create a `.env` file in the root directory and add your API keys (this file is ignored by git):
   ```env
   API_KEY_COINGECKO=your_coingecko_api_key_here
   ```

5. **Deploy the code:**
   Push the code to your Google Apps Script project using clasp:
   ```bash
   clasp push
   ```

## 📝 Specifications

The behavioral specifications of this app are documented using Gherkin syntax in the `features/` directory. They outline the expected user flows and scenarios for each tab in the application.

## 📄 License

This project is open-source and available for personal use.
