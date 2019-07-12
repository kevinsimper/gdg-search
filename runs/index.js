const { createServer, get } = require("http");
const express = require("express");
const fetch = require("node-fetch");
const pMemoize = require("p-memoize");
const { ApolloServer, gql } = require("apollo-server-express");

const app = express();

async function _fetchCommunities() {
  // console.log("fetching communities");
  const req = await fetch(
    "https://raw.githubusercontent.com/kevinsimper/gdg-search/master/src/list.json"
  );
  const data = await req.json();
  return data;
}
const fetchCommunities = pMemoize(_fetchCommunities, { maxAge: 1000 * 3600 });

async function _fetchEvents(name) {
  // console.log("fetching events", name);
  try {
    const req = await fetch(
      encodeURI(
        `https://raw.githubusercontent.com/kevinsimper/gdg-events/master/${name}.json`
      )
    );
    const json = await req.json();
    return json.events;
  } catch (e) {
    console.log("error fetch event", name, e.name);
    return [];
  }
}

const fetchEvents = pMemoize(_fetchEvents, { maxAge: 1000 * 3600 });

async function getCommunities(req, res) {
  const data = await fetchCommunities();
  res.setHeader("Content-Type", "application/json;");
  res.end(JSON.stringify(data));
}

async function getCommunityEvents(req, res) {
  const name = req.url.match(/\/communities\/(\S*)\/events/);
  const events = await fetchEvents(name[1]);
  res.setHeader("Content-Type", "application/json;");
  res.end(JSON.stringify(events));
}

async function getSearch(req, res) {
  const query = require("url")
    .parse(req.url, true)
    .query.name.toLowerCase();
  const communities = await fetchCommunities();
  const allEvents = await Promise.all(
    communities.map(async community => {
      const events = await fetchEvents(community.urlname);
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
      return finds;
    })
  );

  res.setHeader("Content-Type", "application/json;");
  res.end(JSON.stringify(allEvents.flat().length));
}

const typeDefs = gql`
  type Community {
    city: String
    country: String
    id: Int
    urlname: String
    name: String
    status: String
    lon: Float
    lat: Float
  }
  type Event {
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
      const events = await fetchEvents(args.name);
      return events;
    },
    searchEvents: async (root, args) => {
      const query = args.query.toLowerCase();
      const communities = await fetchCommunities();
      const communityResults = [];
      const allEvents = await Promise.all(
        communities.map(async community => {
          const events = await fetchEvents(community.urlname);
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
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });
app.get("/", (req, res) => {
  res.send("GDG Search");
});
app.get("/communities", getCommunities);
app.get("/communities/:community/events", getCommunityEvents);
app.get("/search", getSearch);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Listening on http://localhost:" + PORT));
