# Enterprise HR CRM - Playwright & TypeScript E2E Framework

[![Enterprise E2E Tests](https://github.com/IonutSavinuC/playwright-enterprise-crm/actions/workflows/playwright.yml/badge.svg)](https://github.com/IonutSavinuC/playwright-enterprise-crm/actions)

A scalable, enterprise-grade End-to-End (E2E) test automation framework built with **Playwright** and **TypeScript**, designed to validate the **PeopleCore HR** web application. This project demonstrates advanced QA architecture, Data-Driven Testing, secure environment management, and a **Multi-Repository CI/CD pipeline**.

## 🏗️ Enterprise Architecture & Key Features

*   **Multi-Repo CI/CD Event Trigger (`repository_dispatch`):** Connected directly to the frontend application repository (`peoplecore-hr-demo`). Every push to `main` or `staging` on the web app automatically dispatches an authenticated webhook via GitHub API (`PAT_TOKEN`) to trigger this E2E test suite in the cloud.
*   **Environment & Secrets Management:** Zero hardcoded credentials or URLs. Uses `dotenv` locally and encrypted **GitHub Actions Secrets** (`BASE_URL`, `ADMIN_USER`, `ADMIN_PASSWORD`) in CI to seamlessly switch between environments.
*   **Data-Driven Testing (DDT):** Decoupled test data stored in external JSON files (`test-data/employee.json`) for clean, maintainable test execution.
*   **Page Object Model (POM):** Modularized UI interactions (`LoginPage`, `DashboardPage`) utilizing resilient `data-testid` selectors.

## 🧪 Automated Test Coverage

1.  **Authentication & Session Security:** Validated credential injection via environment variables and error handling for unauthorized access.
2.  **CRUD & File Upload Pipeline:** Automated creation of new employee records using external JSON payloads, including real profile avatar image uploads (`setInputFiles`) and KPI counter verification.
3.  **Negative Form Validation:** Verified duplicate Employee ID prevention and inline error messaging.
4.  **Dynamic Table Search & Filtering:** Validated real-time search queries and empty-state table handling.
5.  **Mathematical Data Sorting:** Verified dynamic salary sorting algorithms (High to Low).
6.  **Modal Confirmations & State Reset:** Automated deletion confirmation workflows and clean state restoration.

## 📦 Local Execution

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure environment variables:** Create a `.env` file in the root directory with `BASE_URL`, `ADMIN_USER`, and `ADMIN_PASSWORD`.
3. **Run tests:**
   ```bash
   npx playwright test
   ```
