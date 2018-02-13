const inquirer = require('inquirer');
const Asker = require('./src/Asker.js');
const Helper = require('./src/Helper.js');
const configurationManager = require('./src/configuration-manager.js');
const githubManager = require('./src/github-manager.js');

console.log('Welcome to GitHub Cleaner');
console.log('Let\'s make your repos shine');

const start = function start(confData) {
  return Asker.getPrimaryAction()
  .then(answers => {
    if (answers.desiredAction === 'Configuration') {
      return configurationManager.manageConfiguration()
      .then(() => { init() });
    }
    else if (answers.desiredAction === 'Github Cleaner') {
      return githubManager.manageGithub(confData)
      .then(() => { init() });
    }
    else if (answers.desiredAction === 'Exit') {
      exitProcess();
    } else {
      exitProcess();
    }
  })
  .catch(err => console.log(err));  
}

const init = function init() {
  return Helper.checkForConfData()
    .then((confData) => {
      return Helper.validateConfData(confData);
    })
    .then((confData) => {
      start(confData);
    })
    .catch((err) => {
      console.log(err);
      configurationManager.manageConfiguration()
    })
}

function exitProcess() {
  process.exit(0);
}

// Export All Modules For Testing
module.exports = {init, start, exitProcess};