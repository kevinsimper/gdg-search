export async function fetchCommunities() {
  const listRequest = await fetch("./src/list.json");
  const json = await listRequest.json();
  this.communities = json;
  this.communities.map(i => {
    if (i.country === "USA") {
      i.country = "United States";
    }
    return i;
  });
}

export async function fetchCountries() {
  const listRequest = await fetch("./src/countries-unescaped.json");
  const json = await listRequest.json();
  this.countries = json;
}

export async function fetchEvents(name) {
  try {
    const req = await fetch(
      `https://raw.githubusercontent.com/kevinsimper/gdg-events/master/${name}.json`
    );
    const json = await req.json();
    return json.events;
  } catch (e) {
    console.log(e);
    return [];
  }
}

export async function fetchOrganizers(name) {
  try {
    const req = await fetch(
      `https://raw.githubusercontent.com/kevinsimper/gdg-events/master/${name}.json`
    );
    const json = await req.json();
    return json.organizers;
  } catch (e) {
    console.log(e);
    return [];
  }
}
