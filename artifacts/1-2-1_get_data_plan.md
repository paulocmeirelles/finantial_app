# Implementation Plan: 1-2-1_get_data

Based on the feature requirements in `features/1-2-1_get_data.md`, this plan defines the implementation steps needed to support environment-aware data loading in the application.

## Goal

Enable the app to fetch JSON data from the local `data` folder when running locally, and from a Google Drive folder named `data` when running in Google Apps Script.

## 1. Environment Detection

Create a simple abstraction to detect whether the app is running in Google Apps Script or locally.

- Use the presence of `google.script?.run` or `typeof SpreadsheetApp !== 'undefined'` as the Apps Script indicator.
- Otherwise, treat the environment as local.

## 2. Local Data Loader

Implement a local data loader for development.

- Use `fetch('./data/<filename>.json')` or the existing frontend data-loading abstraction already used in `index.html` / `main.js`.
- Ensure local fetch can access the `data` folder from the app root when served via a local web server.

## 3. Google Apps Script Data Loader

Implement an Apps Script-side loader to read files from the Drive folder named `data`.

- Use `DriveApp.getFoldersByName('data')` to locate the folder.
- Read file contents from the folder and return the JSON as string data.
- Add a script endpoint or handler function (e.g. `getDataFile(filename)`) that can be called from the client using `google.script.run`.

## 4. Data Fetch Abstraction

Add a reusable function such as `loadDataFile(filename)` that delegates to the appropriate loader based on the detected environment.

- In local mode: `await fetchLocalData(filename)`
- In Apps Script mode: `await fetchAppsScriptData(filename)`
- Return parsed JSON for the rest of the UI to consume.

## 5. Update Existing UI Data Loading

Update the existing `loadData()` logic in `index.html` / `main.js` to use the new abstraction.

- Replace direct local fetch or Apps Script calls with `loadDataFile()`.
- Use it for the expense tab, investments tab, and any other module that loads JSON data.

## 6. Validation and Testing

Verify both execution paths.

- Local environment: confirm `data/expenses.json`, `data/incoming.json`, `data/investment.json`, and `data/stocks.json` load correctly.
- Apps Script environment: confirm the same files load from Drive folder `data` when deployed.

## Notes

- Keep the environment check lightweight and easy to maintain.
- If the local runner needs a development fallback folder, document it in the code comments.
- Avoid hardcoding absolute file paths; use relative file names within the `data` folder.
