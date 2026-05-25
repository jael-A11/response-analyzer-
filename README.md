# Student Satisfaction Survey (SSS) System

## Overview

The **Student Satisfaction Survey (SSS) System** is a robust, full-stack web application designed to streamline the collection, analysis, and reporting of student feedback for academic accreditation.

It features a **real-time, multi-user environment** where multiple staff members can enter data simultaneously from different terminals, backed by a high-conformance **SQLite** database and **WebSocket** synchronization.

## Key Features

### 🚀 Real-Time Collaboration

- **Live Sync**: Updates made by one user appear instantly on all other connected screens.
- **Active User Tracking**: See how many users are currently online via the "Live Users" badge.

### 🔒 Data Integrity & Security

- **SQLite Backend**: Replaces fragile JSON files with a transactional SQL database (`better-sqlite3`) to support concurrent writes safely.
- **Terminal Locking**: "Assigned Year" feature allows administrators to lock specific computers to a single year (e.g., "Year 2"), preventing accidental cross-year data modification.

### 📊 Advanced Analytics & Reporting

- **Automated Excel Export**: Generates a professional multi-sheet workbook containing:
  - **Raw Data**: Complete student response logs.
  - **Response Rates**: Automated logic to flag years as "PASS" or "FAIL" based on participation.
  - **Question Analysis**: Detailed breakdown of Satisfied vs. Dissatisfied percentages for every question.
  - **Executive Summary**: Aggregated performance metrics by category (e.g., "Curriculum", "Student Services").
- **AI-Powered Insights**: Integrated prompting engine to generate accreditation narratives using LLMs.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts.
- **Backend**: Node.js, Express.js.
- **Database**: SQLite (via `better-sqlite3`).
- **Real-Time**: Native WebSockets (`ws`).
- **Data Processing**: SheetJS (`xlsx`).

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd sss-survey-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   _Note: This will install both frontend and backend dependencies defined in `package.json`._

### Running the Application

To start both the backend server and the frontend client simultaneously:

```bash
npm run dev
```

- **Frontend**: Access at `http://localhost:5173`
- **Backend API**: Running on `http://localhost:3001`
- **WebSocket Server**: Running on `ws://localhost:3002`

The application will automatically create a database file `sss.db` in the root directory upon the first launch.

## Local Network Deployment (Multi-User)

To use this application across multiple computers on the same Wi-Fi/LAN:

1. **Host Computer**: Run `npm run dev`.
2. **Find Host IP**: Open a terminal and run `ipconfig` (Windows) or `ifconfig` (Mac/Linux) to find your IPv4 address (e.g., `192.168.1.15`).
3. **Connect Clients**: Other users should open a browser and navigate to:
   ```
   http://192.168.1.15:5173
   ```
   _(Replace 192.168.1.15 with your actual IP address)_

**recommended workflow**: On each client machine, go to **Settings** and select their specific **Assigned Year**. This physically restricts their input forms to that year.

## Project Structure

```
├── server.js            # Main backend entry point (API + WebSockets)
├── sss.db               # SQLite database (auto-generated)
├── package.json         # Project configuration and scripts
├── src/
│   ├── App.jsx          # Main React Application Component
│   ├── main.jsx         # React DOM entry
│   └── index.css        # Global styles (Tailwind)
└── public/              # Static assets
```

## API Endpoints

- `GET /api/config` - Retrieve global settings (Enrollment numbers, Program Name).
- `GET /api/students` - Retrieve all student data.
- `POST /api/students` - Create a new student entry (triggers WebSocket broadcast).
- `PUT /api/students/:id` - Update an existing student.
- `DELETE /api/students/:id` - Remove a student record.

## License

This project is open-source and available under the [MIT License](LICENSE).
"# response-analyzer-" 
