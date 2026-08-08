# Implementation Plan: 1-1-1 Month Filter

Based on the feature requirements in `features/1-1-1_filter_month.md`, here is the plan to implement a dynamic month filter in the application header.

## 1. UI Updates (`indexHeader.html`)
We will add a dropdown (`<select>`) element for the month filter into the header.

- **Changes**: Add the dropdown to the right side of the header, inplace of the "Deploy Ativo" badge.
- **HTML Structure**:
  ```html
  <div class="flex items-center gap-3">
    <!-- New Month Filter -->
    <select id="selectDate" onchange="filterByDate()" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2">
      <!-- Options will be populated via JS -->
    </select>
  </div>
  ```

## 2. Data and Logic Updates (`index.html` / `main.js`)
We need to populate the dropdown dynamically based on the available data from the backend.

- **Extracting Months**:
  Create a function `populateMonthFilter(data)` that aggregates all available months from the fetched data (`allAssets` or `allExpensesData`). 
  
- **Sorting and Default Selection**:
  1. Determine the current month in the format `MMM-YYYY` (e.g., `AGO-2026`).
  2. If the current month exists in the available data, set the `<select>` value to the current month.
  3. If the current month does *not* exist, find the most recent month in the data and set that as the default value instead.
  
- **Modifying `loadData()`**:
  Update `loadData()` to call `populateMonthFilter()` once data is fetched successfully from `google.script.run`.

- **Refining `filterByDate()`**:
  Ensure that when the dropdown changes, `filterByDate()` is called to update all active UI components (Portfolio, Expenses, Investments) for the new month context.

## 3. Execution Steps
1. Add the `<select id="selectDate">` element to `indexHeader.html`.
2. Implement the `populateMonthFilter` JavaScript function in `index.html`.
3. Call `populateMonthFilter` within the existing `loadData` sequence after fetching data.
4. Verify that switching the month properly cascades changes via `filterByDate()`.
