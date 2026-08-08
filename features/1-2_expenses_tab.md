# Feature: 1-2 Expenses Tab

## Description
As a user, I want to have a detailed "Expenses" tab so that I can analyze my spending, view historical data across the last 4 months, manage my resources, and view/edit my expenses for a selected month.

## Requirements (Gherkin / Scenarios)

**Scenario 1: Viewing the Summary Card (Card 1)**
- **Given** the user is on the Expenses tab
- **And** a specific month is selected in the month filter
- **When** the user views the first card
- **Then** it should display the total amount spent for the selected month
- **And** it should display the total amount earned for the selected month
- **And** it should display the difference between earnings and spendings in both percentage and raw value, separated by a slash (e.g., "15% / $500")
- **And** it should display the total amount available to invest

**Scenario 2: Viewing the Historical Expenses Bar Chart (Card 2)**
- **Given** the user is on the Expenses tab
- **When** the user views the second card
- **Then** a bar chart should be displayed showing data for the current month, the previous 4 months and the 3 future months
- **And** the expenses in the chart should be separated by segments/categories
- **And** the chart data must correctly account for recurring costs (e.g., Spotify, Apple account) and bills with installments (parcels)

**Scenario 3: Viewing the Resources Buttons (Card 3)**
- **Given** the user is on the Expenses tab
- **When** the user views the third card (positioned below the editable table)
- **Then** it should display the resources buttons (e.g., export, add new, etc.)

**Scenario 4: Viewing the Editable Expenses Table (Card 4)**
- **Given** the user is on the Expenses tab
- **And** a specific month is selected in the month filter
- **When** the user views the fourth card (positioned above the resources card)
- **Then** an editable table should be displayed
- **And** the table should list all expenses filtered by the currently selected month
- **And** the user should be able to edit the expense entries directly within the table

## Technical Notes / Constraints (Optional)
- **Recurring Costs & Installments**: Ensure the logic correctly calculates recurring fixed items (like 'spotify', 'conta apple') and items with 'x' parcels based on the archiving logic.
- **Layout Order**: 
  1. Summary Card
  2. Bar Chart (Last 4 months, current month and 3 future months)
  4. Resources Buttons (Card 3)
  3. Editable Table (Card 4)
