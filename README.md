# 🌍 gdg-search

Easily find any GDG in the world

The data is crawled from meetup.com

You can see the JSON in [./src/list.json](https://github.com/kevinsimper/gdg-search/blob/master/src/list.json)

![image](https://user-images.githubusercontent.com/1126497/78910569-762b2700-7a85-11ea-8f12-b427d75365c3.png)

## Update

- Fetch the newest meetups from https://www.meetup.com/pro/gdg/ in the Developer Console.
- `$ node -r esm cmd/download.js`
- `$ node sumevents.js`
- Commit repo
- Commit gdg-events repo
