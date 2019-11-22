# 🌍 gdg-search

Easily find any GDG in the world

The data is crawled from meetup.com

You can see the JSON in [./src/list.json](https://github.com/kevinsimper/gdg-search/blob/master/src/list.json)

![image](https://user-images.githubusercontent.com/1126497/56774851-b043e000-67c4-11e9-840c-d1c90ea88ed1.png)

## Update

- Fetch the newest meetups from https://www.meetup.com/pro/gdg/ in the Developer Console.
- `$ rm -rf gdg-events/*.json`
- `$ bash getevents.sh`
- `$ bash fetch.sh`
- `$ node sumevents.js`
- Commit repo
- Commit gdg-events repo
