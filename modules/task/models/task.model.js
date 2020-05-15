const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    name: String,
    description: String,
    taskType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MasterData'
    },
    taskCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MasterData'
    },
    taskFrequency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MasterData'
    },
    priority: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MasterData'
    },
    startTimestamp: Date,
    endTimestamp: Date,
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MasterData'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;