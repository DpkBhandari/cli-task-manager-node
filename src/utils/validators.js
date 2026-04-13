"use strict";

const { isValid, parseISO, isFuture } = require("date-fns");

const PRIORITIES = ["low", "medium", "high"];
const STATUSES = ["pending", "completed"];

/**
 * Validate task title
 */
const validateTitle = (title) => {
  if (!title || typeof title !== "string") return "Title is required.";
  const trimmed = title.trim();
  if (trimmed.length === 0) return "Title cannot be empty.";
  if (trimmed.length < 2) return "Title must be at least 2 characters.";
  if (trimmed.length > 120) return "Title cannot exceed 120 characters.";
  return null;
};

/**
 * Validate priority value
 */
const validatePriority = (priority) => {
  if (!priority) return null; // optional field
  if (!PRIORITIES.includes(priority.toLowerCase())) {
    return `Priority must be one of: ${PRIORITIES.join(", ")}`;
  }
  return null;
};

/**
 * Validate due date string (YYYY-MM-DD or ISO format)
 */
const validateDueDate = (dateStr) => {
  if (!dateStr) return null; // optional field
  const parsed = parseISO(dateStr);
  if (!isValid(parsed)) {
    return "Invalid date format. Use YYYY-MM-DD (e.g. 2025-12-31).";
  }
  return null;
};

/**
 * Validate status value
 */
const validateStatus = (status) => {
  if (!status) return null;
  if (!STATUSES.includes(status.toLowerCase())) {
    return `Status must be one of: ${STATUSES.join(", ")}`;
  }
  return null;
};

/**
 * Validate task ID format (basic check)
 */
const validateId = (id) => {
  if (!id || typeof id !== "string" || id.trim().length === 0) {
    return "A valid task ID is required.";
  }
  return null;
};

module.exports = {
  validateTitle,
  validatePriority,
  validateDueDate,
  validateStatus,
  validateId,
  PRIORITIES,
  STATUSES,
};
