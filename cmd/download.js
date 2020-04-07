import fetch from "isomorphic-unfetch";
import { join } from "path";
import { writeFileSync } from "fs";

async function meetupFetch(url) {
  const results = [];
  const headerPagination = [url];
  async function fetchPage(url) {
    console.log("Fetching", url);
    const linkres = await fetch(url);
    for (let pair of linkres.headers.entries()) {
      if (pair[0].includes("x-ratelimit")) {
        console.log(pair[0] + ": " + pair[1]);
      }
    }
    const json = await linkres.json();
    results.push(json);

    if (
      parseInt(linkres.headers.get("X-Total-Count")) <=
      results.flat().length + 1
    ) {
      return true;
    }

    if (linkres.headers.get("link")) {
      const url = linkres.headers.get("link").match(/^<(.+)>;/);
      if (url !== null) {
        headerPagination.push(url[1]);
      }
    }
    if (headerPagination.length > 0) {
      await fetchPage(headerPagination.pop());
    }
  }
  await fetchPage(headerPagination.pop());
  return results.flat();
}

async function fetchEvents(meetup, status) {
  const url = `https://api.meetup.com/${encodeURIComponent(
    meetup
  )}/events?status=${encodeURIComponent(status)}`;
  const events = await meetupFetch(url);
  return events;
}

async function fetchOrganizers(meetup) {
  const url = `https://api.meetup.com/${encodeURIComponent(
    meetup
  )}/members?&sign=true&photo-host=public&role=leads&page=20`;

  const organizers = await meetupFetch(url);
  return organizers;
}

function writeFile(name, data) {
  const filePath = join(__dirname, `../gdg-events/${name}.json`);
  console.log("Writing file to path", filePath);
  writeFileSync(filePath, data);
}

async function main(meetup) {
  const events = await fetchEvents(meetup, "past");
  const upcoming = await fetchEvents(meetup, "upcoming");
  const organizers = await fetchOrganizers(meetup);
  const data = JSON.stringify({
    events,
    upcoming,
    organizers
  });
  console.log("Found:", {
    events: events.length,
    upcoming: upcoming.length,
    organizers: organizers.length
  });
  writeFile(meetup, data);
}

// console.log(process.argv[2]);
const meetup = process.argv[2];
main(meetup);
