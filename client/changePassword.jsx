const helper = require('./helper.js');
const React = require('react');
const { useState } = React;
const { createRoot } = require('react-dom/client');

const handleSubmit = async (e) => {
    e.preventDefault();
    helper.hideError();

    const oldPass = e.target.querySelector('#oldPass').value;
    const newPass = e.target.querySelector('#newPass').value;
    const newPass2 = e.target.querySelector('#newPass2').value;

    if (!oldPass || !newPass || !newPass2) {
        helper.handleError('All fields are required');
        return;
    }
    
    if (newPass !== newPass2) {
        helper.handleError('Password does not match');
        return;
    }

    try {
        const response = await fetch('/changePassword', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldPass, newPass }),
        });

        const data = await response.json();

        if (!response.ok) {
            helper.handleError(data.error || 'could not change password now');
            return;
        }

        helper.handleError('success!');
    } catch {
        helper.handleError('Failed to load');
    }
    
}


const ChangePasswordWindow = (props) => {

    return (
        <div className="loginbar">
            <form id="signupForm"
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
            </form>
            <a href="/app">Back</a>
        </div>
    );
};

const init = () => {

    const root = createRoot(document.getElementById('content'));

    root.render(<ChangePasswordWindow />);
}

window.onload = init;