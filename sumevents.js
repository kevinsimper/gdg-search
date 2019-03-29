const { readdirSync, readFileSync, writeFileSync } = require("fs");

const files = readdirSync("./gdg-events").filter(f => !f.includes(".git"));

function rollingperiode(events, months) {
  const before1year = Date.now() - (365 / 12) * months * 24 * 60 * 60 * 1000;
  return events.filter(i => i.time > before1year).length;
}

let meetups = [];
for (let f in files) {
  const file = "./gdg-events/" + files[f];
  const json = JSON.parse(readFileSync(file));
  const rollingtwelve = rollingperiode(json, 12);
  const quarter = rollingperiode(json, 3);
  meetups.push({
    name: files[f].replace(".json", ""),
    all: json.length,
    yearly: rollingtwelve,
    quarter
  });
}

writeFileSync("./src/most-active.json", JSON.stringify(meetups, null, 2));
