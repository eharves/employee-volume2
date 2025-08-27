import express from "express";
import employees from "./db/employees.js"; // keep your db folder

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello employees!");
});

app.get("/employees", (req, res) => {
  res.json(employees);
});

app.get("/employees/random", (req, res) => {
  const randomIndex = Math.floor(Math.random() * employees.length);
  res.json(employees[randomIndex]);
});

app.get("/employees/:id", (req, res) => {
  const id = Number(req.params.id);
  const employee = employees.find((e) => e.id === id);

  if (!employee) {
    return res.status(404).send("Employee not found");
  }

  res.json(employee);
});

app.post("/employees", (req, res) => {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).send("Request body is required");
  }

  const { name } = req.body;
  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).send("Name is required");
  }

  const newEmployee = {
    id: employees.length ? employees[employees.length - 1].id + 1 : 1,
    name: name.trim(),
  };

  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

export default app;
