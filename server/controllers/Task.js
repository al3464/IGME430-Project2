const models = require('../models');
const Task = models.Task;
const Pomodoro = models.Pomodoro;

const taskPage = (req, res) => {
    return res.render('app');
};

const makeTask = async (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({ error: 'content are required' });
    }

    const taskData = {
        name: req.body.name,
        owner: req.session.account._id,
    };

    try {
        const newTask = new Task(taskData);
        await newTask.save();
        return res.status(201).json({ name: newTask.name });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Task already exists' });
        }
        return res.status(500).json({ error: 'An error occurred making task!' });
    }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;
    const owner = req.session.account._id;

    try {
        const result = await Task.deleteOne({ _id: id, owner });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Task not found or not owned by you' });
        }
        return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete task' });
    }
};

const getTasks = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await Task.find(query).select('name _id').lean().exec();
        return res.json({ tasks: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving tasks' });
    }
};

//finish a pomodoro duration
const finishPomodoro = async (req, res) => {
    if (!req.body.planId) {
        return res.status(400).json({ error: 'planId are required' });
    }
    const pomodoroData = {
        planId: req.body.planId,
        duration: req.body.duration,
        owner: req.session.account._id,
    }
    try {
        const oneDuration = new Pomodoro({ planId, duration, owner });
        await oneDuration.save();
        // 可选：更新任务的已用番茄数（如果需要）
        return res.status(201).json({ message: 'pomodoro updated' });
      }catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Could not svae pomodoro' });
    }
}

module.exports = {
    finishPomodoro,
    taskPage,
    makeTask,
    getTasks,
    deleteTask,
};