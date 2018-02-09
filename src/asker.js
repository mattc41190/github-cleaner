const inquirer = require('inquirer');

function getConfData() {
  return inquirer.prompt([{
      type: 'input',
      name: 'username',
      message: 'GitHub Username?',
    },
    {
      type: 'input',
      name: 'token',
      message: 'GitHub API Token:',
    },
    {
      type: 'input',
      name: 'archivesPath',
      message: 'Location To Save Backups:',
    },
    {
      type: 'input',
      name: 'apiBase',
      message: 'GitHub API URL (Modify if you are using GitHub Enterprise)',
      default: 'https://api.github.com'
    }
  ])
}

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
      choices: ['DELETE', 'BACKUP', 'BACKUP & DELETE', 'NONE']
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

function getConfChangeRequest(confData) {
  return inquirer.prompt([{
      type: 'checkbox',
      name: 'fieldsToUpdate',
      message: 'Which configuration details would you like to modify?',
      choices: Object.keys(confData)
    },
    {
      type: 'input',
      name: 'newUsername',
      message: 'New Username:',
      default: confData.username,
      when: function (answers) {return answers.fieldsToUpdate.indexOf('username') !== -1}
    },
    {
      type: 'input',
      name: 'newToken',
      message: 'New Token:',
      default: confData.token,
      when: function (answers) {return answers.fieldsToUpdate.indexOf('token') !== -1}
    },
    {
      type: 'input',
      name: 'newArchivesPath',
      message: 'New Path to Back-Ups / Archives:',
      default: confData.archivesPath,
      when: function (answers) {return answers.fieldsToUpdate.indexOf('archivesPath') !== -1}
    },
    {
      type: 'input',
      name: 'newApiBase',
      message: 'New Base URL for GitHub API:',
      default: confData.apiBase,
      when: function (answers) {return answers.fieldsToUpdate.indexOf('apiBase') !== -1}
    }
  ]);
}

module.exports = {
  confirmUserRequest,
  getConfChangeRequest,
  getConfData,
  getUserRequest
};