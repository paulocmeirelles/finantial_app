# Feature: 1-1-2 Centralize Summary Layout

## Description
As a user, I want the Summary tab layout to be fully responsive so that the cards (Portfolio and Expenses Chart) adapt gracefully to any screen size, especially on mobile devices where a column layout is required.

## Requirements (Gherkin / Scenarios)

**Scenario 1: Viewing the Summary tab on a mobile device (cellphone)**
- **Given** the user accesses the application
- **And** the Summary tab is active
- **When** the screen size is small (e.g., mobile device width)
- **Then** the blocks (cards) inside the Summary tab should be organized using a column layout (`flex-direction: column`)
- **And** there should be guaranteed spacing between the cards and the screen borders (padding/margins) so they don't touch the edges

**Scenario 2: Viewing the Summary tab on a larger screen (tablet/desktop)**
- **Given** the user accesses the application
- **And** the Summary tab is active
- **When** the screen size is medium or large
- **Then** the blocks inside the Summary tab should adapt logically, utilizing the available width (e.g., side-by-side or responsive grid)
- **And** the space between the borders and elements must remain consistent and visually pleasing

## Technical Notes / Constraints (Optional)
- Use Tailwind CSS responsive utility classes (like `flex`, `flex-col`, `md:flex-row`, `gap-6`, `p-4`) to enforce the layout.
- Ensure that the container for the Summary tab overrides or adjusts the existing grid layout if `flex` provides a better centralization/adaptation strategy.
- Focus specifically on `#tab-summary` container and its direct children (`portfolioCard`, `expensesChart`).
