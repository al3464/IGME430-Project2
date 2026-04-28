const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');//mounting to HTML

const handleSubmit = async (e) => {
    e.preventDefault();
    helper.hideError();

    //declare old, new, confirm password
    const oldPass = e.target.querySelector('#oldPass').value;
    const newPass = e.target.querySelector('#newPass').value;
    const newPass2 = e.target.querySelector('#newPass2').value;

    if (!oldPass || !newPass || !newPass2) {
        helper.handleError('All fields are required');
        return;
    }//catching error for empty input 

    if (newPass !== newPass2) {
        helper.handleError('Password does not match');
        return;
    }//ensure new password is correct

    try {//fetch change password to send input to backen
        const response = await fetch('/changePassword', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldPass, newPass }),
        });

        if (!response.ok) {//when status return false, then return this 
            helper.handleError('could not change password now');
            return;
        }

        helper.handleError('success!');//if change pass word successful return 201
    } catch {
        helper.handleError('Failed to load');
    }
    
}

//build a password changing section to the front-end
const ChangePasswordWindow = () => {

    return (
        <div className="loginbar">
            <form id="cpForm"
                name="signupForm"
                onSubmit={handleSubmit}
                action="/changePassword"
                method="POST"
                className="mainForm">
                <label htmlFor="oldPass">Old Password: </label>
                <input id="oldPass" type="password" name="oldPass" placeholder="old password" />
                <label htmlFor="newPass">New Password: </label>
                <input id="newPass" type="password" name="newPass" placeholder="new password" />
                <label htmlFor="newPass2">Confirm Password: </label>
                <input id="newPass2" type="password" name="newPass2" placeholder="retype password" />
                <input className="formSubmit" type="submit" value="Submit" />
                <a className="back" href="/app">Back</a>
            </form>
        </div>
    );
};

const init = () => {

    const root = createRoot(document.getElementById('content'));

    root.render(<ChangePasswordWindow />);
}

window.onload = init;