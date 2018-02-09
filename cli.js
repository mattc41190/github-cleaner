const inquirer = require('inquirer');
const Helper = require('./src/Helper.js');
const configurationManager = require('./configuration-manager.js');
const githubManager = require('./github-manager.js');

function start(confData) {
  console.log(confData);
  console.log('Welcome to GitHub Cleaner');
  console.log('Let\'s make your repos shine');

  const prompts =  [{
    name: 'desiredAction',
    type: 'list',
    message: 'Where would you like to go?',
    choices: ['Github Cleaner', 'Configuration', 'Exit']
  }];

  inquirer.prompt(prompts).then(answers => {
    if (answers.desiredAction === 'Configuration') {
      return configurationManager.manageConfiguration()
      .then(() => { init() });
    }
    else if (answers.desiredAction === 'Github Cleaner') {
      return githubManager.manageGithub(confData)
      .then(() => { init() });
    }
    else if (answers.desiredAction === 'Exit') {
      process.exit(0);
    } else {
      process.exit(0);
    }
  })
  .catch(err => console.log(err));  
}

function init() {
  return Helper.checkForConfData()
    .then((confData) => {
      // console.log(confData);
      Helper.validateConfData(confData);
    })
    .then((confData) => {
      console.log(confData);
      start(confData);
    })
    .catch((err) => {
      console.log(err);
      configurationManager.manageConfiguration()
    })
}

init();