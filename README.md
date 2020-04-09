# 🌍 gdg-search

Easily find any GDG in the world

The data is crawled from meetup.com

You can see the JSON in [./src/list.json](https://github.com/kevinsimper/gdg-search/blob/master/src/list.json)

![image](https://user-images.githubusercontent.com/1126497/78910569-762b2700-7a85-11ea-8f12-b427d75365c3.png)

## Discord

Join Discord to talk if you want to contribute or want help 😄 https://discord.gg/7qbgjmq

## Project structure

This repo consist of:

- front-end
- back-end

### Static site

It is hosted on Firebase. Built with Lit-Element and Polymer-cli to bundle it.

### Backend

It is deployed to Cloud Run. It is a Node.js server with Express.js. There is a GraphQL api that exposes all the data.

## How to run

Front-end:

```
$ npm i
$ npm start
```

Back-end:

```
$ npm i
$ npm start
```

## How to update data

- Fetch the newest meetups from https://www.meetup.com/pro/gdg/ in the Developer Console.
- `$ node -r esm cmd/download.js`
- `$ node sumevents.js`
- Commit repo
- Commit gdg-events repo
