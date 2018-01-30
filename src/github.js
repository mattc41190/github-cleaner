const fs = require('fs');
const conf = require('../conf.js');
const request = require('request');
const apiBase = conf.apiBase;

function backupRepos(repos, done) {
  for (let i = 0; i < repos.length; i++) {
    let repo = repos[i];
    const archiveLocation = {
      url: `${apiBase}/repos/${repo}/zipball/master`,
      rejectUnauthorized: false,
      encoding: null,
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
        'User-Agent': 'request',
        'Authorization': `token ${conf.token}`
      }
    }

    request.get(archiveLocation, function (err, resp, body) {
      if (err) {
        done(err, null)
      } else {
        repo = repo.split('/').join('_');
        fs.writeFileSync(`${conf.archivesPath}/${repo}_Compressed.zip`, body);
      }
      if (i === repos.length - 1) {
        done(null, "Success");
      }
    });
  }
}

function getRepos() {
  const reposRequest = {
    url: `${apiBase}/users/${conf.username}/repos`,
    rejectUnauthorized: false,
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${conf.token}`
    }
  }

  return new Promise(function (resolve, reject) {
    request.get(reposRequest, function (err, resp, body) {
      if (err) {
        reject(err);
      } else {
        const repos = JSON.parse(body);
        const namesAndIds = repos.map(repo => [repo.id, repo.full_name])
        resolve(namesAndIds);
      }
    });
  });
}

function removeRepos(repos, done) {
  for (let i = 0; i < repos.length; i++) {
    let repo = repos[i]
    const deleteRepoRequest = {
      url: `${apiBase}/repos/${repo}`,
      rejectUnauthorized: false,
      headers: {
        'User-Agent': 'request',
        'Authorization': `token ${conf.token}`
      }
    }

    request.delete(deleteRepoRequest, function (err, resp, body) {
      if (err) {
        done(err, null)
      }
      if (i === repos.length - 1) {
        done(null, 'Success');
      }
    });
  }
}

module.exports = {
  backupRepos, getRepos, removeRepos
};
