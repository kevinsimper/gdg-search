const fetch = require("node-fetch");
const pMemoize = require("p-memoize");

async function _fetchCommunities() {
  // console.log("fetching communities");
  const req = await fetch(
    "https://raw.githubusercontent.com/kevinsimper/gdg-search/master/web/src/list.json"
  );
  const data = await req.json();
  return data;
}

export const fetchCommunities = pMemoize(_fetchCommunities, {
  maxAge: 1000 * 3600
});

async function _fetchEventsOrganizers(name) {
  // console.log("fetching events", name);
  try {
    const req = await fetch(
      encodeURI(
        `https://raw.githubusercontent.com/kevinsimper/gdg-events/master/${name}.json`
      )
    );
    const json = await req.json();
    return json;
  } catch (e) {
    console.log("error fetch event", name, e.name);
    return {
      events: [],
      organizers: []
    };
  }
}

export const fetchEventsOrganizers = pMemoize(_fetchEventsOrganizers, {
  maxAge: 1000 * 3600
});
