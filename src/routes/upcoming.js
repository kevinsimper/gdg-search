import { LitElement, html, css } from "lit-element";
import "../components/container.js";
import "../components/table.js";

const URL =
  window.location.host === "127.0.0.1:8081"
    ? "http://localhost:3000/graphql"
    : "https://gdg-search-wcazoqzmdq-uc.a.run.app/graphql";

const regions = [
  "Africa",
  "Americas",
  "Antarctic",
  "Asia",
  "Europe",
  "Oceania"
];
const subregions = [
  "Australia and New Zealand",
  "Caribbean",
  "North America",
  "Central America",
  "South America",
  "Melanesia",
  "Micronesia",
  "Polynesia",
  "South-Eastern Asia",
  "Eastern Asia",
  "Southern Asia",
  "Western Asia",
  "Central Asia",
  "Northern Africa",
  "Middle Africa",
  "Eastern Africa",
  "Western Africa",
  "Southern Africa",
  "Northern Europe",
  "Central Europe",
  "Eastern Europe",
  "Western Europe",
  "Southern Europe"
];

class UpcomingEvents extends LitElement {
  static get styles() {
    return css`
      .search {
        font-size: 20px;
        width: 100%;
        max-width: 250px;
        padding: 5px;
      }
    `;
  }
  static get properties() {
    return {
      events: {
        type: Array
      },
      limit: {
        type: Number
      },
      region: {
        type: String
      },
      status: {
        type: String
      }
    };
  }
  constructor() {
    super();
    this.events = [];
    this.limit = 50;
    this.region = "europe";
    this.status = html`
      <h2>Loading...</h2>
    `;
  }
  async connectedCallback() {
    super.connectedCallback();
    this.status = `Loading...`;
    this.upcoming();
  }
  async upcoming() {
    const events = await this.fetchResults();
    this.events = events.data.upcomingEvents;
    this.status = "";
  }
  updated(changedProperties) {
    if (changedProperties.get("region") !== undefined) {
      this.updateURL();
      this.status = `Loading...`;
      this.events = [];
      this.upcoming();
    }
  }
  async fetchResults(region) {
    const graphqlQuery = `{
      upcomingEvents(first: ${this.limit}, region: "${this.region}") {
        id
        name
        time,
        community {
          name
          urlname
          country
        }
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
    }).catch(e => {
      alert("Request to backend failed!");
    });
    if (!req.ok) {
      alert("Request to backend failed!");
    }
    const data = await req.json();
    return data;
  }
  updateURL() {
    history.pushState({}, "Search GDG", "/#!upcoming?region=" + this.region);
  }
  render() {
    return html`
      <x-container>
        <h1>Upcoming events</h1>
        <input
          id="search"
          class="search"
          type="text"
          .value="${this.region}"
          @input="${e => {
            this.region = e.target.value;
          }}"
          placeholder="Type in region.."
        />
        <h3>Selection region</h3>
        ${regions.map(
          c =>
            html`
              <a
                href="#"
                @click="${e => {
                  e.preventDefault();
                  this.region = c;
                }}"
                >${c}</a
              >
            `
        )}
        <h4>Subregions:</h4>
        ${subregions.map(
          c =>
            html`
              <a
                style="padding: 0 12px 12px 0;display: inline-block;"
                href="#"
                @click="${e => {
                  e.preventDefault();
                  this.region = c;
                }}"
                >${c}</a
              >
            `
        )}

        <x-table
          .content="${html`
            <thead>
              <tr>
                <th>GDG</th>
                <th>Country</th>
                <th>Title</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${this.events.map(e => {
                return html`
                  <tr>
                    <td>
                      <a href="https://meetup.com/${e.community.urlname}"
                        >${e.community.name}</a
                      >
                    </td>
                    <td>
                      ${e.community.country}
                    </td>
                    <td>
                      <a
                        href="https://meetup.com/${e.community
                          .urlname}/events/${e.id}"
                        >${e.name}</a
                      >
                    </td>
                    <td>
                      ${new Date(parseInt(e.time))
                        .toISOString()
                        .split(":")
                        .slice(0, 2)
                        .join(":")}
                    </td>
                  </tr>
                `;
              })}
              ${this.status.length === 0 && this.events.length === 0
                ? html`
                    <td>No events found!</td>
                  `
                : ""}
            </tbody>
          `}"
        ></x-table>
        ${this.status.length > 0
          ? html`
              <h2>${this.status}</h2>
            `
          : ""}
        <div style="margin: 20px 0">
          <button
            style="font-size: 1rem;"
            @click="${e => {
              this.limit += 100;
              this.upcoming();
            }}"
          >
            Show 100 more
          </button>
          Showing ${this.limit} results
        </div>
      </x-container>
    `;
  }
}

customElements.define("x-upcoming", UpcomingEvents);
