const fs = require('fs');
const conf = require('../github-cleaner-conf.json');
const request = require('request');
const apiBase = conf.apiBase;

class Github {
  constructor(conf) {
    this.conf = conf;
  }

  backupRepos(repos, done) {
    for (let i = 0; i < repos.length; i++) {
      let repo = repos[i];
      const archiveLocation = {
        url: `${apiBase}/repos/${repo}/zipball/master`,
        rejectUnauthorized: false,
        encoding: null,
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
          'User-Agent': 'request',
          'Authorization': `token ${this.conf.token}`
        }
      }

      request.get(archiveLocation, (err, resp, body) => {
        if (err) {
          done(err, null)
        } else {
          repo = repo.split('/').join('_');
          fs.writeFileSync(`${this.conf.archivesPath}/${repo}_Compressed.zip`, body);
        }
        if (i === repos.length - 1) {
          done(null, "Success");
        }
      });
    }
  }

  getRepos() {
    const reposRequest = {
      url: `${apiBase}/users/${this.conf.username}/repos`,
      rejectUnauthorized: false,
      headers: {
        'User-Agent': 'request',
        'Authorization': `token ${this.conf.token}`
      }
    }

    return new Promise((resolve, reject) => {
      request.get(reposRequest, (err, resp, body) => {
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

  removeRepos(repos, done) {
    for (let i = 0; i < repos.length; i++) {
      let repo = repos[i]
      const deleteRepoRequest = {
        url: `${apiBase}/repos/${repo}`,
        rejectUnauthorized: false,
        headers: {
          'User-Agent': 'request',
          'Authorization': `token ${this.conf.token}`
        }
      }

      request.delete(deleteRepoRequest, (err, resp, body) => {
        if (err) {
          done(err, null)
        }
        if (i === repos.length - 1) {
          done(null, 'Success');
        }
      });
    }
  }

  findUser(apiBase, username, done) {
    const usernameRequest = {
      url: `${apiBase}/users/${username}`,
      rejectUnauthorized: false,
      headers: {
        'User-Agent': 'request'
      }
    }

    request.get(usernameRequest, (err, resp, body) => {
      if (err) {
        done(err, null)
      }
      done(null, resp.statusCode);
    });
  }
}





module.exports = Github;