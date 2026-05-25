# Copilot Prompt — SSS Data Entry & ETA Reporting App

---

## Paste this entire prompt into Copilot Chat:

---

Build me a complete single-file React app (one App.jsx file, using Vite + Tailwind via CDN or inline styles) for entering and analyzing a Student Satisfaction Survey (SSS) for the Water Resources Engineering Program Accreditation under Ethiopia's ETA (Education and Training Authority) standards.

---

## CONTEXT

Each student fills a paper survey form. The form has 41 questions. For each question the student picks one of: 1 (Very Dissatisfied), 2 (Dissatisfied), 3 (Satisfied), 4 (Very Satisfied), or N/A. I am a committee member manually entering each student's answers from their physical paper form into this app.

---

## SURVEY QUESTIONS (41 total)

Use EXACTLY these question codes and text:

| Code   | Category              | Question Text |
|--------|-----------------------|---------------|
| 1.1.3  | Program Outcome       | Program learning outcomes are clearly expressed & communicated to students |
| 1.1.4  | Program Outcome       | Outcomes indicate career and further study options upon completion |
| 2.1.6  | Curriculum            | Curriculum design shows students clear career pathways |
| 2.2.1  | Curriculum            | Student participation in curriculum monitoring & evaluation |
| 2.2.2  | Curriculum            | Inclusion of student feedback on the curriculum |
| 3.1.1  | Learning & Teaching   | Student participation in the learning process |
| 3.1.2  | Learning & Teaching   | Alignment of assessment methods with learning outcomes & curricula |
| 3.1.3  | Learning & Teaching   | Course/module syllabi shared & discussed at course start |
| 3.1.4  | Learning & Teaching   | Student participation in curricular activities |
| 3.1.5  | Learning & Teaching   | Student feedback used on teaching quality |
| 3.2.1  | Learning & Teaching   | Communication of assessment policy & procedures |
| 3.2.3  | Learning & Teaching   | Student appeal & dispute mechanisms for assessment |
| 3.3.1  | Learning & Teaching   | Availability of various assessment methods/tools |
| 3.3.3  | Learning & Teaching   | Mechanism to regularly review student assessment methods |
| 3.3.4  | Learning & Teaching   | Information on assessment content, style, format & fairness |
| 3.3.5  | Learning & Teaching   | Provision of timely, specific & actionable feedback on assessments |
| 4.1.1  | Student Services      | Availability of student selection & admission policy |
| 4.1.2  | Student Services      | Communication of student selection & admission policy |
| 4.1.4  | Student Services      | Well-defined mechanisms for student transfer nationally/internationally |
| 4.2.1a | Student Services      | Provision of academic counseling |
| 4.2.1b | Student Services      | Provision of psychological counseling |
| 4.2.1c | Student Services      | Provision of financial, recreational & health services |
| 4.2.2  | Student Services      | Effective induction program for new students |
| 4.2.3  | Student Services      | Comprehensive student handbook availability |
| 4.2.4  | Student Services      | Regular evaluation of student support services |
| 4.2.5  | Student Services      | Appeals & grievance handling mechanisms |
| 4.2.6  | Student Services      | Mechanism to handle student disciplinary cases |
| 4.3.1  | Student Services      | Strategy to improve student progression rate |
| 4.3.3  | Student Services      | Review of attrition, retention & completion strategies |
| 4.4.1  | Student Services      | Student participation in tracer & graduate satisfaction study |
| 5.2.1  | Academic Staff        | Student participation in staff performance evaluation |
| 6.1.3  | Educational Resources | Appropriate learning & teaching resources and facilities |
| 6.1.4  | Educational Resources | Physical facilities for people with disabilities |
| 6.1.5  | Educational Resources | Functional library availability |
| 6.1.6  | Educational Resources | Adequate up-to-date text & reference books |
| 6.1.7  | Educational Resources | ICT infrastructure availability |
| 7.2.4  | Research & Community  | Student participation in industry & community engagement |
| 8.1.6  | Program Management    | Student participation in decision making |
| 8.1.9  | Program Management    | Communication of decisions to students |
| 9.2.3  | Quality Improvement   | Student participation in continual quality improvement |
| 9.3.1  | Quality Improvement   | Mechanism to take student feedback for quality improvement |

---

## APP STRUCTURE — 3 PAGES/VIEWS

### PAGE 1 — SETTINGS (shown first, once)
- A text input: "Program Name" (default: "Water Resources Engineering")
- Class year enrollment inputs: Year 1, Year 2, Year 3, Year 4, Year 5 — each with a number input for "Total Enrolled Students"
- A text input for Groq API Key (stored in component state, never shown in plain text — use password input type)
- A "Save & Start" button that moves to Page 2

---

### PAGE 2 — DATA ENTRY (main working page)

**Left panel — Student List**
- Shows all students entered so far as a scrollable list
- Each student card shows: name, year, number of questions answered out of 41, and a colored badge (Bad / Medium / Great) based on their average score:
  - Bad = average rating < 2.5 (mostly 1s and 2s)
  - Medium = average 2.5 to 3.15, or more than 30% N/A answers
  - Great = average > 3.15 with less than 30% N/A
- A "+ Add New Student" button at the top of the list
- Clicking any student in the list loads their data into the right panel for editing

**Right panel — Survey Entry Form**
- At the top: a text input "Student Full Name" and a dropdown "Class Year" (Year 1 through Year 5)
- Below that: the full survey table. For each of the 41 questions show:
  - Question code (e.g. 1.1.3) in monospace
  - Category label
  - Question text
  - 5 radio buttons or toggle buttons: 1 | 2 | 3 | 4 | N/A
  - The currently selected rating should be highlighted
