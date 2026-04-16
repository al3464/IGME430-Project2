const models = require('../models');
const Task = models.Task;

const taskPage = (req, res) => {
    return res.render('app');
};

const makeTask = async (req, res) => {
    if (!req.body.name || !req.body.age || !req.body.level) {
        return res.status(400).json({ error: 'Name, age, and level are required' });
    }

    const taskData = {
        name: req.body.name,
        age: req.body.age,
        level: req.body.level,
        owner: req.session.account._id,
    };

    try {
        const newTask = new Task(taskData);
        await newTask.save();
        return res.status(201).json({ name: newTask.name, age: newTask.age, level: newTask.level });
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
        const docs = await Task.find(query).select('name age level _id').lean().exec();
        return res.json({ tasks: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving tasks' });
    }
};

module.exports = {
    taskPage,
    makeTask,
    getTasks,
    deleteTask,
};