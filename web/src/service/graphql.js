export const graphqlURL =
  window.location.host === "127.0.0.1:8081"
    ? "http://localhost:3000/graphql"
    : "https://graphql.gdgsearch.com/graphql";
