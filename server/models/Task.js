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
});

const TaskModel = mongoose.model('Task', TaskSchema);
module.exports = TaskModel;