# GitHub Cleaner

Install this utility, answer a few questions, get to cleaning out your cluttered GitHub account.

# What You Need:

1. Node + NPM (2 minutes)
  * https://nodejs.org/en/download/
2. A GitHub OAuth Token w/ Access To Backup and Delete (1 minute)
  * https://github.com/settings/tokens
3. A folder to store backups of repos (5 seconds / optional)
  * https://www.wikihow.com/Make-a-New-Folder-on-a-Computer

# How To Get It:

1. `npm i -g github-cleaner`

# How To Use It:

1. `ghclean`
2. `GitHub Cleaner` (Prompt Choice, Use Enter Button)
3. Select Repos (Space Bar Selects or Unselects)
4. Select Action (Prompt Choice, Use Enter Button)
5. Confirm Action and Repo(s)
6. Repeat (if needed)

## Notes:

* If you are running the application for the first time you need to answer some questions so that github-cleaner can find your repos.

* This module is very new please run `ENV=DEV ghclean` for more details on errors for issue reporting.

* If you are running this tool for Enterprise your apiBase will likely look like `http(s)://hostname/api/v3/`

* When creating a token only give it the privileges it needs. This application needs the ability to Find, Backup and Delete repos.

