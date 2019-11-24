import { fetchCommunities, fetchEventsOrganizers } from "../models/community";

export const upcomingEvents = async (root, args) => {
  const first = args.first || 10;
  const communties = await fetchCommunities();
  const events = await Promise.all(
    communties.map(async community => {
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
