import { LitElement, html } from "lit-element";
import { fetchCommunities, fetchEvents } from "../models/index.js";
import "../components/container.js";
import "../components/eventgraph.js";
import "../components/communitiesmap.js";

class SearchEvents extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      loading: { type: Boolean },
      shouldDrawChart: { type: Boolean },
      shouldDrawMap: { type: Boolean },
      shouldDrawHeatmap: { type: Boolean },
      results: { type: Array },
      communities: { type: Array }
    };
  }
  constructor() {
    super();
    this.name = "";
    this.loading = false;
    this.shouldDrawChart = false;
    this.shouldDrawMap = false;
    this.shouldDrawHeatmap = false;
    this.totalCount = 0;
    this.resultsCount = 0;
    this.communityCount = 0;
    this.results = [];
    this.communitiesToDraw = [];

    this.fetching = Promise.all([fetchCommunities.bind(this)()]);
  }
  firstUpdated() {
    if (this.name !== "") {
      this.fetching.then(() => {
        this.search(this.name);
      });
    }
  }
  updateLocation(name) {
    window.location.hash = "#!search-events?query=" + name;
  }
  search(name) {
    this.updateLocation(name);
    this.loading = true;
    this.totalCount = 0;
    this.resultsCount = 0;
    this.communityCount = 0;
    this.results = [];
    Promise.all(
      this.communities.map(async community => {
        const events = await fetchEvents(community.urlname);
        let finds = events.filter(e => {
          if ("name" in e) {
            if (e.name.toLowerCase().includes(this.name.toLowerCase())) {
              return true;
            }
          }
          if ("description" in e) {
            return e.description
              .toLowerCase()
              .includes(this.name.toLowerCase());
          }
        });
        this.totalCount += events.length;
        this.resultsCount += finds.length;
        this.communityCount =
          finds.length !== 0 ? this.communityCount + 1 : this.communityCount;
        this.results = this.results.concat(finds);
        this.results = this.results.sort((a, b) => b.time - a.time);
        return {
          finds,
          community
        };
      })
    ).then(eventsPerCommunity => {
      this.communitiesToDraw = eventsPerCommunity.filter(
        ({ finds }) => finds.length !== 0
      );
      this.loading = false;
    });
  }
  render() {
    const trySearch = query => html`
      <a
        href="#"
        @click="${e => {
          e.preventDefault();
          this.name = query;
          this.search(query);
        }}"
        >${query}</a
      >
    `;
    return html`
      <x-container>
        <h1>Search events</h1>
        <p>
          Sorts the results by date DESC. Please note that this searches the
          events client-side. Don't search on 4g as it uses data.
        </p>
        <p>
          Try searching: ${trySearch("kubernetes")} ${trySearch("android")}
          ${trySearch("tensorflow")} ${trySearch("cloud")}
          ${trySearch("functions")} ${trySearch("bigquery")}
          ${trySearch("study")} ${trySearch("docker")}
          ${trySearch("javascript")} ${trySearch("python")}
        </p>
        <div style="margin: 20px 0;">
          <input
            placeholder="eg. Kubernetes"
            value="${this.name}"
            style="font-size: 1.5rem;"
            @input="${e => (this.name = e.target.value)}"
          />
          <button
            style="font-size: 1.5rem;"
            @click="${e => this.search(this.name)}"
          >
            Search
          </button>
        </div>
        <p>
          ${this.loading
            ? html`
                <x-loader></x-loader>
                <div>Loading..</div>
              `
            : ""}
          ${this.resultsCount !== 0
            ? html`
                Found ${this.resultsCount} results, in ${this.communityCount}
                GDG communities
                <label>
                  <input
                    type="checkbox"
                    @click="${e => {
                      this.shouldDrawChart = !this.shouldDrawChart;
                    }}"
                    ?checked="${this.shouldDrawChart}"
                  />
                  Draw Chart
                </label>
                <label>
                  <input
                    type="checkbox"
                    @click="${e => {
                      this.shouldDrawMap = !this.shouldDrawMap;
                    }}"
                    ?checked="${this.shouldDrawMap}"
                  />
                  Draw Map
                </label>
                <label>
                  <input
                    type="checkbox"
                    @click="${e => {
                      this.shouldDrawHeatmap = !this.shouldDrawHeatmap;
                    }}"
                    ?checked="${this.shouldDrawHeatmap}"
                  />
                  Draw Heatmap
                </label>
              `
            : ""}
        </p>
        <p>
          ${this.totalCount !== 0
            ? html`
                Searched through ${this.totalCount} events
              `
            : ""}
        </p>

        ${!this.loading
          ? html`
              ${this.shouldDrawChart
                ? html`
                    <x-event-graph .events="${this.results}"></x-event-graph>
                  `
                : html``}
            `
          : html``}
        ${!this.loading
          ? html`
              ${this.shouldDrawMap
                ? html`
                    <div id="searchmap_container" style="margin: 0 0 20px;">
                      <x-communities-map
                        .communities="${this.communitiesToDraw}"
                        type="${this.shouldDrawHeatmap ? "heatmap" : "marker"}"
                      ></x-communities-map>
                    </div>
                  `
                : html``}
            `
          : html``}

        <x-table
          customStyle="white-space: initial;word-break: break-word;"
          .content="${html`
            <thead>
              <tr>
                <th width="28">#</th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${this.results.slice(0, 250).map((r, idx) => {
                return html`
                  <tr>
                    <td>${idx + 1}</td>
                    <td><a href="${r.link}">${r.name}</a></td>
                    <td>
                      <a href="/#!community/${r.group.urlname}"
                        >${r.group.name}</a
                      >
                    </td>
                    <td>${r.yes_rsvp_count} RSVP</td>
                    <td>${r.local_date} ${r.local_time}</td>
                  </tr>
                  <tr>
                    <td colspan="5">
                      <div>
                        ${r.description ? r.description.slice(0, 300) : ""} ...
                      </div>
                    </td>
                  </tr>
                `;
              })}
            </tbody>
          `}"
        ></x-table>
        <p>${this.results.length > 250 ? "Showing max 250 results" : ""}</p>
      </x-container>
    `;
  }
}

customElements.define("x-search-events", SearchEvents);
