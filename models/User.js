const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose"); 
const Task = require('./Task');

const UserSchema = new mongoose.Schema({
    name : String,
    username : String,
    password : String,
    area : String,
    type : Number,
    tasks : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task"
        }
    ],
    wages: [ Number ]
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);