- Group questions by category with a visible category header row
- At the bottom of the form:
  - "Save Student" button — saves/updates this student's record
  - "Clear Form" button — resets all fields
  - "Delete Student" button (only shown when editing an existing student)
- Show a live progress bar at the top of the form showing how many of the 41 questions have been answered

---

### PAGE 3 — REPORTS & TABLES

**This page has 4 tabs:**

#### Tab 1: Student Summary
- A large table listing every student: Name | Year | Avg Score | Category (Bad/Medium/Great) | Questions Answered
- Color-coded rows by category
- Show totals at the bottom: total students, breakdown by category count and percentage
- A pie chart showing the ratio of Bad / Medium / Great students using recharts

#### Tab 2: ETA Reporting Tables
- For EACH of the 41 questions, show a table in this EXACT ETA-required format:

```
TABLE TITLE: [question code] — [question text]

| Class Year | Total Responses (N / %) | N/A (N / %) | Dissatisfied+Very Dissatisfied (N / %) | Satisfied+Very Satisfied (N / %) |
|------------|-------------------------|-------------|----------------------------------------|----------------------------------|
| Year 1     | ...                     | ...         | ...                                    | ...                              |
| Year 2     | ...                     | ...         | ...                                    | ...                              |
| Year 3     | ...                     | ...         | ...                                    | ...                              |
| Year 4     | ...                     | ...         | ...                                    | ...                              |
| Year 5     | ...                     | ...         | ...                                    | ...                              |
| TOTAL      | ...                     | ...         | ...                                    | ...                              |
```

Rules for the table as per ETA standards:
- "Total Responses (N / %)" = number of students who answered this question / total enrolled for that year × 100
- "Dissatisfied+Very Dissatisfied" = count of rating 1 + rating 2
- "Satisfied+Very Satisfied" = count of rating 3 + rating 4
- ALL percentages use total number of responses (including N/A) as the denominator
- Show only years that have at least one student
- Include a navigation bar at the top to jump between questions (show all 41 codes as small buttons)

#### Tab 3: Response Rate Table
- A summary table showing for each class year:
  - Total Enrolled (from settings)
  - Total Responded
  - Response Rate %
  - Status: PASS (green) if ≥ 70%, FAIL (red) if below — ETA requires minimum 70% per year
- Show the overall response rate at the bottom
- A warning banner if any year is below 70%

#### Tab 4: AI Analysis (Groq)
- A button "Generate Accreditation Analysis"
- When clicked, send the full statistics to Groq API (model: llama-3.3-70b-versatile) and display the response
- The Groq API call should be a POST to: https://api.groq.com/openai/v1/chat/completions
- Headers: { "Authorization": "Bearer [API_KEY_FROM_SETTINGS]", "Content-Type": "application/json" }
- Body format:
```json
{
  "model": "llama-3.3-70b-versatile",
  "messages": [
    { "role": "user", "content": "[full stats summary]" }
  ]
}
```
- Build the prompt string by concatenating strings (NOT template literals) to include:
  - Total students, overall response rate, overall satisfaction %
  - Satisfaction % per category
  - Top 5 and bottom 5 questions by satisfaction
  - Which years pass/fail the 70% response rate requirement
- Ask it to produce: approval likelihood, key strengths, critical concerns, and recommendations
- Display the response in a nicely formatted box
- Show a loading spinner while waiting

---

## IMPORTANT TECHNICAL REQUIREMENTS

1. Use React with useState and useCallback hooks only — no Redux, no Context
2. Use recharts for the pie chart: import from "recharts"
3. All data lives in a single `students` state array — shape:
```js
[{ id, name, year, responses: { "1.1.3": "1", "1.1.4": "3", ... } }]
```
   Where response values are the strings "1", "2", "3", "4", or "N/A"
4. All enrollment numbers live in an `enrollment` state object: `{ "Year 1": 45, "Year 2": 38, ... }`
5. Persist all data to localStorage so it survives page refresh — load on mount, save on every change
6. The Groq API key must be stored in state (loaded from localStorage too) — never hardcoded
7. Use string concatenation (NOT template literals with ${}) for all API prompt building — this avoids Vite v8 oxc parser errors
8. Dark theme UI — background #060d18, cards #0c1628, accent color #f59e0b (amber), good/great green #22c55e, bad/warning red #ef4444
9. Font: import "Plus Jakarta Sans" from Google Fonts
10. The app must be a single App.jsx file — no separate CSS files

---

## DATA CALCULATION RULES

- Rating 1 = Very Dissatisfied
- Rating 2 = Dissatisfied  
- Rating 3 = Satisfied
- Rating 4 = Very Satisfied
- For ETA tables: combine 1+2 as "Dissatisfied/Very Dissatisfied", combine 3+4 as "Satisfied/Very Satisfied"
- Student category scoring:
  - Convert answers to numbers: 1→1, 2→2, 3→3, 4→4, N/A→skip
  - Average = sum of numeric answers / count of numeric answers (exclude N/A)
  - Bad: average < 2.5
  - Medium: average 2.5–3.15 OR N/A count > 30% of total answered
  - Great: average > 3.15 AND N/A count ≤ 30%
- Response rate = students who answered at least 1 question / total enrolled × 100
- All table percentages = (count of that rating type) / (total responses including N/A) × 100

---

Now build this complete React app as a single App.jsx file. Make the design clean, professional and dark-themed. Every feature listed above must be implemented and working.
