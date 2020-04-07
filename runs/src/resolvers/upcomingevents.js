import { fetchCommunities, fetchEventsOrganizers } from "../models/community";
import countries from "world-countries/dist/countries";

function getCountry(community) {
  let communityCountry = community.country;
  if (communityCountry === "Korea (South)") {
    communityCountry = "South Korea";
  }
  if (communityCountry === "U.A.E.") {
    communityCountry = "United Arab Emirates";
  }
  if (communityCountry === "Congo (Dem. Rep.)") {
    communityCountry = "Congo";
  }
  if (communityCountry === "Trinidad &amp; Tobago") {
    communityCountry = "Trinidad and Tobago";
  }
  let found = countries.find(country => {
    return (
      country.name.common === communityCountry ||
      country.name.official === communityCountry ||
      country.altSpellings.includes(communityCountry)
    );
  });
  return found;
}

function filterRegion(query, countryDetails, country) {
  const lowered = query.toLowerCase();
  if (countryDetails.region.toLowerCase().includes(lowered)) {
    return true;
  }
  if (countryDetails.subregion.toLowerCase().includes(lowered)) {
    return true;
  }
  if (countryDetails.subregion.toLowerCase().includes(lowered)) {
    return true;
  }
  if (country.toLowerCase().includes(lowered)) {
    return true;
  }
  return false;
}

export const upcomingEvents = async (root, args) => {
  const first = args.first || 10;
  let communities = await fetchCommunities();
  const region = args.region.toLowerCase();
  if (region) {
    communities = communities.filter(community => {
      const countryDetails = getCountry(community);
      if (!countryDetails) {
        console.log("did not find", community);
        return false;
      }
      return filterRegion(region, countryDetails, community.country);
    });
  }
  const events = await Promise.all(
    communities.map(async community => {
      const { upcoming } = await fetchEventsOrganizers(community.urlname);
      return upcoming;
    })
  );
  const results = events
    .flat()
    .sort((a, b) => a.time - b.time)
    .filter(a => {
      if (a) {
        return a.time > Date.now();
      }
      return false;
    });
  const sliced = results.slice(0, first);
  return sliced;
};
