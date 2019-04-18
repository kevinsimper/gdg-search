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
