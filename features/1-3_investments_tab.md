# Feature: 1-3 Investments Tab

## Description
As a user, I want to have a detailed "Investments" tab so that I can track my portfolio's performance, view historical evolution and earnings, manage exports, and see a detailed breakdown of my assets.

## Requirements (Gherkin / Scenarios)

**Scenario 1: Viewing the Investments Summary (Card 1)**
- **Given** the user is on the Investments tab
- **When** the user views the first card
- **Then** it should display the total amount currently invested
- **And** it should display how much was earned or lost in both raw value and percentage
- **And** it should display the original invested amount

**Scenario 2: Viewing the Portfolio Evolution Chart (Card 2)**
- **Given** the user is on the Investments tab
- **When** the user views the second card
- **Then** a line chart should be displayed
- **And** the chart should contain a line representing the evolution of the assets over time
- **And** the chart should contain another line (colored red for loss or green for earn) representing the earnings/losses
- **And** the chart should display data spanning the previous 11 months and the current month

**Scenario 3: Viewing the Resources Buttons (Card 3)**
- **Given** the user is on the Investments tab
- **When** the user views the third card (positioned above or below the assets table)
- **Then** it should display the resources buttons
- **And** there should be a button to export the data from the assets table below

**Scenario 4: Viewing the Assets Table (Card 4)**
- **Given** the user is on the Investments tab
- **When** the user views the fourth card
- **Then** an assets table should be displayed
- **And** the table header should contain the following columns:
  - Product
  - Group
  - Invested
  - Gross Profit
  - Gross Return
  - Position Value
- **And** the table should list all the current assets matching these columns

## Technical Notes / Constraints (Optional)
- **Layout Order**: Ensure the cards flow logically, likely Summary -> Chart -> Resources -> Assets Table.
- **Chart Data**: The line chart must fetch and accurately plot 12 months of historical data (11 previous + current).
