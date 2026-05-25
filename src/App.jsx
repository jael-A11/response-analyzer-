import React, { useState, useEffect, useCallback, useRef } from "react";
import * as XLSX from "xlsx";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Save,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Download,
  Upload,
  X,
  AlertCircle,
  Award,
  PieChart as PieChartIcon,
  Table,
  Send,
  Loader2,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  CheckCircle2,
  Users,
  Settings,
  FileSpreadsheet,
  Database,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                  DATA & CONFIG                             */
/* -------------------------------------------------------------------------- */

const QUESTIONS = [
  {
    code: "1.1.2",
    category: "Program Outcome",
    text: "Availability and accessibility of program learning outcomes",
  },
  {
    code: "1.1.3",
    category: "Program Outcome",
    text: "Program learning outcomes are clearly expressed & communicated to students",
  },
  {
    code: "1.1.4",
    category: "Program Outcome",
    text: "Outcomes indicate career and further study options upon completion",
  },
  {
    code: "2.1.6",
    category: "Curriculum",
    text: "Curriculum design shows students clear career pathways",
  },
  {
    code: "2.2.1",
    category: "Curriculum",
    text: "Student participation in curriculum monitoring & evaluation",
  },
  {
    code: "2.2.2",
    category: "Curriculum",
    text: "Inclusion of student feedback on the curriculum",
  },
  {
    code: "3.1.1",
    category: "Learning & Teaching",
    text: "Student participation in the learning process",
  },
  {
    code: "3.1.2",
    category: "Learning & Teaching",
    text: "Alignment of assessment methods with learning outcomes & curricula",
  },
  {
    code: "3.1.3",
    category: "Learning & Teaching",
    text: "Course/module syllabi shared & discussed at course start",
  },
  {
    code: "3.1.4",
    category: "Learning & Teaching",
    text: "Student participation in curricular activities",
  },
  {
    code: "3.1.5",
    category: "Learning & Teaching",
    text: "Student feedback used on teaching quality",
  },
  {
    code: "3.2.1",
    category: "Learning & Teaching",
    text: "Communication of assessment policy & procedures",
  },
  {
    code: "3.2.3",
    category: "Learning & Teaching",
    text: "Student appeal & dispute mechanisms for assessment",
  },
  {
    code: "3.3.1",
    category: "Learning & Teaching",
    text: "Availability of various assessment methods/tools",
  },
  {
    code: "3.3.3",
    category: "Learning & Teaching",
    text: "Mechanism to regularly review student assessment methods",
  },
  {
    code: "3.3.4",
    category: "Learning & Teaching",
    text: "Information on assessment content, style, format & fairness",
  },
  {
    code: "3.3.5",
    category: "Learning & Teaching",
    text: "Provision of timely, specific & actionable feedback on assessments",
  },
  {
    code: "4.1.1",
    category: "Student Services",
    text: "Availability of student selection & admission policy",
  },
  {
    code: "4.1.2",
    category: "Student Services",
    text: "Communication of student selection & admission policy",
  },
  {
    code: "4.1.4",
    category: "Student Services",
    text: "Well-defined mechanisms for student transfer nationally/internationally",
  },
  {
    code: "4.2.1a",
    category: "Student Services",
    text: "Provision of academic counseling",
  },
  {
    code: "4.2.1b",
    category: "Student Services",
    text: "Provision of psychological counseling",
  },
  {
    code: "4.2.1c",
    category: "Student Services",
    text: "Provision of financial, recreational & health services",
  },
  {
    code: "4.2.2",
    category: "Student Services",
    text: "Effective induction program for new students",
  },
  {
    code: "4.2.3",
    category: "Student Services",
    text: "Comprehensive student handbook availability",
  },
  {
    code: "4.2.4",
    category: "Student Services",
    text: "Regular evaluation of student support services",
  },
  {
    code: "4.2.5",
    category: "Student Services",
    text: "Appeals & grievance handling mechanisms",
  },
  {
    code: "4.2.6",
    category: "Student Services",
    text: "Mechanism to handle student disciplinary cases",
  },
  {
    code: "4.3.1",
    category: "Student Services",
    text: "Strategy to improve student progression rate",
  },
  {
    code: "4.3.3",
    category: "Student Services",
    text: "Review of attrition, retention & completion strategies",
  },
  {
    code: "4.4.1",
    category: "Student Services",
    text: "Student participation in tracer & graduate satisfaction study",
  },
  {
    code: "5.2.1",
    category: "Academic Staff",
    text: "Student participation in staff performance evaluation",
  },
  {
    code: "6.1.3",
    category: "Educational Resources",
    text: "Appropriate learning & teaching resources and facilities",
  },
  {
    code: "6.1.4",
    category: "Educational Resources",
    text: "Physical facilities for people with disabilities",
  },
  {
    code: "6.1.5",
    category: "Educational Resources",
    text: "Functional library availability",
  },
  {
    code: "6.1.6",
    category: "Educational Resources",
    text: "Adequate up-to-date text & reference books",
  },
  {
    code: "6.1.7",
    category: "Educational Resources",
    text: "ICT infrastructure availability",
  },
  {
    code: "7.2.4",
    category: "Research & Community",
    text: "Student participation in industry & community engagement",
  },
  {
    code: "8.1.6",
    category: "Program Management",
    text: "Student participation in decision making",
  },
  {
    code: "8.1.9",
    category: "Program Management",
    text: "Communication of decisions to students",
  },
  {
    code: "9.2.3",
    category: "Quality Improvement",
    text: "Student participation in continual quality improvement",
  },
  {
    code: "9.3.1",
    category: "Quality Improvement",
    text: "Mechanism to take student feedback for quality improvement",
  },
];

