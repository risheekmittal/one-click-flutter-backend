import express from "express";

const app = express();
app.use(express.json());

// Health endpoint for platform checks
app.get("/health", (req, res) => res.status(200).send("OK"));

// Simple in-memory store
const TODOS = [
  { id: 1, title: "Ship ECS Fargate", done: true },
  { id: 2, title: "Wire up GitHub Actions", done: true },
  { id: 3, title: "Post the GIF on LinkedIn", done: false }
];

app.get("/todos", (req, res) => res.json(TODOS));

app.post("/todos", (req, res) => {
  const id = TODOS.length ? Math.max(...TODOS.map(t => t.id)) + 1 : 1;
  const todo = { id, ...req.body };
  TODOS.push(todo);
  res.status(201).json(todo);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
