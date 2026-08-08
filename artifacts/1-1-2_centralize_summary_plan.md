# Implementation Plan: 1-1-2 Centralize Summary Layout

Based on `features/1-1-2_centralize_summary.md`, we need to update the layout for the Summary tab to ensure it uses a flex-based structure that stacks on mobile and centers the content with appropriate spacing.

## 1. UI Updates (`index.html`)
The current layout for the `#tab-summary` container uses a generic grid layout:
```html
<div id="tab-summary" class="tab-content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

- **Changes**: We will refactor this container to use a flexbox layout. By default (on mobile), it will use `flex-col` (column layout). On larger screens (`lg:`), it can switch to a row or a centralized responsive layout.
- **New HTML Structure**:
  ```html
  <div id="tab-summary" class="tab-content flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-6 w-full max-w-7xl mx-auto">
    <!-- Card 1: Portfolio -->
    <div class="w-full lg:w-1/2">
      <?!= include('portfolioCard'); ?>
    </div>

    <!-- Card 2: Expenses Chart -->
    <div class="w-full lg:w-1/2">
      <?!= include('expensesChart'); ?>
    </div>
  </div>
  ```

## 2. Component Updates (`portfolioCard.html` & `expensesChart.html`)
To ensure both cards stretch to equal heights within the new flex layout, we will update the inner container classes in both files.
- **Changes**: Add `h-full` and `flex flex-col` to the outermost `<div class="bg-white...">` of both components.
- **Example**:
  ```html
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col justify-between">
  ```

## 3. Rationale
- `flex flex-col` (on wrapper): Forces the cards into a vertical stack on mobile devices.
- `lg:flex-row`: Allows the cards to sit side-by-side on large screens (desktops).
- `items-center`: Centers the cards horizontally when stacked.
- `lg:items-stretch`: Forces the child wrappers to stretch to the same height.
- `gap-6`: Guarantees a safe and aesthetic space between the cards.
- `w-full lg:w-1/2` (on wrapper children): Ensures each card takes full width on mobile and splits the space evenly on desktop, without shrinking minimum widths.
- `h-full flex flex-col` (on inner cards): Ensures the white backgrounds stretch fully inside the wrappers to match equal heights.

## 4. Execution Steps
1. Open `index.html`.
2. Locate the `<div id="tab-summary">` element.
3. Replace its CSS classes from the grid setup to the flexbox setup.
4. Wrap the `<?!= include(...) ?>` statements in responsive wrapper divs (`w-full lg:w-1/2`) to ensure they fill the space without shrinking.
5. Open `portfolioCard.html` and `expensesChart.html`.
6. Add `h-full flex flex-col` to the outermost container to ensure they stretch to equal heights.
