"use strict";

const fs = require("fs").promises;
const path = require("path");

const STORAGE_PATH = path.join(__dirname, "..", "..", "data", "tasks.json");
const DATA_DIR = path.join(__dirname, "..", "..", "data");

/**
 * Ensure the data directory and tasks.json file exist
 */
const ensureStorage = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(STORAGE_PATH);
    } catch {
      await fs.writeFile(STORAGE_PATH, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (err) {
    throw new Error(`Failed to initialize storage: ${err.message}`);
  }
};

/**
 * Read all tasks from storage
 * @returns {Promise<Array>}
 */
const readTasks = async () => {
  await ensureStorage();
  try {
    const raw = await fs.readFile(STORAGE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    throw new Error(`Failed to read tasks: ${err.message}`);
  }
};

/**
 * Write tasks array to storage
 * @param {Array} tasks
 */
const writeTasks = async (tasks) => {
  await ensureStorage();
  try {
    await fs.writeFile(STORAGE_PATH, JSON.stringify(tasks, null, 2), "utf-8");
  } catch (err) {
    throw new Error(`Failed to write tasks: ${err.message}`);
  }
};

/**
 * Get a task by ID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
const getTaskById = async (id) => {
  const tasks = await readTasks();
  return tasks.find((t) => t.id === id) || null;
};

/**
 * Get storage file path (for display purposes)
 */
const getStoragePath = () => STORAGE_PATH;

module.exports = { readTasks, writeTasks, getTaskById, getStoragePath, ensureStorage };
