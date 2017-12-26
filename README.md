# MintWins.com

[![Travis](https://travis-ci.org/SkyWox/lottery.svg?branch=master)](https://travis-ci.org/SkyWox/lottery)

# System Architecture

![System Architecture](https://raw.githubusercontent.com/SkyWox/skywox.github.io/master/images/Mint_Wins_Architecture.svg?sanitize=true)

# Features

# Running a Copy

## Setup

This README assumes you're hosting on Heroku.

Make sure you have keys for the following accounts and update them in `.envs` file. Rename the file to `.env`

1. [Mailgun API](https://signup.mailgun.com/new/signup)
2. [Heroku postgres database](https://www.heroku.com/postgres)
3. JWT secret. [How to generate one using node](https://github.com/dwyl/learn-json-web-tokens#how-to-generate-secret-key)

## Run

Heroku can run this out of the box as long as you have the .env variables mirrored to the Heroku config and a postgres database provisioned.

To run the site locally for development, run this in the top level directory:

```
npm run start:dev
```

This will start a nodemon that will restart the server when it detects changes to the source.

To run the client, open another terminal and cd to the `/client/` directory and run:

```
npm run start
```

This will use react-script's daemon to restart on source changes.

## Built with

* NodeJS
* React + React Router
* Express
* Postgres
* [JSON Web Token](https://github.com/auth0/node-jsonwebtoken)
* [Cron for Node](https://github.com/kelektiv/node-cron)
* [Mailgun](https://mailgun.com)

## License

MIT © [Skylar Wilcox](http://skywox.me)
