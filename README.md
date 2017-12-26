# MintWins.com

[![Travis](https://travis-ci.org/SkyWox/lottery.svg?branch=master)](https://travis-ci.org/SkyWox/lottery)

# System architecture

![System Architecture](https://raw.githubusercontent.com/SkyWox/skywox.github.io/master/images/MintWinsFlowChart.png)

# Features

The site uses React Router to allow the user to move seamlessly between the ticket manager and the generator.

## Ticket management

When the user navigates to the `/watch/` page, the site checks for a JSON web token in the session storage. If it finds one, it valids the token. If the token is valid, it logs in the user automatically and refreshes the stored token.

### User login

If the user does not have a valid JSON web token, they are presented with a modal allowing them to log in or create an account. When they successfully login or create an account, the server will generate a JSON web token for the browser to store.

To make previewing the site easier, the form also has a button allowing the user to log into a demo account. This automates submitting an email/password combo and functions like a normal login.

### Fetching tickets

Once a user is logged in, the browser uses an API to retrieve all the user's tickets. Each ticket is rendered as a seperate React component. The tickets' states are managed from the main `/watch/` component, allowing tickets to be created and destroyed during interactions with the API. For instance, adding a ticket will create both the child component and insert a matching value into the ticket database.

### Adding tickets

## Ticket generator

# Running a copy

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
