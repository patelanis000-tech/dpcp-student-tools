# DP/CP Student ATL Survey

Version-controlled deployment source for the common anonymous ATL survey used with current DP and CP students as part of 2027 IB evaluation preparation.

## Purpose

The survey gathers student evidence to help identify two ATL categories for programme development. It presents all five ATL categories neutrally and does not require student names.

## What the deployment creates

- Google Form: `DP/CP Student ATL Survey — 2026`
- Linked Google Sheet: `DP-CP Student ATL Survey Responses — 2026`
- Raw response tab: `Responses`
- Analysis tab: `ATL Summary`

The summary calculates average development-need rank, priority order, strongest-category counts, and separate DP/CP averages. Lower mean rank indicates greater reported development need.

## Deploy

1. Get the authoritative Evaluation project Drive folder ID from the `2027 IB Evaluation Preparation` Notion project page.
2. Open `build_student_atl_survey.gs` and replace `SET_PROJECT_FOLDER_ID` with that folder ID.
3. Open Google Apps Script using the school Google account that should own the form.
4. Create a project and paste in the script.
5. Run `buildStudentATLSurvey` and approve Forms, Sheets, and Drive permissions.
6. Use the execution log to obtain the student Form URL, editor URL, and response Sheet URL.
7. Submit one test response and verify the ranking grid, response sheet, and summary tab.
8. Delete the test response before launch.

## Privacy

- No student name question.
- Email collection is disabled.
- One-response-per-user enforcement is disabled because it can require sign-in and weaken the intended anonymity.
- Do not commit raw student survey responses to GitHub.
- Raw responses remain in the project Google Sheet/Drive location; only reviewed conclusions belong in the Notion project record.

## Survey structure

1. Programme — DP / CP
2. Year level — Year 1 / Year 2
3. Rank all five ATL categories by personal development need, using each rank once
4. Identify strongest ATL category
5. Briefly explain why it is a strength
6. Identify the specific ATL skill that would make the biggest positive difference now
7. Optional: what teachers or the school could do to support ATL development
8. Optional: additional student perspective

## Source-of-truth split

- **GitHub:** deployment code and technical documentation
- **Google Drive / Forms / Sheets:** live survey and raw response data
- **Notion:** confirmed project decisions, survey status, and synthesized conclusions
