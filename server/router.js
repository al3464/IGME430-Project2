const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    app.get('/getTasks', mid.requiresLogin, controllers.Task.getTasks);

    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    app.post('/finishPomodoro', mid.requiresSecure, mid.requiresLogin, controllers.Task.finishPomodoro);
    app.get('/logout', mid.requiresLogin, controllers.Account.logout);

    app.get('/app', mid.requiresLogin, controllers.Task.taskPage);
    app.post('/app', mid.requiresLogin, controllers.Task.makeTask);

    app.get('/changePassword',mid.requiresSecure, controllers.Account.passwordchangedPage);
    app.post('/changePassword', mid.requiresSecure, controllers.Account.changePassword);

    app.delete('/deleteTask/:id', mid.requiresLogin, controllers.Task.deleteTask);
    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;