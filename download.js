import fetch from "isomorphic-unfetch";

// console.log(process.argv[2]);
const meetup = process.argv[2];
let events = [];
async function main() {
  const res = await fetch(
    `https://api.meetup.com/${meetup}/events?status=past`
  );
  const json = await res.json();
  events.push(json);
  if (res.headers.get("link")) {
    const url = res.headers
      .get("link")
      .split("<")[1]
      .split(">")[0];
    const linkres = await fetch(url);
    const json = await linkres.json();
    events.push(json);
  }
  console.log(JSON.stringify(events.flat()));
}

main();
