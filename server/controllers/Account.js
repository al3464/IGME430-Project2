const models = require('../models');
const Account = models.Account;

const loginPage = (req, res) => {
    return res.render('login');
}

const passwordchangedPage = (req, res) => {
    return res.render('changePassword');
}


const logout = (req, res) => {
    req.session.destroy();
    return res.redirect('/');

}

const login = (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;
    if (!username || !pass) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    return Account.authenticate(username, pass, (err, account) => {
        if (err || !account) {
            return res.status(401).json({ error: 'Wrong username or password' });
        }
        req.session.account = Account.toAPI(account);
        return res.json({ redirect: '/app' });
    })
}

const signup = async (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;
    const pass2 = `${req.body.pass2}`;

    if (!username || !pass || !pass2) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    if (pass !== pass2) {
        return res.status(400).json({ error: 'Password do not match!' })
    }

    try {
        const hash = await Account.generateHash(pass);
        const newAccount = new Account({ username, password: hash });
        await newAccount.save();
        req.session.account = Account.toAPI(newAccount);
        return res.json({ redirect: '/app' });

    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Username already in use' });
        }
        return res.status(500).json({ error: 'An error occured' })
    }


};


//set backen data for password changing
const changePassword = async (req, res) => {
    const oldPass = `${req.body.oldPass}`;
    const newPass = `${req.body.newPass}`;
    const newPass2 = `${req.body.newPass2}`;//confirm password
    const userId = req.session.account._id;

    if (!oldPass || !newPass || !newPass2) {
        return res.status(400).json({ error: 'All fields are required' });
    }//error catching for not filled out all the input 

    try {
        const bcrypt = require('bcrypt');
        const account = await Account.findById(userId);
        const isMatch = await bcrypt.compare(req.body.oldPass, account.password);//check if old password match its hash 

        if (!isMatch) {
            return res.status(401).json({ error: 'Old password is incorrect' });
        }

        const newHashPass = await Account.generateHash(newPass);//generate new password's hash 
        account.password = newHashPass;
        await account.save();//save new password for account
        return res.json({ redirect: '/app' });


    } catch (err) {
        console.error(err); 
        return res.status(500).json({ error: 'An error occured' });
    }



}

module.exports = {
    changePassword,
    passwordchangedPage,
    signup,
    loginPage,
    login,
    logout,
}