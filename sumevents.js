const { readdirSync, readFileSync, writeFileSync } = require("fs");

const files = readdirSync("./gdg-events").filter(f => !f.includes(".git"));

let meetups = [];
for (let f in files) {
  const file = "./gdg-events/" + files[f];
  console.log(file);
  const json = JSON.parse(readFileSync(file));
  console.log(json.length);
  meetups.push({
    name: files[f].replace(".json", ""),
    count: json.length
  });
}

meetups.sort((a, b) => {
  return b.count - a.count;
});
writeFileSync("./src/most-active.json", JSON.stringify(meetups, null, 2));
