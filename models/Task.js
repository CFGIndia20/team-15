const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    assignedTo: String,
    assignedBy: String,
    noOfHours: Number,
    wagePerHour: Number,
    completed: String
});

module.exports = mongoose.model("Task", TaskSchema);