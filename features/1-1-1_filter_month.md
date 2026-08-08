# Feature: 1-1-1 Month Filter

## Description
As a user, I want to have a month filter available in the application header so that I can easily view and manage my financial data (expenses, investments, and summary) based on a specific month. The filter should be smart enough to default to the current month or the most recent available month.

## Requirements (Gherkin / Scenarios)

**Scenario 1: Defaulting to the current month when data exists**
- **Given** the user opens the application
- **And** there is financial data available for the current month
- **When** the header is loaded
- **Then** the month filter in the header should be visible
- **And** it should be pre-selected to the current month

**Scenario 2: Defaulting to the last month when current month data does not exist**
- **Given** the user opens the application
- **And** there is no financial data available for the current month yet
- **When** the header is loaded
- **Then** the month filter in the header should be visible
- **And** it should be pre-selected to the last available month (e.g., the previous month)

**Scenario 3: Changing the selected month**
- **Given** the user is viewing the application
- **When** the user clicks on the month filter in the header
- **And** selects a different month from the dropdown list
- **Then** the application should filter and display the data corresponding to the newly selected month across the active tabs

## Technical Notes / Constraints (Optional)
- **Data Availability Check**: The logic must verify the list of available months in the dataset to determine if the current month exists before setting the default value.
- **Location**: The filter should be prominently placed in the header component (`indexHeader.html`) so it is accessible from any tab (Summary, Expenses, Investments).
