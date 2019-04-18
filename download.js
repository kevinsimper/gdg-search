import fetch from "isomorphic-unfetch";

async function fetchEvents(meetup) {
  let events = [];
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
  return events.flat();
}

async function fetchOrganizers(meetup) {
  const url = encodeURI(
    `https://api.meetup.com/${meetup}/members?&sign=true&photo-host=public&role=leads&page=20`
  );
  const res = await fetch(url);
  const json = await res.json();
  return json;
}

async function main(meetup) {
  const events = await fetchEvents(meetup);
  const organizers = await fetchOrganizers(meetup);
  console.log(
    JSON.stringify({
      events,
      organizers
    })
  );
}

// console.log(process.argv[2]);
const meetup = process.argv[2];
main(meetup);
