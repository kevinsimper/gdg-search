import { LitElement, html } from "lit-element";
import "../components/container.js";
import "../components/eventgraph.js";
import "../components/communitiesmap.js";
import "../components/loader.js";
import "../components/table.js";

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
            urlname
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
      <x-container>
        <h1>Search Events GraphQL</h1>
        <div>
          <input
            type="text"
            value="${this.query}"
            style="font-size: 1.5rem;"
            @input="${e => (this.query = e.target.value)}"
          />
          <button
            style="font-size: 1.5rem;"
            @click="${() => {
              this.search();
            }}"
          >
            Search
          </button>
        </div>
        ${this.loading
          ? html`
              <x-loader></x-loader>
              <div>Loading..</div>
            `
          : ""}
        ${this.data.searchEvents !== undefined
          ? html`
              <h3>
                Found ${this.data.searchEvents.eventsCount} events in
                ${this.data.searchEvents.communityCount} GDG communities
              </h3>
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
              <div style="margin-top: 20px">
                <x-table
                  .content="${html`
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Group</th>
                        <th>Event</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${this.data.searchEvents.events.map(i => {
                        return html`
                          <tr>
                            <td>${i.time}</td>
                            <td>
                              <a
                                href="https://meetup.com/${i.community.urlname}"
                                >${i.community.name}</a
                              >
                            </td>
                            <td>${i.name}</td>
                          </tr>
                        `;
                      })}
                    </tbody>
                  `}"
                >
                </x-table>
              </div>
            `
          : ""}
      </x-container>
    `;
  }
}

customElements.define("x-search-events-graphql", SearchEventsGraphql);