const COLORS = {
  BAD: "#ef4444",
  MEDIUM: "#f59e0b",
  GREAT: "#22c55e",
  bg: "#060d18",
  card: "#0c1628",
};

const INITIAL_ENROLLMENT = {
  "Year 2": "",
  "Year 3": "",
  "Year 4": "",
  "Year 5": "",
};
const INITIAL_PARTICIPATION = {
  "Year 2": true,
  "Year 3": true,
  "Year 4": true,
  "Year 5": true,
};
const CLASS_YEARS = ["Year 2", "Year 3", "Year 4", "Year 5"];

/* -------------------------------------------------------------------------- */
/*                               HELPER FUNCTIONS                             */
/* -------------------------------------------------------------------------- */

const API_HOST = import.meta.env.VITE_API_HOST || window.location.hostname;
const API_PORT = import.meta.env.VITE_API_PORT || 3001;
const WS_PORT = import.meta.env.VITE_WS_PORT || 3002;

const API_BASE = `http://${API_HOST}:${API_PORT}`;

const calculateStudentScore = (responses) => {
  let numericSum = 0;
  let numericCount = 0;
  let naCount = 0;
  let totalAnswered = 0;

  Object.values(responses).forEach((val) => {
    if (val === "N/A") {
      naCount++;
      totalAnswered++;
    } else if (val) {
      numericSum += parseInt(val, 10);
      numericCount++;
      totalAnswered++;
    }
  });

  const average = numericCount > 0 ? numericSum / numericCount : 0;
  const naPercentage = totalAnswered > 0 ? naCount / totalAnswered : 0;

  let category = "Medium";
  if (average < 2.5) {
    category = "Bad";
  } else if (average > 3.15 && naPercentage <= 0.3) {
    category = "Great";
  }

  return {
    average: average.toFixed(2),
    category,
    answeredCount: totalAnswered,
  };
};

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

