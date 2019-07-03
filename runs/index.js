const { createServer, get } = require("http");
const fetch = require("node-fetch");

async function fetchCommunities() {
  const req = await fetch(
    "https://raw.githubusercontent.com/kevinsimper/gdg-search/master/src/list.json"
  );
  const data = await req.text();
  return data;
}

const PORT = process.env.PORT || 3000;
createServer(async (req, res) => {
  console.log("New request");
  if (req.url === "/communities") {
    const data = await fetchCommunities();
    res.setHeader("Content-Type", "application/json;");
    res.end(data);
  } else {
    res.end("Hello GDG Search");
  }
}).listen(PORT, () => console.log("Listening on http://localhost:" + PORT));
