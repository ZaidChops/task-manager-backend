const express = require("express");
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require("../Controllers/taskController");
const { protect } = require("../Middleware/authMiddleware");

router.post("/", protect, createTask);
router.get("/my", protect, getTasks);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

module.exports = router;
