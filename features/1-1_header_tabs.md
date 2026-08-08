# Feature: Header Tabs Navigation

## Description
As a user, I want to navigate between different views of my financial data using 3 tabs in the header (Summary, Expenses, and Investments) so that I can easily find the specific information I am looking for.

## Requirements (Gherkin / Scenarios)
**Scenario 1: Viewing the Summary tab**
- **Given** the user is on the application dashboard
- **When** the user clicks on the "Summary" tab in the header
- **Then** the application should display the Summary view
- **And** the view should show only the portfolio card and the expenses chart

**Scenario 2: Viewing the Expenses tab**
- **Given** the user is on the application dashboard
- **When** the user clicks on the "Expenses" tab in the header
- **Then** the application should display the Expenses view
- **And** the view should show the first card containing information about:
  - how much is spent
  - how much is earned
  - percentage of difference

**Scenario 3: Viewing the Investments tab**
- **Given** the user is on the application dashboard
- **When** the user clicks on the "Investments" tab in the header
- **Then** the application should display the Investments view
- **And** the corresponding investment information should be shown

## Technical Notes / Constraints (Optional)
- The header should clearly indicate which tab is currently active.
- Ensure smooth transitions between the tab views.
