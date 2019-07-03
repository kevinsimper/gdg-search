const { createServer, get } = require("http");
const fetch = require("node-fetch");

async function fetchCommunities() {
  const req = await fetch(
    "https://raw.githubusercontent.com/kevinsimper/gdg-search/master/src/list.json"
  );
  const data = await req.text();
  return data;
}

async function fetchEvents(name) {
  try {
    const req = await fetch(
      `https://raw.githubusercontent.com/kevinsimper/gdg-events/master/${name}.json`
    );
    const json = await req.json();
    return json.events;
  } catch (e) {
    console.log(e);
    return [];
  }
}

const PORT = process.env.PORT || 3000;
createServer(async (req, res) => {
  console.log("New request");
  if (req.url === "/communities") {
    const data = await fetchCommunities();
    res.setHeader("Content-Type", "application/json;");
    res.end(data);
  } else if (req.url.match(/\/communities\/(\S*)\/events/)) {
    const name = req.url.match(/\/communities\/(\S*)\/events/);
    const events = await fetchEvents(name[1]);
    res.setHeader("Content-Type", "application/json;");
    res.end(JSON.stringify(events));
  } else {
    res.end("Hello GDG Search");
  }
}).listen(PORT, () => console.log("Listening on http://localhost:" + PORT));
