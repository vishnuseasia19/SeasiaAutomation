# User Attendance Page — Playwright Automation Guide

> **Project:** SEASIA HR Portal — User Attendance Module  
> **Tool:** Playwright with JavaScript  
> **Pattern:** Page Object Model (POM)  
> **Author:** QA Automation Team  
> **Last Updated:** April 2026

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Prerequisites & Setup](#2-prerequisites--setup)
3. [Page Object Model — AttendancePage](#3-page-object-model--attendancepage)
4. [Dynamic Row Handling](#4-dynamic-row-handling)
5. [CSS State Verification](#5-css-state-verification)
6. [Functional Test Cases](#6-functional-test-cases)
   - [TC-01: Positive — Select Month and Verify Data Period](#tc-01-positive--select-month-and-verify-data-period)
   - [TC-02: Boundary — No Data for Selected Year](#tc-02-boundary--no-data-for-selected-year)
   - [TC-03: Action-Based — Apply For Attendance Button](#tc-03-action-based--apply-for-attendance-button)
7. [Column Index Reference](#7-column-index-reference)
8. [Row Status Color Reference](#8-row-status-color-reference)
9. [Running the Tests](#9-running-the-tests)
10. [Best Practices & Notes](#10-best-practices--notes)

---

## 1. Project Structure

```
project-root/
├── pages/
│   └── attendance-page.js        # POM class for User Attendance page
├── tests/
│   └── attendance/
│       ├── attendance-positive.spec.js
│       ├── attendance-boundary.spec.js
│       └── attendance-action.spec.js
├── utils/
│   └── color-helpers.js          # RGB / CSS assertion helpers
├── playwright.config.js
└── README.md                     # This file
```

---

## 2. Prerequisites & Setup

### Install dependencies

```bash
npm init -y
npm install -D @playwright/test
npx playwright install
```

### playwright.config.js

```javascript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'https://your-seasia-portal-url.com',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  reporter: [['html', { outputFolder: 'playwright-report' }]],
});
```

---

## 3. Page Object Model — AttendancePage

The `AttendancePage` class encapsulates all locators and actions for the User Attendance page. Every test imports this class — no raw `page.locator()` calls should appear in test files.

### File: `pages/attendance-page.js`

```javascript
const { expect } = require('@playwright/test');

class AttendancePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Filter controls ──────────────────────────────────────────
    this.yearDropdown  = page.locator('select[name="year"]');
    this.monthDropdown = page.locator('select[name="month"]');

    // ── Action buttons ───────────────────────────────────────────
    this.applyBtn             = page.getByRole('button', { name: 'Apply For Attendance' });
    this.viewRequestsBtn      = page.getByRole('button', { name: 'View Attendance Requests' });

    // ── Table ────────────────────────────────────────────────────
    this.tableBody = page.locator('table tbody');
    this.tableRows = page.locator('table tbody tr');

    // ── Empty state (shown when no data exists) ──────────────────
    this.emptyStateMsg = page.locator('[data-testid="empty-attendance-msg"]');
  }

  // ── Navigation ────────────────────────────────────────────────

  async navigate() {
    await this.page.goto('/attendance');
    await this.page.waitForLoadState('networkidle');
  }

  // ── Filter actions ────────────────────────────────────────────

  /**
   * Select a year from the Year dropdown.
   * @param {string} year  e.g. '2026'
   */
  async selectYear(year) {
    await this.yearDropdown.selectOption({ label: year });
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Select a month from the Month dropdown.
   * @param {string} month  e.g. 'April'
   */
  async selectMonth(month) {
    await this.monthDropdown.selectOption({ label: month });
    await this.page.waitForLoadState('networkidle');
  }

  // ── Table helpers ─────────────────────────────────────────────

  /**
   * Returns a row locator scoped to the given date string.
   * Uses :text-is() for an exact match (avoids partial matches).
   * @param {string} date  e.g. '07 Apr, 2026'
   * @returns {import('@playwright/test').Locator}
   */
  getRowByDate(date) {
    return this.tableBody.locator(`tr:has(td:text-is("${date}"))`);
  }

  /**
   * Returns the text content of a specific cell in a row.
   * @param {import('@playwright/test').Locator} row
   * @param {number} colIndex  0-based column index (see Column Index Reference)
   * @returns {Promise<string>}
   */
  async getCellValue(row, colIndex) {
    return (await row.locator('td').nth(colIndex).textContent())?.trim() ?? '';
  }

  /**
   * Returns the computed background-color of a row.
   * @param {import('@playwright/test').Locator} row
   * @returns {Promise<string>}  e.g. 'rgb(34, 197, 94)'
   */
  async getRowBackgroundColor(row) {
    return row.evaluate(el => getComputedStyle(el).backgroundColor);
  }

  // ── Button actions ────────────────────────────────────────────

  async clickApplyForAttendance() {
    await this.applyBtn.click();
  }

  async clickViewAttendanceRequests() {
    await this.viewRequestsBtn.click();
  }
}

module.exports = { AttendancePage };
```

---

## 4. Dynamic Row Handling

### How it works

Playwright's `:has()` pseudo-class lets you scope a row by any cell value without relying on fragile XPath or row index.

```
table tbody
  └── tr:has(td:text-is("07 Apr, 2026"))   ← scoped row
        └── td.nth(4)                        ← Status cell
```

### Code snippet — verify a row's status

```javascript
const { test, expect } = require('@playwright/test');
const { AttendancePage } = require('../../pages/attendance-page');

test('row for 07 Apr 2026 should show Present status', async ({ page }) => {
  const attendance = new AttendancePage(page);
  await attendance.navigate();

  // Get the row by its exact date text
  const row = attendance.getRowByDate('07 Apr, 2026');

  // Assert the row exists (fails gracefully if date is missing)
  await expect(row).toBeVisible();

  // Assert the Status cell (column index 4) contains 'Present'
  const statusCell = row.locator('td').nth(4);
  await expect(statusCell).toHaveText('Present');
});
```

### Why `:text-is()` and not `:text()`?

| Selector | Behavior | Risk |
|---|---|---|
| `td:text("07 Apr")` | Partial match | Matches unintended rows |
| `td:text-is("07 Apr, 2026")` | Exact match | Safe — what we use |

---

## 5. CSS State Verification

The attendance table uses row background colors to visually communicate attendance status.

### Color mapping

| Status | Background | RGB value |
|---|---|---|
| Present | Green | `rgb(34, 197, 94)` *(inspect DevTools to confirm exact value)* |
| Short Leave | Orange | inspect in DevTools |
| Half Day | Yellow | inspect in DevTools |
| Absent | Red | inspect in DevTools |
| Worked on Sat/Sun | Cyan | inspect in DevTools |
| Lop Leave / On Holiday | None / White | `rgba(0, 0, 0, 0)` or `rgb(255, 255, 255)` |

> **Important:** Always verify the exact `rgb()` string using Chrome DevTools → Computed tab before hardcoding it in tests. The framework may use slightly different shade values.

### Approach 1 — `toHaveCSS()` (preferred)

```javascript
test('Present row should have green background', async ({ page }) => {
  const attendance = new AttendancePage(page);
  await attendance.navigate();

  const row = attendance.getRowByDate('07 Apr, 2026');

  // Playwright's built-in CSS assertion
  await expect(row).toHaveCSS('background-color', 'rgb(34, 197, 94)');
});
```

### Approach 2 — `evaluate()` with custom assertion

```javascript
test('Lop Leave row should NOT have green background', async ({ page }) => {
  const attendance = new AttendancePage(page);
  await attendance.navigate();

  const row = attendance.getRowByDate('03 Apr, 2026');  // Lop Leave row

  const bg = await attendance.getRowBackgroundColor(row);

  // White or fully transparent = no status color
  const neutralColors = ['rgba(0, 0, 0, 0)', 'rgb(255, 255, 255)', 'transparent'];
  expect(neutralColors).toContain(bg);
});
```

### Approach 3 — Verify class names (if the app uses CSS classes)

```javascript
test('Present row should carry the present CSS class', async ({ page }) => {
  const attendance = new AttendancePage(page);
  await attendance.navigate();

  const row = attendance.getRowByDate('07 Apr, 2026');

  // If the app applies a class like 'row-present' instead of inline style
  await expect(row).toHaveClass(/row-present/);
});
```

---

## 6. Functional Test Cases

---

### TC-01: Positive — Select Month and Verify Data Period

**Objective:** Confirm that selecting a specific year and month filters the table to show only records from that period.

**Steps:**

1. Navigate to `/attendance`
2. Select Year = `2026`
3. Select Month = `April`
4. Assert all date cells in the table contain `Apr, 2026`
5. Assert no rows from other months are visible

**Code:**

```javascript
const { test, expect } = require('@playwright/test');
const { AttendancePage } = require('../../pages/attendance-page');

test.describe('TC-01 | Positive — Month filter', () => {
  test('selecting April 2026 shows only April records', async ({ page }) => {
    const attendance = new AttendancePage(page);
    await attendance.navigate();

    // Apply filters
    await attendance.selectYear('2026');
    await attendance.selectMonth('April');

    // Wait for table to re-render
    await expect(attendance.tableBody).toBeVisible();

    // Collect all date cells
    const dateCells = attendance.tableBody.locator('tr td:first-child');
    const count = await dateCells.count();

    // Assert: every date belongs to April 2026
    for (let i = 0; i < count; i++) {
      const text = (await dateCells.nth(i).textContent())?.trim();
      expect(text).toMatch(/Apr, 2026/);
    }

    // Assert: at least one row is returned
    expect(count).toBeGreaterThan(0);
  });
});
```

**Expected Result:** All visible rows have dates containing `Apr, 2026`. Zero rows from March or May.

---

### TC-02: Boundary — No Data for Selected Year

**Objective:** Verify the UI handles gracefully when no attendance records exist for a selected year — no crash, no empty white screen, a clear empty state.

**Steps:**

1. Navigate to `/attendance`
2. Select Year = `2020` *(or any year with no recorded data)*
3. Select Month = `January`
4. Wait for the network to settle
5. Assert the table contains zero rows OR an empty-state message is visible
6. Assert no console errors or HTTP 5xx responses

**Code:**

```javascript
const { test, expect } = require('@playwright/test');
const { AttendancePage } = require('../../pages/attendance-page');

test.describe('TC-02 | Boundary — No data year', () => {
  test('selecting a year with no data shows empty state', async ({ page }) => {
    // Listen for network errors
    const failedRequests = [];
    page.on('response', response => {
      if (response.status() >= 500) failedRequests.push(response.url());
    });

    const attendance = new AttendancePage(page);
    await attendance.navigate();

    await attendance.selectYear('2020');
    await attendance.selectMonth('January');

    // Either: zero rows in the table body
    const rowCount = await attendance.tableRows.count();

    if (rowCount === 0) {
      // Empty table is acceptable
      expect(rowCount).toBe(0);
    } else {
      // Or: an explicit empty-state message is shown
      await expect(attendance.emptyStateMsg).toBeVisible();
    }

    // No server errors
    expect(failedRequests).toHaveLength(0);
  });
});
```

**Expected Result:** Either `tbody` has 0 rows, or an "No records found" message appears. No JS exceptions. No HTTP 500 responses.

---

### TC-03: Action-Based — Apply For Attendance Button

**Objective:** Verify that clicking "Apply For Attendance" triggers the expected UI response — a modal dialog or a navigation to an apply form.

**Steps:**

1. Navigate to `/attendance`
2. Assert the `Apply For Attendance` button is visible and enabled
3. Intercept the outgoing network request
4. Click the button
5. Assert: modal dialog appears OR URL changes to an apply route
6. Assert: button shows a loading state while the request is in flight (if applicable)
7. Assert: no duplicate API requests are fired

**Code:**

```javascript
const { test, expect } = require('@playwright/test');
const { AttendancePage } = require('../../pages/attendance-page');

test.describe('TC-03 | Action — Apply For Attendance', () => {

  test('button is visible and enabled before interaction', async ({ page }) => {
    const attendance = new AttendancePage(page);
    await attendance.navigate();

    await expect(attendance.applyBtn).toBeVisible();
    await expect(attendance.applyBtn).toBeEnabled();
  });

  test('clicking Apply For Attendance triggers modal or navigation', async ({ page }) => {
    const attendance = new AttendancePage(page);
    await attendance.navigate();

    // Capture network request triggered by the button
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/attendance') && resp.status() === 200),
      attendance.clickApplyForAttendance(),
    ]);

    // Scenario A: a modal/dialog opens
    const modal = page.locator('[role="dialog"]');
    const modalVisible = await modal.isVisible().catch(() => false);

    if (modalVisible) {
      await expect(modal).toBeVisible();
    } else {
      // Scenario B: the page navigates to an apply URL
      await expect(page).toHaveURL(/apply/);
    }

    // Assert the network call actually fired
    expect(response).toBeTruthy();
  });

  test('no duplicate API requests on single button click', async ({ page }) => {
    const attendance = new AttendancePage(page);
    await attendance.navigate();

    let requestCount = 0;
    page.on('request', req => {
      if (req.url().includes('/attendance/apply')) requestCount++;
    });

    await attendance.clickApplyForAttendance();
    await page.waitForLoadState('networkidle');

    // Only one request should have fired
    expect(requestCount).toBeLessThanOrEqual(1);
  });
});
```

**Expected Result:** A dialog becomes visible OR the URL updates. Exactly one API request is fired. No UI freezes or double submissions.

---

## 7. Column Index Reference

The attendance table renders columns in the following order. Use these indices with `.nth()`:

| Index | Column | Example Value |
|---|---|---|
| 0 | Date | `07 Apr, 2026` |
| 1 | Active Hours | `08:00 hrs` |
| 2 | Offline Hours | `00:00 hrs` |
| 3 | Total Hours | `08:00 hrs` |
| 4 | Status | `Present` |
| 5 | Work Location | `Work from Office` |

> If the application adds or reorders columns in future, update these indices accordingly.

---

## 8. Row Status Color Reference

Always confirm exact `rgb()` values in Chrome DevTools before hardcoding. Open DevTools → select a row → Computed tab → search `background-color`.

| Status | Legend Color | Playwright CSS Assertion |
|---|---|---|
| Present | Green | `toHaveCSS('background-color', 'rgb(34, 197, 94)')` |
| Short Leave | Orange | `toHaveCSS('background-color', 'rgb(...)') ` ← inspect |
| Half Day | Yellow/Gold | inspect |
| Absent | Red | inspect |
| Worked on Sat/Sun | Cyan | inspect |
| Lop Leave | None | `rgba(0, 0, 0, 0)` or `rgb(255, 255, 255)` |
| On Holiday | None | same as Lop Leave |

---

## 9. Running the Tests

```bash
# Run all attendance tests
npx playwright test tests/attendance/

# Run a specific spec
npx playwright test tests/attendance/attendance-positive.spec.js

# Run in headed mode (see the browser)
npx playwright test tests/attendance/ --headed

# Run in UI mode (interactive)
npx playwright test --ui

# Generate HTML report after run
npx playwright show-report
```

---

## 10. Best Practices & Notes

### Use `:text-is()` for exact date matching
Never rely on partial text selectors (`td:text("Apr")`) as these can match multiple rows unintentionally.

### Always wait for `networkidle` after dropdown changes
Dropdowns trigger API calls. Without waiting, assertions run before the table has re-rendered.

### Inspect actual `rgb()` values in DevTools before asserting
Do not guess color values. Open Chrome DevTools → Computed Styles → `background-color` to copy the exact string the browser reports.

### Do not use row index (`.nth(rowIndex)`) for date-specific assertions
Row positions change when filters are applied or new data is added. Always locate rows by their date text.

### Handle both modal and navigation outcomes in TC-03
The "Apply For Attendance" button may open a modal or navigate to a new page depending on the user's state. The test should accommodate both.

### Add `data-testid` attributes to key elements if you control the codebase
Locators like `page.getByTestId('year-dropdown')` are more resilient than CSS selectors and survive UI refactors.

### Use `Promise.all()` to catch network responses in action tests
`page.waitForResponse()` must be set up before the action that triggers it. Always wrap both in `Promise.all`.

---

*For questions or updates, contact the QA Automation Team.*
