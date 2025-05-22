const asyncHandler = require("express-async-handler");
const Task = require("../Models/taskModel");

// CREATE TASK
const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, priority } = req.body;

  if (!title || !description || !dueDate || !priority) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const task = await Task.create({
    title,
    description,
    dueDate,
    priority,
    createdBy: req.user.id,
    status: "pending",
  });
  // console.log("Created task:", task);


    if (task) {
    res.status(201).json(task);
  } else {
    throw new Error("Something went wrong".red);
  }

});

// GET TASK
const getTasks = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const total = await Task.countDocuments({ createdBy: req.user.id });
  const tasks = await Task.find({ createdBy: req.user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    tasks,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
});


// UPDATE TASK
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (task.createdBy.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Unauthorized to update this task");
  }

  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(updated);
});

// DELETE TASK
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (task.createdBy.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Unauthorized to delete this task");
  }

  await task.deleteOne();

  res.status(200).json({ message: "Task deleted successfully" });
});




module.exports = { createTask, getTasks, updateTask, deleteTask };
