import fetch from "isomorphic-unfetch";

async function fetchEvents(events, meetup) {
  const headerPagination = [
    encodeURI(`https://api.meetup.com/${meetup}/events?status=past`)
  ];
  async function fetchPage(url) {
    const linkres = await fetch(url);
    const json = await linkres.json();
    events.push(json);
    // we have fetched all events
    if (
      parseInt(linkres.headers.get("X-Total-Count")) === events.flat().length
    ) {
      return true;
    }

    if (linkres.headers.get("link")) {
      const url = linkres.headers
        .get("link")
        .split("<")[1]
        .split(">")[0];
      headerPagination.push(url);
    }
    if (headerPagination.length > 0) {
      await fetchPage(headerPagination.pop());
    }
  }
  await fetchPage(headerPagination.pop());
}

async function main(meetup) {
  let events = [];
  await fetchEvents(events, meetup);
  console.log(JSON.stringify(events.flat()));
}

// console.log(process.argv[2]);
const meetup = process.argv[2];
main(meetup);
