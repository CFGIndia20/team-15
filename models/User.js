const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose"); 
// const Task = require('./Task');
const TaskSchema = new mongoose.Schema({
    assignedTo: String,
    assignedBy: String,
    noOfHours: Number,
    wagePerHour: Number,
    description: String,
    completed: String,
});

const UserSchema = new mongoose.Schema({
    name : String,
    username : String,
    password : String,
    area : String,
    type : Number,
    tasks : [
        TaskSchema
    ]
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);