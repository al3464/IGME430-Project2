const mongoose = require('mongoose');
const _ = require('underscore');
const setName = (name) => _.escape(name).trim();
const TaskSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
        trim: true,
        set: setName,
    },
    age:{
        type:Number,
        min:0,
        required: true,
    },
    level:{
        type:Number,
        min:0,
        required: true,
    },
    owner:{
        type:mongoose.Schema.ObjectId,
        required: true,
        ref:'Account',
    },
    createdDate: {
        type:Date,
        default: Date.now,
    },
    
})

TaskSchema.statics.toAPI = (doc) =>({
    name: doc.name,
    age:doc.age,
});

const TaskModel = mongoose.model('Task', TaskSchema);
module.exports = TaskModel;