# Implementation Plan: 1-2 Expenses Tab

Based on the feature requirements in `features/1-2_expenses_tab.md`, this plan defines how to implement the Expenses tab with the summary, chart, resources actions, and editable table for filtered monthly expenses.

## Goal

Build a complete Expenses tab that allows users to:

- view monthly income, expenses, and investment availability
- see expense history across a rolling period
- manage expense and income entries
- edit and filter expenses by month

## 1. Layout and Page Structure

Use the existing tab structure in `index.html` and populate the Expenses tab with:

- Summary card (Card 1)
- Historical expenses chart (Card 2)
- Resources buttons and actions (Card 3)
- Editable expenses table (Card 4)

Ensure the layout order follows:

1. Summary card
2. Bar chart
3. Resources buttons
4. Editable table

## 2. Summary Card

Create or update the `portfolioCard`/summary card logic to display:

- total amount spent for the selected month
- total amount earned for the selected month
- difference between earnings and spendings as `percentage / raw value`
- total available to invest (income minus expenses)

Implementation details:

- Add helper functions that compute `totalIncome`, `totalExpenses`, and `availableToInvest` for the selected month.
- Display the results in the existing summary UI elements.
- Update values whenever the month filter changes.

## 3. Historical Expense Chart

Use the existing chart card (`expensesChart.html`) or extend it to show:

- bar chart covering the last 4 months, current month, and next 3 months when available
- expense totals per month
- segment/category breakdown per month in a tooltip or legend

Technical details:

- Normalize month labels to `MMM-YYYY` format.
- Sort dates chronologically before rendering.
- Build segment-level data for the chart tooltip using existing `expenseTrend.segments` structure.
- Ensure recurring costs and installment logic are represented in the source expense data or preprocessing layer.

## 4. Resource Buttons and Actions

Keep the existing buttons in `buttonsResources.html` and ensure they work for Expenses tab use cases:

- add income
- add expenses
- download expenses data

Additional enhancements:

- validate row data before saving
- show a fallback or notification if save actions are not allowed in local mode
- maintain chart/table refresh after successful insertions

## 5. Editable Expenses Table

Implement the expense table in `assets.html` or a new component with:

- a table listing expense records filtered by selected month
- inline editing support for expense rows
- dynamic updates when the user changes the month filter
- fallback message when no records exist for the selected month

Implementation notes:

- Use `allExpensesData` or a dedicated `expensesList` array to store parsed expense entries.
- Filter entries by the selected `MMM-YYYY` key.
- Re-render the table on filter changes and after save operations.
- Add an edit/save workflow using native inputs or a modal.

## 6. Filtering and Month Selection

Reuse the central month filter in `indexHeader.html` so the selected month applies globally:

- keep `selectDate` dropdown in the header
- update all summaries, chart, and tables when the dropdown changes
- default to the current month if present, otherwise the latest available month

## 7. Recurring Costs and Installments

Add preprocessing logic or data transformations to support recurring costs and parcel billing:

- recognize recurring descriptions like Spotify, Apple accounts, etc.
- handle items with installments (`x` parcels) by distributing values across months if needed
- keep the expense breakdown accurate in both chart and summary views

## 8. Validation and Testing

Verify end-to-end behavior for the Expenses tab:

- month selection updates summary, chart, and table
- summary shows income, expenses, and difference correctly
- chart displays the expected months and values
- resources buttons open and commit new data correctly
- editable table filters and renders data for the selected month

## 9. Notes

- Keep the implementation aligned with existing app patterns in `index.html`, `main.js`, and included HTML fragments.
- Avoid duplicated dropdowns and keep `selectDate` as the single source of truth.
- If local mode is detected, ensure the Expenses tab still loads correctly from `data/expenses.json` and `data/incoming.json`.
