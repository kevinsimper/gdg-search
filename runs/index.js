const { createServer } = require("http");

const PORT = process.env.PORT || 3000;
createServer((req, res) => {
  console.log("New request");
  res.end("Hello GDG Search");
}).listen(PORT, () => console.log("Listening on http://localhost:" + PORT));
