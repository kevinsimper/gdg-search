import { fetchCommunities, fetchEventsOrganizers } from "../models/community";

export const searchEvents = async (root, args) => {
  const query = args.query.toLowerCase();
  const communities = await fetchCommunities();
  const communityResults = [];
  const allEvents = await Promise.all(
    communities.map(async community => {
      const { events } = await fetchEventsOrganizers(community.urlname);
      let finds = events.filter(e => {
        if ("name" in e) {
          if (e.name.toLowerCase().includes(query)) {
            return true;
          }
        }
        if ("description" in e) {
          return e.description.toLowerCase().includes(query);
        }
      });
      if (finds.length > 0) {
        communityResults.push(community);
      }
      return finds;
    })
  );
  const flat = allEvents.flat().sort((a, b) => b.time - a.time);
  return {
    eventsCount: flat.length,
    events: flat,
    communities: communityResults,
    communityCount: communityResults.length
  };
};
