process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const fs = require('fs');
const request = require('request');
const axios = require('axios');

class Github {
  constructor(conf) {
    this.conf = conf;
    this.apiBase = conf.apiBase;
  }

  backupRepos(repos) {
    return new Promise((resolve, reject) => {
      for (let repo of repos) {
        const backupRepoRequest = {
          method: 'get',
          url: `${this.apiBase}/repos/${repo}/zipball/master`,
          responseType: 'stream',
          headers: {
            'Accept': 'application/vnd.github.v3.raw',
            'User-Agent': 'axios',
            'Authorization': `token ${this.conf.token}`
          }
        }

        axios(backupRepoRequest)
          .then((resp) => {
            if (resp.status !== 200) {
              reject(resp)
            } else {
              repo = repo.split('/').join('_');
              fs.writeFileSync(`${this.conf.archivesPath}/${repo}_Compressed.zip`, resp.data);
              resolve(true)
            }

          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  }

  getRepos() {
    const reposRequest = {
      url: `${this.apiBase}/users/${this.conf.username}/repos`,
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
        url: `${this.apiBase}/repos/${repo}`,
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
          done(null, '\n Success');
        }
      });
    }
  }

  findUser(apiBase, username, done) {
    const usernameRequest = {
      url: `${this.apiBase}/users/${username}`,
      rejectUnauthorized: false,
      headers: {
        'User-Agent': 'request',
        'Authorization': `token ${this.conf.token}`
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