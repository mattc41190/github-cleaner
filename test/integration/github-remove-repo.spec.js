const expect = require('chai').expect;
const data = require('../helpers/data.json');
const private = require('../helpers/private-data.json');
const createRepo = require('../helpers/create-repo.js').createRepo;
const Github = require('../../src/github.js');
// Tests are less atomic due to the nature of using a call limit on the underlying API

const formatName = function formatName(name) {
  return `${private.github.username}/${name}`
}

describe('#removeRepos', function() {
  
  before(function() {
    const repos = [
      createRepo(data.repos.thor, private.github['admin-token']),
      createRepo(data.repos.ironman, private.github['admin-token']),
      createRepo(data.repos.hulk, private.github['admin-token'])
    ];
    return Promise.all(repos);
  });
  
  beforeEach(function() {
    this.github = new Github({
      apiBase: 'https://api.github.com',
      username: private.github.username,
      token: private.github['delete-token'],
      archivesPath: '/tmp'
    });
  });
  
  it('Can remove a collection of repos', function() {
    return this.github.removeRepos([
      formatName(data.repos.hulk.name), 
      formatName(data.repos.ironman.name),
      formatName(data.repos.thor.name)])
      .then((deletedRepos) => {
        expect(deletedRepos.length).to.equal(3);
      })
  });
  
});