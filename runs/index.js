const { createServer, get } = require("http");
const express = require("express");
const fetch = require("node-fetch");
const pMemoize = require("p-memoize");
const { ApolloServer, gql } = require("apollo-server-express");
import {
  fetchCommunities,
  fetchEventsOrganizers
} from "./src/models/community";

const app = express();

const typeDefs = gql`
  type Organizer {
    role: String
    name: String
  }
  type Community {
    city: String
    country: String
    id: Int
    urlname: String
    name: String
    status: String
    lon: Float
    lat: Float
    organizers: [Organizer]
    events(first: Int): [Event]
    upcoming: [Event]
  }
  type Event {
    id: String
    name: String
    description: String
    time: String
    community: Community
  }
  type SearchEventResults {
    events: [Event]
    eventsCount: Int
    communities: [Community]
    communityCount: Int
  }
  type Query {
    hello: String
    community(name: String!): Community
    communities(first: Int): [Community]
    communityEvents(first: Int, name: String!): [Event]
    searchEvents(query: String): SearchEventResults
    eventsByCountry(name: String!): [Community]
    upcomingEvents(first: Int!): [Event]
  }
`;

async function findCommunity(name) {
  const communities = await fetchCommunities();
  return communities.find(c => c.name === name);
}

const resolvers = {
  Query: {
    hello: () => "Hello world!",
    community: async (root, args) => {
      const data = await findCommunity(args.name);
      return data;
    },
    communities: async () => {
      const data = await fetchCommunities();
      return data;
    },
    communityEvents: async (root, args) => {
      const { events } = await fetchEventsOrganizers(args.name);
      return events;
    },
    upcomingEvents: async (root, args) => {
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
    },
    searchEvents: async (root, args) => {
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
    },
    eventsByCountry: async (root, args) => {
      const name = args.name;
      const data = await fetchCommunities();
      const filtered = data.filter(c => c.country === name);
      return filtered;
    }
  },
  Event: {
    time: (root, args) => {
      // fix that graphql only supports int32 but meetup returns javascript date
      return root.time.toString();
    },
    community: async root => {
      const data = await findCommunity(root.group.name);
      return data;
    }
  },
  Community: {
    organizers: async root => {
      const urlname = root.urlname;
      const { organizers } = await fetchEventsOrganizers(urlname);
      return organizers.map(o => ({
        name: o.name,
        role: o.group_profile.role
      }));
    },
    events: async (root, args) => {
      const first = args.first || 10;
      const { events } = await fetchEventsOrganizers(root.urlname);
      return events.slice(0, first);
    },
    upcoming: async (root, args) => {
      const first = args.first || 10;
      const { upcoming } = await fetchEventsOrganizers(root.urlname);
      return upcoming.slice(0, first);
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });
app.get("/", (req, res) => {
  res.send("GDG Search");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Listening on http://localhost:" + PORT));
