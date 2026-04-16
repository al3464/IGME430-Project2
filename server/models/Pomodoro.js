const mongoose = require('mongoose');

const PomodoroSchema = new mongoose.Schema({
    planId: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'Task', 
        trim: true,
        required: true 
    },
    duration: { 
        type: Number, 
        default: 25,
        required: true,
    },      // 专注分钟数
    completedAt: { 
        type: Date, 
        default: Date.now 
    },
    owner: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'Account', 
        required: true 
    },
    createdDate: {
        type:Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Pomodoro', PomodoroSchema);