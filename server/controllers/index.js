module.exports.Account = require('./Account.js');
module.exports.Task = require('./Task.js');
module.exports.Pomodoro = require('./Pomodoro.js');
const notFound = (req, res) => {
    res.status(404).render('notFound');
};

module.exports.notFound = notFound;
