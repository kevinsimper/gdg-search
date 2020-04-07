import fetch from "isomorphic-unfetch";
import { join } from "path";
import { writeFileSync, readFileSync } from "fs";

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

const debugRatelimit = res => {
  for (let pair of res.headers.entries()) {
    if (pair[0].includes("x-ratelimit")) {
      console.log(pair[0] + ": " + pair[1]);
    }
  }
};

async function recoverFailure(res) {
  const json = await res.json();
  // wait additional time to be sure
  let wait = 10 * 1000;

  switch (json.errors[0].code) {
    case "throttled":
      console.log("throttled");

      wait += res.headers.get("x-ratelimit-reset") * 1000 + 10000;
      console.log("waiting ms", wait);
      await sleep(wait);
      return true;

    case "blocked":
      console.log("blocked");

      wait += res.headers.get("x-ratelimit-reset") * 1000 + 10000;
      console.log("waiting ms", wait);
      await sleep(wait);
      return true;

    case "privacy_error":
      console.log("group is private");
      return false;

    default:
      console.log(json);
      throw new Error("Request did not succeed!");
  }
}

async function respectRatelimit(res) {
  const remaining = parseInt(res.headers.get("x-ratelimit-remaining"));
  const reset = parseInt(res.headers.get("x-ratelimit-reset"));
  if (remaining < 3) {
    const wait = reset * 1000 + 5000;
    console.log("respecting ratelimit - less than 2 request left");
    console.log("waiting ms", wait);
    await sleep(wait);
  }
}

function isThereMorePages(headerPagination, res, results) {
  if (parseInt(res.headers.get("X-Total-Count")) <= results.flat().length + 1) {
    return true;
  }

  if (res.headers.get("link")) {
    const url = res.headers.get("link").match(/^<(.+)>;/);
    if (url !== null) {
      headerPagination.push(url[1]);
    }
  }
}

async function meetupFetch(url) {
  console.log("");
  const results = [];
  const headerPagination = [url];
  async function fetchPage(url) {
    console.log("Fetching", url);
    const linkres = await fetch(url);

    if (!linkres.ok) {
      const shouldRetry = await recoverFailure(linkres);
      if (shouldRetry) {
        headerPagination.push(url);
      }
    } else {
      // request succeed
      const json = await linkres.json();
      results.push(json);

      isThereMorePages(headerPagination, linkres, results);
      debugRatelimit(linkres);
      await respectRatelimit(linkres);
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

function writeFile(folder, name, data) {
  const filePath = `${folder}/${name}.json`;
  console.log("Writing file to path", filePath);
  writeFileSync(filePath, data);
}

async function getAndSaveMeetup(saveFolder, meetup) {
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
  writeFile(saveFolder, meetup, data);
}

if (require.main === module) {
  async function main() {
    // console.log(process.argv[2]);
    const folder = join(__dirname, `../gdg-events`);
    const meetupArg = process.argv[2];
    if (meetupArg) {
      await getAndSaveMeetup(folder, meetupArg);
    } else {
      const list = JSON.parse(
        readFileSync(join(__dirname, "../src/list.json"))
      );
      console.log("Communities:", list.length);
      let processed = 0;
      for (const meetup of list) {
        await getAndSaveMeetup(folder, meetup.urlname);
        processed++;
        console.log("rocessed", processed, (processed / list.length) * 100);
      }
    }
  }
  main();
}
