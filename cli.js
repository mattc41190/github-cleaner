const inquirer = require('inquirer');
const configurationAsker = require('./configurationAsker.js');
const githubAsker = require('./githubAsker.js');

console.log('Welcome to GitHub Cleaner');
console.log('Let\'s make your repos shine');

const prompts =  [{
  name: 'desiredAction',
  type: 'list',
  message: 'Where would you like to go?',
  choices: ['Github Cleaner', 'Configuration']
}];

inquirer.prompt(prompts).then(answers => console.log());