export default function App() {
  const [currentPage, setCurrentPage] = useState("settings");
  const [programName, setProgramName] = useState("Water Resources Engineering");
  const [enrollment, setEnrollment] = useState(INITIAL_ENROLLMENT);
  const [participation, setParticipation] = useState(INITIAL_PARTICIPATION);
  const [groqApiKey, setGroqApiKey] = useState("");
  const [students, setStudents] = useState([]);

  // App State
  const [wsConnected, setWsConnected] = useState(false);
  const [liveUsers, setLiveUsers] = useState(1);
  const [lastUpdated, setLastUpdated] = useState(null);

  // User Local Settings
  const [assignedYear, setAssignedYear] = useState(() => {
    return localStorage.getItem("assignedYear") || "Admin";
  });

  const wsRef = useRef(null);

  // Initial Fetch
  useEffect(() => {
    fetchConfig();
    fetchStudents();

    // WebSocket Connection
    const wsUrl = `ws://${API_HOST}:${WS_PORT}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setWsConnected(true);
    };
    ws.onclose = () => setWsConnected(false);
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "refresh") {
        fetchStudents();
        fetchConfig(); // Also fetch config in case settings changed
        setLastUpdated(new Date());
      } else if (msg.type === "count") {
        setLiveUsers(msg.count);
      }
    };

    return () => {
      if (ws.readyState === 1) ws.close();
    };
  }, []);

  // Save Assigned Year to LocalStorage
  useEffect(() => {
    localStorage.setItem("assignedYear", assignedYear);
  }, [assignedYear]);

  const fetchConfig = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/config`);
      const data = await res.json();
      if (data.programName) setProgramName(data.programName);
      if (data.enrollment) setEnrollment(data.enrollment);
      if (data.participation) setParticipation(data.participation);
      if (data.groqApiKey) setGroqApiKey(data.groqApiKey);
    } catch (err) {
      console.error("Error fetching config:", err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/students`);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await fetch(`${API_BASE}/api/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programName,
          enrollment,
          participation,
          groqApiKey,
        }),
      });
      setCurrentPage("entry");
    } catch (err) {
      console.error("Error saving settings:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#060d18] text-gray-200 font-sans selection:bg-amber-500/30 relative">
      {/* Toast Notification */}
      <div
        className={`fixed top-4 right-4 z-50 transition-opacity duration-500 ${lastUpdated ? "opacity-100" : "opacity-0"} pointer-events-none`}
      >
        <div className="bg-blue-500/20 text-blue-400 border border-blue-500/50 px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold shadow-lg backdrop-blur-md">
          <Database className="w-3 h-3" /> Data synced
        </div>
      </div>

      {/* Header Info */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 to-amber-900 z-50" />

      {/* User Badge */}
      <div className="fixed top-4 left-4 z-50 flex flex-col gap-2">
        {/* Live Users Badge */}
        <div
          className={`px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold shadow-lg backdrop-blur-md border ${wsConnected ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}
        >
          <div
            className={`w-2 h-2 rounded-full ${wsConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
          />
          {wsConnected ? `Live: ${liveUsers} connected` : "Disconnected"}
        </div>

        {/* Assigned Year Badge */}
        <div
          className={`px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold shadow-lg backdrop-blur-md border border-gray-700 bg-[#0c1628]`}
        >
          {assignedYear === "Admin" ? (
            <span className="text-green-400 flex items-center gap-1">
              👑 Admin (All Years)
            </span>
          ) : (
            <span className="text-amber-400 flex items-center gap-1">
              📋 Assigned: {assignedYear}
            </span>
          )}
        </div>
      </div>

      {currentPage === "settings" && (
        <SettingsPage
          programName={programName}
          setProgramName={setProgramName}
          enrollment={enrollment}
          setEnrollment={setEnrollment}
          participation={participation}
          setParticipation={setParticipation}
          groqApiKey={groqApiKey}
          setGroqApiKey={setGroqApiKey}
          assignedYear={assignedYear}
          setAssignedYear={setAssignedYear}
          onSave={handleSaveSettings}
        />
      )}

      {currentPage !== "settings" && (
        <>
          <nav className="fixed top-12 left-0 w-full z-40 flex justify-center items-center gap-6 p-4">
            <button
              onClick={() => setCurrentPage("entry")}
              className={`px-8 py-3 rounded-xl font-bold text-lg flex items-center gap-3 transition-all border-2 ${
                currentPage === "entry"
                  ? "bg-amber-500/10 border-amber-500 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                  : "bg-[#0c1628]/80 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white backdrop-blur-md"
              }`}
            >
              <span className="text-2xl">📝</span> Data Entry
            </button>
            <button
              onClick={() => setCurrentPage("reports")}
              className={`px-8 py-3 rounded-xl font-bold text-lg flex items-center gap-3 transition-all border-2 ${
                currentPage === "reports"
                  ? "bg-amber-500/10 border-amber-500 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                  : "bg-[#0c1628]/80 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white backdrop-blur-md"
              }`}
            >
              <span className="text-2xl">📊</span> Reports & Analysis
            </button>
          </nav>

          <div className="pt-24 h-screen flex flex-col">
            {currentPage === "entry" && (
              <DataEntryPage
                students={students}
                participation={participation}
                assignedYear={assignedYear}
                refreshData={fetchStudents}
                goToReports={() => setCurrentPage("reports")}
                goToSettings={() => setCurrentPage("settings")}
              />
            )}

            {currentPage === "reports" && (
              <ReportsPage
                students={students}
                enrollment={enrollment}
                participation={participation}
                goToEntry={() => setCurrentPage("entry")}
                onImportRefresh={() => {
                  fetchConfig();
                  fetchStudents();
                }}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               PAGE COMPONENTS                              */
/* -------------------------------------------------------------------------- */

function SettingsPage({
  programName,
  setProgramName,
  enrollment,
  setEnrollment,
  participation,
  setParticipation,
  groqApiKey,
  setGroqApiKey,
  assignedYear,
  setAssignedYear,
  onSave,
}) {
  const handleEnrollmentChange = (year, val) => {
    setEnrollment((prev) => ({
      ...prev,
      [year]: val === "" ? "" : parseInt(val) || 0,
    }));
  };

  const handleParticipationChange = (year, checked) => {
    setParticipation((prev) => ({ ...prev, [year]: checked }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 py-12">
      <div className="w-full max-w-2xl bg-[#0c1628] border border-gray-800 rounded-xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-amber-500 mb-6 flex items-center gap-2">
          <Settings className="w-8 h-8" />
          SSS Configuration
        </h1>

        <div className="space-y-6">
          <div className="bg-amber-900/10 border border-amber-500/30 p-4 rounded-lg">
            <label className="block text-sm font-bold text-amber-500 mb-2">
              Your Assigned Year (Local Setting)
            </label>
            <select
              value={assignedYear}
              onChange={(e) => setAssignedYear(e.target.value)}
              className="w-full bg-[#060d18] border border-amber-500/50 rounded-lg px-4 py-2 text-white outline-none"
            >
              <option value="Admin">👑 Admin (Full Access)</option>
              {CLASS_YEARS.filter((y) => participation[y] !== false).map(
                (y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ),
              )}
            </select>
            <p className="text-xs text-amber-500/70 mt-2">
              This setting is saved only on this computer. It restricts data
              entry to prevent errors.
            </p>
          </div>

          <div className="h-px bg-gray-800 my-4" />

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Program Name
            </label>
            <input
              type="text"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              className="w-full bg-[#060d18] border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {CLASS_YEARS.map((year) => (
              <div
                key={year}
                className="bg-[#060d18] p-4 rounded-lg border border-gray-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-gray-300">
                    {year}
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={participation[year] !== false}
                      onChange={(e) =>
                        handleParticipationChange(year, e.target.checked)
                      }
                      className="accent-amber-500 w-4 h-4 rounded"
                    />
                    Active
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Enrolled Students
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={enrollment[year]}
                    onChange={(e) =>
                      handleEnrollmentChange(year, e.target.value)
                    }
                    disabled={participation[year] === false}
                    className="w-full bg-[#0c1628] border border-gray-700 rounded px-3 py-1.5 text-white disabled:opacity-50"
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Groq API Key
            </label>
            <input
              type="password"
              value={groqApiKey}
              onChange={(e) => setGroqApiKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full bg-[#060d18] border border-gray-700 rounded-lg px-4 py-2 text-white font-mono text-sm"
            />
          </div>

          <button
            onClick={onSave}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            Save Global Config & Start <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function DataEntryPage({
  students,
  participation,
  assignedYear,
  refreshData,
  goToReports,
  goToSettings,
}) {
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // Initialize form
  const getInitialYear = () => {
    if (assignedYear !== "Admin") return assignedYear;
    return CLASS_YEARS.find((y) => participation[y] !== false) || "Year 2";
  };

  // Calculate specific counts
  const enteredCount = students.length;
  const targetYear = assignedYear === "Admin" ? "ALL YEARS" : assignedYear;

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    year: getInitialYear(),
    responses: {},
  });

  const [saving, setSaving] = useState(false);

  // Filter students based on assignment
  const visibleStudents = students.filter((s) => {
    if (assignedYear === "Admin") return true;
    return s.year === assignedYear;
  });

  // Load selection
  useEffect(() => {
    const selected = students.find((s) => s.id === selectedStudentId);
    if (selectedStudentId && selected) {
      setFormData(selected);
    } else {
      resetForm();
    }
  }, [selectedStudentId, students]);

  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      year: getInitialYear(),
      responses: {},
    });
    setSelectedStudentId(null);
  };

  const [highlightedQuestion, setHighlightedQuestion] = useState(null);

  // Jump to next unanswered question
  const jumpToUnanswered = useCallback(() => {
    const firstUnanswered = QUESTIONS.find((q) => !formData.responses[q.code]);
    if (firstUnanswered) {
      const el = document.getElementById(`question-${firstUnanswered.code}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightedQuestion(firstUnanswered.code);
        setTimeout(() => setHighlightedQuestion(null), 2000);
      }
    }
  }, [formData.responses]);

  // Keyboard shortcut for jump
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "j") {
        e.preventDefault();
        jumpToUnanswered();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jumpToUnanswered]);

  const handleResponseChange = (code, value) => {
    setFormData((prev) => ({
      ...prev,
      responses: { ...prev.responses, [code]: value },
    }));
  };

  const saveStudent = async () => {
    if (!formData.name.trim()) return alert("Enter student name");

    // Safety check for year assignment
    if (assignedYear !== "Admin" && formData.year !== assignedYear) {
      return alert(`Error: You are assigned to ${assignedYear} only.`);
    }

    // Warn if unanswered questions
    if (answeredCount < QUESTIONS.length) {
      if (
        !confirm(
          `Warning: Only ${answeredCount}/${QUESTIONS.length} questions answered. Save anyway?`,
        )
      )
        return;
    }

    setSaving(true);
    const newStudent = {
      ...formData,
      id: formData.id || Date.now().toString(),
    };

    try {
      const method = formData.id ? "PUT" : "POST";
      const url = formData.id
        ? `${API_BASE}/api/students/${formData.id}`
        : `${API_BASE}/api/students`;

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });

      refreshData();
      if (!formData.id) resetForm(); // Clear if new
    } catch (error) {
      alert("Failed to save: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteStudent = async () => {
    if (!formData.id) return;
    if (confirm("Are you sure you want to delete this student?")) {
      try {
        await fetch(`${API_BASE}/api/students/${formData.id}`, {
          method: "DELETE",
        });
        refreshData();
        resetForm();
      } catch (e) {
        alert("Failed to delete");
      }
    }
  };

  const groupedQuestions = QUESTIONS.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {});

  const answeredCount = Object.keys(formData.responses).length;
  const progressPercent = Math.round((answeredCount / QUESTIONS.length) * 100);

  return (
    <div className="flex flex-col h-full bg-[#060d18] pt-2">
      {/* Top Banner */}
      <div className="mx-6 mb-2 flex items-center justify-between bg-gradient-to-r from-[#0c1628] to-[#111e36] p-4 rounded-xl border border-gray-800 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-full bg-amber-500/5 -skew-x-12 translate-x-32 group-hover:translate-x-0 transition-transform duration-700" />

        <div className="flex items-center gap-6 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white leading-none">
                {enteredCount}
              </h2>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">
                Total Students Entered
              </p>
            </div>
          </div>

          <div className="h-10 w-px bg-gray-700/50" />

          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Current Session</span>
            <span className="text-sm font-bold text-amber-500 flex items-center gap-2">
              {targetYear}{" "}
              <span className="px-1.5 py-0.5 bg-amber-500/20 rounded text-[10px]">
                ACTIVE
              </span>
            </span>
          </div>
        </div>

        <button
          onClick={goToReports}
          className="z-10 group bg-amber-600 hover:bg-amber-500 text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg hover:shadow-amber-500/20"
        >
          View Reports{" "}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-[#0c1628] border-r border-gray-800 flex flex-col pt-0">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#0c1628]">
            <button
              onClick={goToSettings}
              className="p-2 hover:bg-gray-800 rounded-lg text-gray-400"
            >
              <Settings className="w-5 h-5" />
            </button>
            <span className="font-bold text-amber-500 text-sm">
              {assignedYear === "Admin"
                ? "All Students"
                : `${assignedYear} Students`}{" "}
              ({visibleStudents.length})
            </span>
            <button
              onClick={goToReports}
              className="p-2 hover:bg-gray-800 rounded-lg text-blue-400"
            >
              <PieChartIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4">
            <button
              onClick={resetForm}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
            >
              + New Student
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {visibleStudents.map((student) => {
              const { category } = calculateStudentScore(student.responses);
              const isSelected = selectedStudentId === student.id;
              return (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudentId(student.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${isSelected ? "border-amber-500 bg-amber-500/10" : "border-gray-800 bg-[#060d18]"}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-gray-200 truncate">
                      {student.name}
                    </h3>
                    <span
                      className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${category === "Bad" ? "text-red-500 bg-red-500/20" : category === "Medium" ? "text-amber-500 bg-amber-500/20" : "text-green-500 bg-green-500/20"}`}
                    >
                      {category}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{student.year}</span>
                    <span>
                      {Object.keys(student.responses).length}/{QUESTIONS.length}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Form */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#060d18] pt-8">
          <div className="p-6 border-b border-gray-800 bg-[#0c1628]">
            <div className="flex items-center gap-4 mb-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="flex-1 bg-[#060d18] border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-amber-500 transition-all font-bold tracking-wide"
              />
              <select
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                disabled={assignedYear !== "Admin"}
                className={`bg-[#060d18] border border-gray-700 rounded-lg px-4 py-2 text-white outline-none w-40 ${assignedYear !== "Admin" ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {CLASS_YEARS.filter((y) => participation[y] !== false).map(
                  (y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32 relative">
            {/* Jump to Unanswered Banner */}
            {answeredCount < QUESTIONS.length && (
              <div className="sticky top-0 z-30 bg-[#060d18]/95 border-b border-red-500/20 backdrop-blur-md p-3 flex items-center justify-between -mx-6 -mt-6 mb-6 px-6 shadow-lg">
                <div className="flex items-center gap-2 text-red-400">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm font-medium">
                    {QUESTIONS.length - answeredCount} questions remaining
                  </span>
                </div>
                <button
                  onClick={jumpToUnanswered}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-lg transition-colors border border-red-500/20"
                >
                  JUMP TO NEXT <ArrowDown className="w-3 h-3" />
                  <span className="opacity-50 font-normal ml-1">Ctrl+J</span>
                </button>
              </div>
            )}

            {Object.entries(groupedQuestions).map(([catName, questions]) => {
              const unansweredInCat = questions.filter(
                (q) => !formData.responses[q.code],
              ).length;

              return (
                <div key={catName}>
                  <h2 className="text-lg font-bold text-amber-500 border-b border-gray-800 pb-2 mb-4 flex items-center gap-2">
                    {catName}
                    {unansweredInCat > 0 ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 text-[10px] text-red-500 font-bold">
                        {unansweredInCat}
                      </span>
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-green-500/50" />
                    )}
                  </h2>
                  <div className="space-y-4">
                    {questions.map((q) => (
                      <div
                        key={q.code}
                        id={`question-${q.code}`}
                        className={`p-4 rounded-xl border transition-all duration-500 ${
                          highlightedQuestion === q.code
                            ? "bg-amber-900/10 border-amber-500 shadow-[0_0_50px_-10px_rgba(245,158,11,0.2)] scale-[1.02] z-20"
                            : "bg-[#0c1628] border-gray-800/50 hover:border-gray-700"
                        }`}
                      >
                        <div className="flex justify-between mb-3">
                          <div className="flex gap-3">
                            <span
                              className={`font-mono text-sm px-2 py-0.5 rounded h-fit transition-colors ${
                                formData.responses[q.code]
                                  ? "text-green-500 bg-green-500/10"
                                  : "text-amber-500/70 bg-amber-500/10"
                              }`}
                            >
                              {q.code}
                            </span>
                            <p className="text-gray-300 font-medium">
                              {q.text}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 md:ml-12">
                          {["1", "2", "3", "4", "N/A"].map((val) => (
                            <button
                              key={val}
                              onClick={() => handleResponseChange(q.code, val)}
                              className={`min-w-12 px-3 h-10 rounded-lg text-sm font-bold transition-all border ${formData.responses[q.code] === val ? "bg-amber-500 text-white border-amber-500 shadow-amber-500/30 shadow-lg scale-105" : "bg-[#060d18] text-gray-400 border-gray-700 hover:border-gray-500"}`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-[#0c1628] border-t border-gray-800 flex items-center justify-between absolute bottom-0 right-0 w-[calc(100%-20rem)] z-10 shadow-up">
            <button
              onClick={deleteStudent}
              disabled={!formData.id}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-0"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
            <div className="flex gap-3">
              <button
                onClick={resetForm}
                className="px-6 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={saveStudent}
                disabled={saving}
                className="px-6 py-2 rounded-lg text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-900/20 flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Student
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportsPage({
  students,
  enrollment,
  participation,
  goToEntry,
  onImportRefresh,
}) {
  const [activeTab, setActiveTab] = useState("summary");
  const fileInputRef = useRef(null);

  // Calculate quick stats
  const totalEnrolled = CLASS_YEARS.reduce(
    (acc, y) => acc + (parseInt(enrollment[y]) || 0),
    0,
  );
  const totalResponded = students.length;
  const overallResponseRate =
    totalEnrolled > 0 ? (totalResponded / totalEnrolled) * 100 : 0;

  // Calculate satisfaction
  let totalSat = 0,
    totalAns = 0;
  students.forEach((s) => {
    Object.values(s.responses).forEach((v) => {
      if (v === "3" || v === "4") totalSat++;
      if (v && v !== "N/A") totalAns++;
    });
  });
  const overallSat = totalAns > 0 ? (totalSat / totalAns) * 100 : 0;

  // Check warnings
  const warnings = CLASS_YEARS.filter((y) => {
    if (participation[y] === false) return false;
    const enr = parseInt(enrollment[y]) || 0;
    const res = students.filter((s) => s.year === y).length;
    return enr > 0 && res / enr < 0.7;
  });

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        await fetch(`${API_BASE}/api/import`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        alert("Import successful!");
        onImportRefresh();
      } catch (err) {
        alert("Import failed: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = null; // reset
  };

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    // 1. Students Sheet
    const studentData = students.map((s) => {
      const stats = calculateStudentScore(s.responses);
      const row = {
        Name: s.name,
        Year: s.year,
        "Avg Score": stats.average,
        Category: stats.category,
        "Questions Answered": stats.answeredCount,
      };
      // Add each question column
      QUESTIONS.forEach((q) => (row[q.code] = s.responses[q.code] || ""));
      return row;
    });
    const wsStudents = XLSX.utils.json_to_sheet(studentData);
    XLSX.utils.book_append_sheet(wb, wsStudents, "Students");

    // 2. Response Rates
    const responseRates = CLASS_YEARS.filter(
      (y) => participation[y] !== false,
    ).map((y) => {
      const enrolled = enrollment[y] || 0;
      const responded = students.filter((s) => s.year === y).length;
      const rate = enrolled > 0 ? responded / enrolled : 0;
      return {
        Year: y,
        "Total Enrolled": enrolled,
        "Total Responded": responded,
        "Response Rate": (rate * 100).toFixed(1) + "%",
        Status: rate >= 0.75 ? "PASS" : "FAIL",
      };
    });
    // Add Total Row
    const totalEnrolled = Object.values(enrollment).reduce(
      (a, b) => a + (parseInt(b) || 0),
      0,
    );
    const totalResponded = students.length;
    responseRates.push({
      Year: "OVERALL",
      "Total Enrolled": totalEnrolled,
      "Total Responded": totalResponded,
      "Response Rate":
        totalEnrolled > 0
          ? ((totalResponded / totalEnrolled) * 100).toFixed(1) + "%"
          : "0%",
      Status: "",
    });
    const wsRates = XLSX.utils.json_to_sheet(responseRates);
    XLSX.utils.book_append_sheet(wb, wsRates, "Response Rates");

    // 3. Question Sheets (One per question)
    QUESTIONS.forEach((q) => {
      const data = [];
      let totalRes = 0,
        totalNA = 0,
        totalDiss = 0,
        totalSat = 0;

      CLASS_YEARS.filter((y) => participation[y] !== false).forEach((y) => {
        const yearStudents = students.filter((s) => s.year === y);
        const responses = yearStudents
          .map((s) => s.responses[q.code])
          .filter((v) => v);
        const count = responses.length;
        if (count === 0 && !enrollment[y]) return;

        const na = responses.filter((v) => v === "N/A").length;
        const diss = responses.filter((v) => v === "1" || v === "2").length;
        const sat = responses.filter((v) => v === "3" || v === "4").length;

        totalRes += count;
        totalNA += na;
        totalDiss += diss;
        totalSat += sat;

        data.push({
          "Class Year": y,
          "Total Responses (N)": count,
          "Total Responses (%)":
            ((count / (enrollment[y] || 1)) * 100).toFixed(1) + "%",
          "N/A (N)": na,
          "N/A (%)": count ? ((na / count) * 100).toFixed(1) + "%" : "0%",
          "Dissatisfied (N)": diss,
          "Dissatisfied (%)": count
            ? ((diss / count) * 100).toFixed(1) + "%"
            : "0%",
          "Satisfied (N)": sat,
          "Satisfied (%)": count
            ? ((sat / count) * 100).toFixed(1) + "%"
            : "0%",
        });
      });
      // Total Row
      data.push({
        "Class Year": "TOTAL",
        "Total Responses (N)": totalRes,
        "Total Responses (%)": "-",
        "N/A (N)": totalNA,
        "N/A (%)": totalRes
          ? ((totalNA / totalRes) * 100).toFixed(1) + "%"
          : "0%",
        "Dissatisfied (N)": totalDiss,
        "Dissatisfied (%)": totalRes
          ? ((totalDiss / totalRes) * 100).toFixed(1) + "%"
          : "0%",
        "Satisfied (N)": totalSat,
        "Satisfied (%)": totalRes
          ? ((totalSat / totalRes) * 100).toFixed(1) + "%"
          : "0%",
      });

      const wsQ = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, wsQ, q.code);
    });

    // 4. Summary By Category
    const categoryData = [];
    const categories = [...new Set(QUESTIONS.map((q) => q.category))];

    categories.forEach((cat) => {
      const qs = QUESTIONS.filter((q) => q.category === cat);
      let sumPercent = 0;
      let count = 0;
      let bestQ = { code: "", score: -1 };
      let worstQ = { code: "", score: 101 };

      qs.forEach((q) => {
        // Calculate avg satisfaction for this question across all students
        let sats = 0;
        let total = 0;
        students.forEach((s) => {
          const v = s.responses[q.code];
          if (v === "3" || v === "4") sats++;
          if (v && v !== "N/A") total++;
        });
        const pct = total > 0 ? (sats / total) * 100 : 0;
        sumPercent += pct;
        count++;

        if (pct > bestQ.score) bestQ = { code: q.code, score: pct };
        if (pct < worstQ.score) worstQ = { code: q.code, score: pct };
      });

      categoryData.push({
        Category: cat,
        "Questions Count": count,
        "Avg Satisfaction %": (sumPercent / count).toFixed(1) + "%",
        "Highest Question": `${bestQ.code} (${bestQ.score.toFixed(1)}%)`,
        "Lowest Question": `${worstQ.code} (${worstQ.score.toFixed(1)}%)`,
      });
    });

    const wsSummary = XLSX.utils.json_to_sheet(categoryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary by Category");

    // Write file
    const dateStr = new Date().toISOString().split("T")[0];
    XLSX.writeFile(wb, `SSS_Report_${dateStr}.xlsx`);
  };

  return (
    <div className="flex flex-col h-full bg-[#060d18] overflow-hidden pt-2">
      {/* Quick Stats Banner */}
      <div className="mx-6 mb-2 bg-[#0c1628] border border-gray-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">
              Total Responses
            </span>
            <span className="text-2xl font-bold text-white">
              {students.length}{" "}
              <span className="text-gray-500 text-sm font-medium">
                / {totalEnrolled}
              </span>
            </span>
          </div>

          <div className="h-8 w-px bg-gray-700" />

          <div className="flex flex-col">
            <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">
              Overall Satisfaction
            </span>
            <span
              className={`text-2xl font-bold ${overallSat >= 80 ? "text-green-500" : overallSat >= 50 ? "text-amber-500" : "text-red-500"}`}
            >
              {overallSat.toFixed(1)}%
            </span>
          </div>

          <div className="h-8 w-px bg-gray-700" />

          <div className="flex flex-col">
            <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">
              Response Rate
            </span>
            <span
              className={`text-2xl font-bold ${overallResponseRate >= 70 ? "text-green-500" : "text-amber-500"}`}
            >
              {overallResponseRate.toFixed(1)}%
            </span>
          </div>
        </div>

        {warnings.length > 0 && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-lg animate-pulse">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <div className="flex flex-col">
              <span className="text-red-400 font-bold text-sm">
                Action Needed
              </span>
              <span className="text-red-300 text-xs">
                {warnings.join(", ")} below 70%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-gray-800 bg-[#0c1628]">
        <div className="flex items-center gap-4">
          <button
            onClick={goToEntry}
            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-white">Reports & Analysis</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Action Buttons */}
          <div className="flex items-center gap-2 mr-6 border-r border-gray-700 pr-6">
            <button
              onClick={handleExportExcel}
              className="px-3 py-1.5 bg-green-600/20 text-green-400 border border-green-600/50 hover:bg-green-600/30 text-xs font-bold rounded flex items-center gap-2 transition-colors"
            >
              <FileSpreadsheet className="w-3 h-3" /> Export Excel
            </button>
            <a
              href={`${API_BASE}/api/export`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-600/50 hover:bg-blue-600/30 text-xs font-bold rounded flex items-center gap-2 transition-colors"
            >
              <Download className="w-3 h-3" /> Backup (JSON)
            </a>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-gray-700/50 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-white text-xs font-bold rounded flex items-center gap-2 transition-colors"
            >
              <Upload className="w-3 h-3" /> Restore
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
            />
          </div>

          <div className="flex gap-1 bg-[#060d18] p-1 rounded-lg">
            {["summary", "eta", "responses", "ai"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === tab ? "bg-amber-500 text-white shadow" : "text-gray-400 hover:text-white"}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Components */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "summary" && (
          <SummaryTab students={students} participation={participation} />
        )}
        {activeTab === "eta" && (
          <ETATablesTab
            students={students}
            enrollment={enrollment}
            participation={participation}
          />
        )}
        {activeTab === "responses" && (
          <ResponseRateTab
            students={students}
            enrollment={enrollment}
            participation={participation}
          />
        )}
        {activeTab === "ai" && (
          <AIAnalysisTab
            students={students}
            enrollment={enrollment}
            participation={participation}
          />
        )}
      </div>
    </div>
  );
}

function SummaryTab({ students, participation }) {
  const activeStudents = students.filter(
    (s) => participation[s.year] !== false,
  );
  const stats = activeStudents.map((s) => {
    const score = calculateStudentScore(s.responses);
    return { ...s, ...score };
  });
  const categoryCounts = { Bad: 0, Medium: 0, Great: 0 };
  stats.forEach((s) => categoryCounts[s.category]++);
  const pieData = [
    { name: "Bad", value: categoryCounts.Bad, color: COLORS.BAD },
    { name: "Medium", value: categoryCounts.Medium, color: COLORS.MEDIUM },
    { name: "Great", value: categoryCounts.Great, color: COLORS.GREAT },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0c1628] rounded-xl border border-gray-800 p-4 h-[500px] overflow-y-auto">
          <h3 className="font-bold text-lg mb-4 text-white">
            Student List Summary
          </h3>
          <table className="w-full text-sm text-left">
            <thead className="text-gray-400 border-b border-gray-700">
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Year</th>
                <th className="py-2">Avg</th>
                <th className="py-2">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {stats.map((s) => (
                <tr key={s.id} className="hover:bg-white/5">
                  <td className="py-2 px-1 text-gray-300">{s.name}</td>
                  <td className="py-2 text-gray-500">{s.year}</td>
                  <td className="py-2 text-gray-300">{s.average}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${s.category === "Bad" ? "text-red-400 bg-red-400/10" : s.category === "Medium" ? "text-amber-400 bg-amber-400/10" : "text-green-400 bg-green-400/10"}`}
                    >
                      {s.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-[#0c1628] rounded-xl border border-gray-800 p-4 flex flex-col items-center justify-center h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0c1628",
                  borderColor: "#374151",
                  color: "#fff",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function ETATablesTab({ students, enrollment, participation }) {
  const [selectedQCode, setSelectedQCode] = useState(QUESTIONS[0].code);
  const selectedQ =
    QUESTIONS.find((q) => q.code === selectedQCode) || QUESTIONS[0];

  const getTableData = (code) => {
    const yearData = {};
    CLASS_YEARS.forEach(
      (y) =>
        (yearData[y] = {
          total: 0,
          responses: 0,
          na: 0,
          dissatisfied: 0,
          satisfied: 0,
        }),
    );
    students
      .filter((s) => participation[s.year] !== false)
      .forEach((s) => {
        const ans = s.responses[code];
        if (!ans || !yearData[s.year]) return;
        yearData[s.year].responses++;

        if (ans === "N/A") {
          yearData[s.year].na++;
        } else {
          const val = parseInt(ans);
          if (val <= 2) yearData[s.year].dissatisfied++;
          else yearData[s.year].satisfied++;
        }
      });
    return yearData;
  };

  const data = getTableData(selectedQ.code);
  const totalRow = { responses: 0, na: 0, dissatisfied: 0, satisfied: 0 };
  Object.keys(data).forEach((year) => {
    if (participation[year] !== false) {
      totalRow.responses += data[year].responses;
      totalRow.na += data[year].na;
      totalRow.dissatisfied += data[year].dissatisfied;
      totalRow.satisfied += data[year].satisfied;
    }
  });

  const getPercent = (n, d) =>
    d === 0 ? "0%" : ((n / d) * 100).toFixed(1) + "%";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
        {QUESTIONS.map((q) => (
          <button
            key={q.code}
            onClick={() => setSelectedQCode(q.code)}
            className={`px-3 py-1 text-xs font-mono rounded border transition-colors ${selectedQCode === q.code ? "bg-amber-500 border-amber-500 text-white" : "bg-[#0c1628] border-gray-700 text-gray-400 hover:text-white"}`}
          >
            {q.code}
          </button>
        ))}
      </div>
      <div className="bg-[#0c1628] border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-2">
          {selectedQ.code} — {selectedQ.text}
        </h2>
        <table className="w-full text-sm text-left border-collapse mt-4">
          <thead>
            <tr className="bg-gray-800/50 text-gray-300">
              <th className="p-3 border border-gray-700">Class Year</th>
              <th className="p-3 border border-gray-700">Responses</th>
              <th className="p-3 border border-gray-700">N/A</th>
              <th className="p-3 border border-gray-700">Dissatisfied</th>
              <th className="p-3 border border-gray-700">Satisfied</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {CLASS_YEARS.filter((y) => participation[y] !== false).map(
              (year) => {
                const d = data[year];
                const total = d.responses || 1;
                return (
                  <tr key={year}>
                    <td className="p-3 border border-gray-700 font-bold">
                      {year}
                    </td>
                    <td className="p-3 border border-gray-700">
                      {d.responses}
                    </td>
                    <td className="p-3 border border-gray-700">
                      {d.na} ({getPercent(d.na, total)})
                    </td>
                    <td className="p-3 border border-gray-700 text-red-400">
                      {d.dissatisfied} ({getPercent(d.dissatisfied, total)})
                    </td>
                    <td className="p-3 border border-gray-700 text-green-400">
                      {d.satisfied} ({getPercent(d.satisfied, total)})
                    </td>
                  </tr>
                );
              },
            )}
            <tr className="bg-white/5 font-bold">
              <td className="p-3 border border-gray-700">TOTAL</td>
              <td className="p-3 border border-gray-700">
                {totalRow.responses}
              </td>
              <td className="p-3 border border-gray-700">
                {totalRow.na} ({getPercent(totalRow.na, totalRow.responses)})
              </td>
              <td className="p-3 border border-gray-700 text-red-400">
                {totalRow.dissatisfied} (
                {getPercent(totalRow.dissatisfied, totalRow.responses)})
              </td>
              <td className="p-3 border border-gray-700 text-green-400">
                {totalRow.satisfied} (
                {getPercent(totalRow.satisfied, totalRow.responses)})
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ResponseRateTab({ students, enrollment, participation }) {
  return (
    <div className="bg-[#0c1628] border border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Response Rates</h2>
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-gray-800/50 text-gray-300">
            <th className="p-3 border border-gray-700">Year</th>
            <th className="p-3 border border-gray-700">Enrolled</th>
            <th className="p-3 border border-gray-700">Responded</th>
            <th className="p-3 border border-gray-700">Rate</th>
            <th className="p-3 border border-gray-700">Status</th>
          </tr>
        </thead>
        <tbody>
          {CLASS_YEARS.map((y) => {
            if (participation[y] === false) return null;
            const enrolled = enrollment[y] || 0;
            const responded = students.filter((s) => s.year === y).length;
            const rate = enrolled > 0 ? responded / enrolled : 0;
            const isPass = rate >= 0.7;
            return (
              <tr key={y}>
                <td className="p-3 border border-gray-700 font-bold text-gray-200">
                  {y}
                </td>
                <td className="p-3 border border-gray-700 text-gray-400">
                  {enrolled}
                </td>
                <td className="p-3 border border-gray-700 text-gray-400">
                  {responded}
                </td>
                <td className="p-3 border border-gray-700 font-bold">
                  {(rate * 100).toFixed(1)}%
                </td>
                <td className="p-3 border border-gray-700">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${isPass ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}
                  >
                    {isPass ? "PASS" : "FAIL"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AIAnalysisTab({ students, enrollment, participation }) {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");
  const [error, setError] = useState("");

  const generateReport = async () => {
    setLoading(true);
    setError("");

    const activeStudents = students.filter(
      (s) => participation[s.year] !== false,
    );

    // Simple summary string construction for prompt
    const totalStudents = activeStudents.length;
    let totalScoreSum = 0,
      totalScoreCount = 0;
    const questionScores = {};

    QUESTIONS.forEach(
      (q) => (questionScores[q.code] = { sum: 0, count: 0, text: q.text }),
    );

    activeStudents.forEach((s) => {
      Object.entries(s.responses).forEach(([code, val]) => {
        if (val !== "N/A" && questionScores[code]) {
          const n = parseInt(val);
          questionScores[code].sum += n;
          questionScores[code].count++;
          totalScoreSum += n;
          totalScoreCount++;
        }
      });
    });

    const overallSat =
      totalScoreCount > 0 ? (totalScoreSum / totalScoreCount).toFixed(2) : 0;

    const prompt = `Analyze this student survey data (N=${totalStudents}). Overall Satisfaction: ${overallSat}/4.0. Provide accreditation recommendations.`;

    try {
      const resp = await fetch(`${API_BASE}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const json = await resp.json();
      if (json.choices) setReport(json.choices[0].message.content);
      else setError("API Error: " + JSON.stringify(json));
    } catch (e) {
      setError("Network Failure: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-center">
      <div className="bg-[#0c1628] p-8 rounded-xl border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-4">
          AI Accreditation Analyst
        </h2>
        <button
          onClick={generateReport}
          disabled={loading}
          className="bg-white text-black font-bold py-3 px-8 rounded-full disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Generate Analysis"}
        </button>
        {error && <div className="mt-4 text-red-500">{error}</div>}
      </div>
      {report && (
        <div className="bg-[#0c1628] border border-gray-800 p-8 rounded-xl text-left prose prose-invert max-w-none">
          <pre className="whitespace-pre-wrap font-sans">{report}</pre>
        </div>
      )}
    </div>
  );
}
