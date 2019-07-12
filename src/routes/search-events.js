import { LitElement, html } from "lit-element";
import { fetchCommunities, fetchEvents } from "../models/index.js";
import "../components/container.js";
import "../components/eventgraph.js";

class SearchEvents extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      loading: { type: Boolean },
      shouldDrawChart: { type: Boolean },
      shouldDrawMap: { type: Boolean },
      events: { type: Array },
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
    this.events = [];
    this.totalCount = 0;
    this.resultsCount = 0;
    this.communityCount = 0;
    this.results = [];
    this.markers = [];
    this.eventsPerCommunity = [];
    this.fetching = Promise.all([fetchCommunities.bind(this)()]);

    this.loadMapSDK();
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
  removeGraph() {
    this.renderRoot.querySelector("#graph").innerHTML = "";
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
      this.eventsPerCommunity = eventsPerCommunity;
      this.loading = false;
      if (this.shouldDrawMap) {
        this.drawMap();
      } else {
        this.removeMap();
      }
    });
  }
  drawMap() {
    if (!this.map) {
      this.map = new google.maps.Map(
        this.shadowRoot.querySelector("#searchmap"),
        {
          center: { lat: 0, lng: 0 },
          zoom: 3
        }
      );
    }
    this.drawMarkers(this.eventsPerCommunity);
  }
  drawMarkers(eventsPerCommunity) {
    let communitiesToDraw = eventsPerCommunity.filter(
      ({ finds }) => finds.length !== 0
    );
    if (this.heatmap) {
      this.heatmap.setMap(null);
    }
    if (this.markers.length > 0) {
      this.markers.forEach(marker => marker.setMap(null));
    }

    if (this.shouldDrawHeatmap) {
      this.heatmap = new google.maps.visualization.HeatmapLayer({
        data: communitiesToDraw.map(({ community, finds }) => {
          return {
            location: new google.maps.LatLng(community.lat, community.lon),
            weight: finds.length
          };
        }),
        radius: 40
      });
      this.heatmap.setMap(this.map);
    } else {
      this.markers = communitiesToDraw.map(c => this.addMarker(c));
    }
  }
  addMarker({ community, finds }) {
    const marker = new google.maps.Marker({
      position: { lat: community.lat, lng: community.lon },
      map: this.map,
      title: `${community.name} - ${finds.length} events`
    });
    marker.addListener("click", () => {
      window.open(
        "https://gdg-search.firebaseapp.com/#!search?region=" + community.city,
        "_blank"
      );
    });
    return marker;
  }
  loadMapSDK() {
    const key = "AIzaSyDJMht1fBsxsa4REg-MR8_BAvmmsQRkNdM";
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=visualization`;
    document.body.append(s);
  }
  removeMap() {}
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
                      if (this.shouldDrawMap) {
                        this.drawMap();
                      } else {
                        this.removeMap();
                      }
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
                      if (this.shouldDrawHeatmap) {
                        this.drawMap();
                      } else {
                        this.drawMap();
                      }
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
        <div
          id="searchmap_container"
          style="margin: 0 0 20px; display: ${this.shouldDrawMap
            ? "block"
            : "none"}"
        >
          <div id="searchmap" style="height: 300px"></div>
        </div>

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