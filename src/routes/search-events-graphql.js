import { LitElement, html } from "lit-element";
import "../components/eventgraph.js";
import "../components/communitiesmap.js";

const URL = "https://gdg-search-wcazoqzmdq-uc.a.run.app/graphql";

class SearchEventsGraphql extends LitElement {
  static get properties() {
    return {
      query: String,
      data: Object,
      loading: Boolean,
      mapType: String
    };
  }
  constructor() {
    super();
    this.query = "";
    this.mapType = "marker";
    this.data = {};
    this.loading = false;
  }
  componentDidMount() {}
  async search() {
    this.loading = true;
    const data = await this.fetchResults(this.query);
    const fixedEvents = data.data.searchEvents.events.map(i => {
      return {
        ...i,
        time: parseInt(i.time)
      };
    });
    this.data = {
      searchEvents: {
        ...data.data.searchEvents,
        events: fixedEvents
      }
    };
    this.communitymap = this.data.searchEvents.communities.map(community => ({
      community,
      finds: this.data.searchEvents.events.filter(
        e => e.community.name === community.name
      )
    }));
    this.loading = false;
  }
  async fetchResults(query) {
    const graphqlQuery = `{
      searchEvents(query: "${query}") {
        eventsCount,
        events {
          name
          time
          community {
            name
          }
        }
        communities {
          name
          lat
          lon
        }
        communityCount
      }
    }`;
    const req = await fetch(URL, {
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        operationName: null,
        variables: {},
        query: graphqlQuery
      }),
      method: "POST"
    });
    const data = await req.json();
    return data;
  }
  render() {
    return html`
      <h1>Search Events GraphQL</h1>
      <input
        type="text"
        value="${this.query}"
        @input="${e => (this.query = e.target.value)}"
      />
      <button
        @click="${() => {
          this.search();
        }}"
      >
        Search
      </button>
      ${this.loading
        ? html`
            <div>Loading..</div>
          `
        : ""}
      ${this.data.searchEvents !== undefined
        ? html`
            <h3>${this.data.searchEvents.eventsCount} events</h3>
            <h3>${this.data.searchEvents.communityCount} GDG's</h3>
            <x-event-graph
              .events="${this.data.searchEvents.events}"
            ></x-event-graph>
            <div>
              <button
                @click="${e => {
                  this.mapType = "marker";
                }}"
              >
                Markers
              </button>
              <button
                @click="${e => {
                  this.mapType = "heatmap";
                }}"
              >
                Heatmap
              </button>
            </div>
            <x-communities-map
              .communities="${this.communitymap}"
              type="${this.mapType}"
            ></x-communities-map>
          `
        : ""}
    `;
  }
}

customElements.define("x-search-events-graphql", SearchEventsGraphql);
