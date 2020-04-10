const { readdirSync, readFileSync, writeFileSync } = require("fs");

const files = readdirSync("./gdg-events").filter(f => !f.includes(".git"));

function rollingperiode(events, months) {
  const before1year = Date.now() - (365 / 12) * months * 24 * 60 * 60 * 1000;
  return events.filter(i => i.time > before1year);
}

let meetups = [];
for (let f in files) {
  try {
    const file = "./gdg-events/" + files[f];
    const json = JSON.parse(readFileSync(file));
    if (json.events === undefined) {
      throw new Error("Deactivated meetup " + file);
    }
    const all = json.events.filter(e => e.yes_rsvp_count > 2).length;
    const yearly = rollingperiode(json.events, 12).filter(
      e => e.yes_rsvp_count > 2
    ).length;
    const quarter = rollingperiode(json.events, 3).filter(
      e => e.yes_rsvp_count > 2
    ).length;
    meetups.push({
      name: files[f].replace(".json", ""),
      all,
      yearly,
      quarter
    });
  } catch (e) {
    console.log(e);
  }
}

writeFileSync("./src/most-active.json", JSON.stringify(meetups, null, 2));
