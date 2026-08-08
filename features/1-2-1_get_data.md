# Feature: 1-2-1_get_data

## Description
This feature enables the application to fetch data dynamically based on its execution environment. If the application is running locally, it should retrieve data from the local `data` folder. If it is running on Google Apps Script, it should fetch the data from a folder named `data` in Google Drive. This ensures smooth transitions between local development and production environments.

## Requirements (Gherkin / Scenarios)
**Scenario 1: Fetching data in local environment**
- **Given** the application is running in a local environment
- **When** the application requests data
- **Then** the application should retrieve the data from the local `data` folder

**Scenario 2: Fetching data in Google Apps Script environment**
- **Given** the application is running on Google Apps Script
- **When** the application requests data
- **Then** the application should retrieve the data from a Google Drive folder named `data`

## Technical Notes / Constraints
- A mechanism is needed to detect the current execution environment (e.g., checking for the existence of `google.script.run` or `SpreadsheetApp`).
- In Google Apps Script, the DriveApp service should be used to locate the `data` folder and read its contents.
- In the local environment, standard fetch or local file reading APIs should be used depending on how the frontend is served.
- Data fetching methods in the UI (`loadData` in `index.html`) should be updated to use the appropriate abstraction.
