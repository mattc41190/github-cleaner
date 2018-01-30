const inquirer = require('inquirer');

function getUserRequest(repos) {
    return inquirer.prompt([{
        type: 'checkbox',
        name: 'repos',
        message: 'Which repos would you like to modify?',
        choices: repos.map(repo => repo[1])
    },
    {
        type: 'list',
        name: 'action',
        message: 'what would you like to do with these repos?',
        choices: ['DELETE', 'BACKUP', 'BACKUP & DELETE']
    }
    ])
}

function confirmUserRequest(answers) {
    return inquirer.prompt([{
        type: 'confirm',
        name: 'userIsSure',
        message: `Are you sure you want to ${answers.action}: ${answers.repos}`
    }])
}

module.exports = {confirmUserRequest, getUserRequest};