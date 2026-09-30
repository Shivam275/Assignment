# OrangeHRM Automation Framework

## 1. Objective

Automate high-priority OrangeHRM administrator and User Management workflows with a lightweight, maintainable BDD framework.

## 2. Application Under Test

The framework targets OrangeHRM's web application. Set `BASE_URL` to the intended demo or assessment environment.

## 3. Technology Stack

- JavaScript and Node.js
- Playwright for browser automation
- Cucumber.js for BDD scenarios
- Page Object Model for UI interactions

## 4. Framework Architecture

```text
Gherkin feature -> Cucumber step definitions -> Page objects -> Playwright
```

Feature files describe behavior, step definitions connect behavior to actions, page objects encapsulate UI interactions, and environment configuration stays outside the source code.

## 5. Project Structure

```text
config/                 Environment configuration
features/               Authentication and User Management scenarios
pages/                  Login, Dashboard, and User Management page objects
step-definitions/       Cucumber steps and browser lifecycle hooks
test-data/              Per-scenario test data generation
reports/                Generated HTML reports (not committed)
.env.example            Environment variable template
```

## 6. Setup Instructions

1. Install Node.js 20 or newer.
2. Install dependencies with `npm ci`.
3. Install the Chromium browser with `npx playwright install chromium`.
4. Copy `.env.example` to `.env` and set `BASE_URL`, `USERNAME`, `PASSWORD`, and `EMPLOYEE_NAME`. The loader also supports `config/.env`.
5. Use credentials authorized for the configured environment. Do not commit real credentials.

`EMPLOYEE_NAME` must match an employee available for selection when creating an OrangeHRM system user.

## 7. How to Execute

```sh
npm test                  # All scenarios
npm run test:smoke        # Scenarios tagged @smoke
npm run test:regression   # Scenarios tagged @regression
```

HTML reports are written to `reports/cucumber-report.html`, `reports/smoke-report.html`, and `reports/regression-report.html`. Failed scenarios include a screenshot attachment in the Cucumber report.

## 8. Test Classification

| Scenario | Classification |
| --- | --- |
| Administrator can log in | Smoke |
| Search for an existing user | Smoke, Regression |
| Create a new user | Regression |
| Update an existing user | Regression |
| Filter users by status | Regression |
| Logout from OrangeHRM | Smoke, Regression |
| Validate mandatory fields while creating a user | Regression |
| Search for a nonexistent user | Regression |

**SIT:** Not applicable to this workflow in the current demo setup. These scenarios validate OrangeHRM UI behavior, not an exposed integration between independently testable systems. SIT coverage should be added when a relevant integration and its test environment are available.

## 9. Automation Strategy

Coverage focuses on administrator authentication, user search, create/update, status filtering, mandatory-field validation, and logout. Each scenario logs in independently; the update scenario creates its own user instead of relying on another scenario's state.

## 10. Locator Strategy

Prefer accessible roles and names or meaningful labels/placeholders. Keep selectors in page objects and scope form controls to their labeled field. Avoid brittle positional selectors and fixed delays.

## 11. Test Data Strategy

Usernames are generated uniquely for each scenario. The employee name and credentials are environment configuration. Scenarios should not depend on test execution order or on records created by another scenario.

## 12. Flakiness Prevention

1. Use Playwright's auto-waiting and wait for meaningful UI state.
2. Prefer accessible, stable locators.
3. Avoid fixed waits such as `waitForTimeout()`.
4. Generate unique test data and keep scenarios independent.
5. Capture and attach a screenshot when a scenario fails.
6. Use retries only to diagnose instability, not to hide failures.

## 13. Reporting

Cucumber writes a self-contained HTML report for each test command. Failure screenshots are attached to the failed scenario. Generated reports are excluded from version control.

## 14. Assumptions

1. The configured OrangeHRM environment is available during test execution.
2. Supplied administrator credentials are valid and authorized.
3. `EMPLOYEE_NAME` resolves to a selectable employee.
4. The public demo may be shared; generated usernames reduce collisions but do not control external data changes.
5. The UI and available data may change as the demo is upgraded.

## 15. Limitations

1. A shared public demo can be unavailable or modified by other users.
2. Meaningful external SIT coverage is not available for this workflow.
3. Locator maintenance may be needed when the OrangeHRM UI changes.
4. Coverage currently focuses on authentication and Admin/User Management.
5. Created test users are not automatically deleted.

## 16. Suggested Improvements

- Add CI execution and publish reports as artifacts.
- Add cross-browser runs where required.
- Add API-level validation if supported by the target environment.
- Add controlled test-data cleanup and trace/video capture on failure.
- Consider Allure reporting or containerized execution if the project grows.

## 17. CI/CD Approach

```text
Commit -> CI installs dependencies and Chromium -> Smoke suite
       -> on success, regression suite -> publish HTML reports/artifacts
```

Run smoke tests as a fast release gate and regression tests after smoke passes. Keep environment credentials in the CI secret store, not in repository files.
