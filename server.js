import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Database from "better-sqlite3";
import { WebSocketServer } from "ws";
import { networkInterfaces } from "os";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const WS_PORT = process.env.WS_PORT || 3002;

// Initialize SQLite Database
const db = new Database("sss.db");
db.pragma("journal_mode = WAL");

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    year TEXT NOT NULL,
    responses TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Initialize settings if empty
const initSettings = db.prepare("SELECT value FROM settings WHERE key = ?").get("config");

if (!initSettings) {
  // Check if db.json exists to migrate data
  const dbJsonPath = path.join(__dirname, "db.json");
  let initialState = {
    enrollment: { "Year 2": "", "Year 3": "", "Year 4": "", "Year 5": "" },
    participation: { "Year 2": false, "Year 3": false, "Year 4": false, "Year 5": false },
    programName: "Water Resources Engineering",
    groqApiKey: "",
  };

  if (fs.existsSync(dbJsonPath)) {
    try {
      const jsonData = JSON.parse(fs.readFileSync(dbJsonPath, "utf8"));
      
      // Migrate students
      if (Array.isArray(jsonData.students)) {
        const insertStudent = db.prepare("INSERT OR IGNORE INTO students (id, name, year, responses) VALUES (?, ?, ?, ?)");
        jsonData.students.forEach(student => {
          insertStudent.run(
            student.id,
            student.name,
            student.year,
            JSON.stringify(student.responses)
          );
        });
        console.log(`Migrated ${jsonData.students.length} students from db.json`);
      }
      
      // Migrate settings - ensuring keys match frontend expectations
      initialState = {
        enrollment: jsonData.enrollment || initialState.enrollment,
        participation: jsonData.participation || initialState.participation,
        programName: jsonData.programName || initialState.programName,
        groqApiKey: jsonData.groqApiKey || initialState.groqApiKey // Ensure this is preserved
      };
      
    } catch (e) {
      console.error("Failed to migrate db.json:", e);
    }
  }

  // Use run() to execute the insertion
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("config", JSON.stringify(initialState));
}

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// WebSocket Server
const wss = new WebSocketServer({ port: WS_PORT });

function broadcastRefresh() {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ type: "refresh" }));
    }
  });
}

function broadcastConnectionCount() {
    const count = wss.clients.size;
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ type: "count", count }));
      }
    });
  }

wss.on("connection", (ws) => {
  console.log("Client connected");
  broadcastConnectionCount();
  
  ws.on("close", () => {
    console.log("Client disconnected");
    broadcastConnectionCount();
  });
});

// Routes

// GET all students
app.get("/api/students", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM students").all();
    const students = rows.map(row => ({
      ...row,
      responses: JSON.parse(row.responses)
    }));
    res.json(students);
  } catch (error) {
    console.error("GET /api/students error:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST add student
app.post("/api/students", (req, res) => {
  try {
    const { id, name, year, responses } = req.body;
    db.prepare("INSERT INTO students (id, name, year, responses) VALUES (?, ?, ?, ?)").run(
      id,
      name,
      year,
      JSON.stringify(responses)
    );
    broadcastRefresh();
    res.json({ success: true });
  } catch (error) {
    console.error("POST /api/students error:", error);
    res.status(500).json({ error: error.message });
  }
});

// PUT update student
app.put("/api/students/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { name, year, responses } = req.body;
    db.prepare("UPDATE students SET name = ?, year = ?, responses = ? WHERE id = ?").run(
      name,
      year,
      JSON.stringify(responses),
      id
    );
    broadcastRefresh();
    res.json({ success: true });
  } catch (error) {
    console.error("PUT /api/students/:id error:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE student
app.delete("/api/students/:id", (req, res) => {
  try {
    const { id } = req.params;
    db.prepare("DELETE FROM students WHERE id = ?").run(id);
    broadcastRefresh();
    res.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/students/:id error:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET config
app.get("/api/config", (req, res) => {
  try {
    const row = db.prepare("SELECT value FROM settings WHERE key = ?").get("config");
    res.json(JSON.parse(row ? row.value : "{}"));
  } catch (error) {
    console.error("GET /api/config error:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST config (save settings)
app.post("/api/config", (req, res) => {
  try {
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run(
      "config",
      JSON.stringify(req.body)
    );
    broadcastRefresh();
    res.json({ success: true });
  } catch (error) {
    console.error("POST /api/config error:", error);
    res.status(500).json({ error: error.message });
  }
});

// EXPORT endpoint (Backup)
app.get("/api/export", (req, res) => {
  try {
    const students = db.prepare("SELECT * FROM students").all().map(s => ({
      ...s,
      responses: JSON.parse(s.responses)
    }));
    const configRow = db.prepare("SELECT value FROM settings WHERE key = ?").get("config");
    const config = configRow ? JSON.parse(configRow.value) : {};

    const backupData = {
      students,
      ...config
    };

    res.header("Content-Type", "application/json");
    res.attachment(`sss_backup_${new Date().toISOString().split("T")[0]}.json`);
    res.send(JSON.stringify(backupData, null, 2));
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ error: error.message });
  }
});

// IMPORT endpoint (Restore)
app.post("/api/import", (req, res) => {
  try {
    const data = req.body;
    
    // Transaction
    const transaction = db.transaction(() => {
      db.prepare("DELETE FROM students").run();
      
      if (Array.isArray(data.students)) {
        const stmt = db.prepare("INSERT INTO students (id, name, year, responses) VALUES (?, ?, ?, ?)");
        data.students.forEach(s => {
          stmt.run(s.id, s.name, s.year, JSON.stringify(s.responses));
        });
      }

      const config = {
        enrollment: data.enrollment,
        participation: data.participation,
        programName: data.programName,
        groqApiKey: data.groqApiKey
      };
      db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run("config", JSON.stringify(config));
    });

    transaction();
    broadcastRefresh();
    res.json({ success: true, message: "Database restored successfully" });
  } catch (error) {
    console.error("Import error:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST Proxy for Groq API
app.post("/api/analyze", async (req, res) => {
  try {
    const { messages, model } = req.body;

    // Read API key from settings
    const row = db.prepare("SELECT value FROM settings WHERE key = ?").get("config");
    const config = row ? JSON.parse(row.value) : {};
    const apiKey = config.groqApiKey || process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("Missing API Key in /api/analyze");
      return res
        .status(500)
        .json({ error: "Missing GROQ_API_KEY. Please add it in Settings." });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          model: model || "llama3-8b-8192",
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API returned error:", data);
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error("Groq API Error:", error);
    res.status(500).json({
      error: "Failed to communicate with AI service",
      details: error.message,
    });
  }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`WebSocket server running on port ${WS_PORT}`);
    
    // Print Network Interfaces
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          console.log(`📡 Network access: http://${net.address}:${PORT}`);
        }
      }
    }
});