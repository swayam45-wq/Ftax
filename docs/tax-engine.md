# Tax Residency Engine

The core value proposition of FTax is determining a student's tax residency status. The IRS rules change occasionally, so the engine is designed to be **data-driven** rather than hardcoded.

## How it Works

The Residency Engine (`apps/api/src/tax/residency-engine.service.ts`) executes the following flow:

1. **Calculate Substantial Presence Test (SPT) Days:**
   It pulls the user's travel history from the database and calculates the number of days they were physically present in the U.S. over the last 3 years.
   It uses the IRS weighted formula:
   * Days in current year (1x)
   * Days in prior year (1/3x)
   * Days in two years prior (1/6x)

2. **Load the Rule Set:**
   It reads the corresponding JSON rule file for the target tax year (e.g., `packages/rules/2025.json`).

3. **Evaluate Rules by Priority:**
   Rules are evaluated sequentially based on their `priority` field. The first rule where all `conditions` match the user's context becomes the ruling determination.

4. **Return Plain-English Reasoning:**
   The engine returns a structured result containing the determination (e.g., Nonresident Alien), the required forms (e.g., 8843), and a step-by-step plain-English explanation of exactly *why* that determination was made (so the user isn't left confused by a "black box").

## Rule Configuration (JSON)

Rules live in `packages/rules/[year].json`. This allows tax professionals or admins to update tax laws without changing the application code.

### Example Rule Block:
```json
{
  "ruleId": "R001",
  "description": "F-1 student within first 5 calendar years",
  "priority": 1,
  "conditions": [
    { "field": "visaType", "operator": "equals", "value": "F1" },
    { "field": "calendarYearsInUS", "operator": "<=", "value": 5 }
  ],
  "result": {
    "residencyStatus": "NONRESIDENT_ALIEN",
    "explanation": "As an F-1 student within your first 5 calendar years in the U.S., you are automatically a Nonresident Alien.",
    "formRequired": ["8843", "1040-NR"],
    "ficaExempt": true
  }
}
```

### Supported Operators
* `equals`
* `<` (less than)
* `<=` (less than or equal)
* `>` (greater than)
* `>=` (greater than or equal)
* `in` (array inclusion)
* `not_in` (array exclusion)
