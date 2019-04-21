const { readdirSync, readFileSync, writeFileSync } = require("fs");

const files = readdirSync("./gdg-events").filter(f => !f.includes(".git"));

function rollingperiode(events, months) {
  const before1year = Date.now() - (365 / 12) * months * 24 * 60 * 60 * 1000;
  return events.filter(i => i.time > before1year).length;
}

let meetups = [];
for (let f in files) {
  try {
    const file = "./gdg-events/" + files[f];
    const json = JSON.parse(readFileSync(file));
    if (json.events === undefined) {
      throw new Error("Deactivated meetup " + file);
    }
    const rollingtwelve = rollingperiode(json.events, 12);
    const quarter = rollingperiode(json.events, 3);
    meetups.push({
      name: files[f].replace(".json", ""),
      all: json.events.length,
      yearly: rollingtwelve,
      quarter
    });
  } catch (e) {
    console.log(e);
  }
}

writeFileSync("./src/most-active.json", JSON.stringify(meetups, null, 2));
