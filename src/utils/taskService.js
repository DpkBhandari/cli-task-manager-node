"use strict";

const { nanoid } = require("nanoid");
const { readTasks, writeTasks, getTaskById } = require("../storage/taskStore");
const { validateTitle, validatePriority, validateDueDate, validateStatus } = require("../utils/validators");

/**
 * Add a new task
 */
const addTask = async ({ title, priority = "medium", dueDate = null }) => {
  const titleErr = validateTitle(title);
  if (titleErr) throw new Error(titleErr);

  const priorityErr = validatePriority(priority);
  if (priorityErr) throw new Error(priorityErr);

  const dueDateErr = validateDueDate(dueDate);
  if (dueDateErr) throw new Error(dueDateErr);

  const tasks = await readTasks();

  const task = {
    id: nanoid(12),
    title: title.trim(),
    status: "pending",
    priority: priority.toLowerCase(),
    dueDate: dueDate || null,
    createdAt: new Date().toISOString(),
    updatedAt: null,
  };

  tasks.push(task);
  await writeTasks(tasks);
  return task;
};

/**
 * Get all tasks with optional filters
 */
const getTasks = async ({ status = null, priority = null, search = null } = {}) => {
  let tasks = await readTasks();

  if (status) {
    tasks = tasks.filter((t) => t.status === status.toLowerCase());
  }

  if (priority) {
    tasks = tasks.filter((t) => t.priority === priority.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    tasks = tasks.filter((t) => t.title.toLowerCase().includes(q));
  }

  return tasks;
};

/**
 * Update an existing task
 */
const updateTask = async (id, { title, priority, dueDate, status }) => {
  const tasks = await readTasks();
  const idx = tasks.findIndex((t) => t.id === id);

  if (idx === -1) throw new Error(`Task with ID "${id}" not found.`);

  if (title !== undefined) {
    const err = validateTitle(title);
    if (err) throw new Error(err);
    tasks[idx].title = title.trim();
  }

  if (priority !== undefined) {
    const err = validatePriority(priority);
    if (err) throw new Error(err);
    tasks[idx].priority = priority.toLowerCase();
  }

  if (dueDate !== undefined) {
    const err = validateDueDate(dueDate);
    if (err) throw new Error(err);
    tasks[idx].dueDate = dueDate || null;
  }

  if (status !== undefined) {
    const err = validateStatus(status);
    if (err) throw new Error(err);
    tasks[idx].status = status.toLowerCase();
  }

  tasks[idx].updatedAt = new Date().toISOString();

  await writeTasks(tasks);
  return tasks[idx];
};

/**
 * Delete a task by ID
 */
const deleteTask = async (id) => {
  const tasks = await readTasks();
  const idx = tasks.findIndex((t) => t.id === id);

  if (idx === -1) throw new Error(`Task with ID "${id}" not found.`);

  const [removed] = tasks.splice(idx, 1);
  await writeTasks(tasks);
  return removed;
};

/**
 * Mark a task as completed
 */
const completeTask = async (id) => {
  const tasks = await readTasks();
  const idx = tasks.findIndex((t) => t.id === id);

  if (idx === -1) throw new Error(`Task with ID "${id}" not found.`);
  if (tasks[idx].status === "completed") {
    throw new Error(`Task "${tasks[idx].title}" is already completed.`);
  }

  tasks[idx].status = "completed";
  tasks[idx].updatedAt = new Date().toISOString();

  await writeTasks(tasks);
  return tasks[idx];
};

/**
 * Get task statistics
 */
const getStats = async () => {
  const tasks = await readTasks();
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const high = tasks.filter((t) => t.priority === "high" && t.status === "pending").length;
  const medium = tasks.filter((t) => t.priority === "medium" && t.status === "pending").length;
  const low = tasks.filter((t) => t.priority === "low" && t.status === "pending").length;
  const overdue = tasks.filter((t) => {
    if (!t.dueDate || t.status === "completed") return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  return { total, completed, pending, high, medium, low, overdue };
};

module.exports = { addTask, getTasks, updateTask, deleteTask, completeTask, getStats };
