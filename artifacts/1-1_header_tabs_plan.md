# Implementation Plan: Header Tabs Navigation

Based on the feature requirements in `features/1-1_header_tabs.md`, here is the plan to implement the navigation tabs (Summary, Expenses, Investments) across the dashboard.

## 1. Update Header Component (`indexHeader.html`)
We will modify the header to include a tab navigation menu.
- **Current State**: The header only shows a title ("Visão Geral de Investimentos") and a "Deploy Ativo" badge.
- **Changes**: Add a flex container below or next to the title with three clickable tabs:
  - **Resumo** (Summary)
  - **Despesas** (Expenses)
  - **Investimentos** (Investments)
- Use Tailwind CSS to style the active and inactive states of these tabs (e.g., active tab has a bottom border and primary text color, inactive tabs have gray text).

## 2. Restructure Main Layout (`index.html`)
Currently, all components (`portfolioCard`, `expensesChart`, `buttonsResources`, `assets`) are loaded into a single CSS Grid. We will separate them into logical tab containers.

- **Changes**:
  - Wrap the components in three separate `div` containers:
    - `<div id="tab-summary" class="tab-content">`
      - Will include: `portfolioCard` and `expensesChart` (as per Scenario 1).
    - `<div id="tab-expenses" class="tab-content hidden">`
      - Will serve as the container for Expenses (Scenario 2). Initially, we can place a placeholder or move related expense components here if applicable.
    - `<div id="tab-investments" class="tab-content hidden">`
      - Will serve as the container for Investments (Scenario 3). We can place the `assets` table and `buttonsResources` here for now, or adapt them based on the 1-3 feature.
  
## 3. Add Tab Switching Logic
Implement JavaScript to handle the tab navigation.

- **Changes** (in `index.html` or a new `main.js` script block):
  - Function `switchTab(tabId)`:
    1. Hide all elements with the class `.tab-content`.
    2. Show the element corresponding to the selected `tabId`.
    3. Update the styling on the header tabs to reflect the currently active tab visually.
  - Add `onclick="switchTab('summary')"` etc. to the tab buttons in the header.

## 4. Execution Steps
1. Edit `indexHeader.html` to add the UI for the tabs.
2. Edit `index.html` to create the three tab containers (`#tab-summary`, `#tab-expenses`, `#tab-investments`).
3. Inject the appropriate Apps Script includes (`<?!= include('...'); ?>`) into each container based on the scenarios.
4. Add the Javascript logic in `index.html` to toggle the `.hidden` class on the containers and update tab styles.
5. Test the UI to ensure smooth transitions between views.
