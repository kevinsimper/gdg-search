import { LitElement, html } from "lit-element";
import { fetchCommunities, fetchEvents } from "./models/index.js";
import "./components/container.js";

class SearchEvents extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      loading: { type: Boolean },
      events: { type: Array },
      results: { type: Array },
      communities: { type: Array }
    };
  }
  constructor() {
    super();
    this.name = "";
    this.loading = false;
    this.events = [];
    this.totalCount = 0;
    this.resultsCount = 0;
    this.results = [];
    this.fetching = Promise.all([fetchCommunities.bind(this)()]);
  }
  search(name) {
    this.loading = true;
    this.totalCount = 0;
    this.resultsCount = 0;
    this.results = [];
    Promise.all(
      this.communities.map(community => {
        return fetchEvents(community.urlname).then(events => {
          let finds = events.filter(e => {
            if ("name" in e) {
              if (e.name.includes(this.name)) {
                return true;
              }
            }
            if ("description" in e) {
              return e.description.includes(this.name);
            }
          });
          this.totalCount += events.length;
          this.resultsCount += finds.length;
          Array.prototype.push.apply(this.results, finds);
          this.results = this.results
            .sort((a, b) => b.time - a.time)
            .slice(0, 250);
        });
      })
    ).then(() => {
      this.loading = false;
    });
  }
  render() {
    return html`
      <x-container>
        <h1>Search events</h1>
        <p>Showing the latest event</p>
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
          ${
            this.loading
              ? html`
                  Loading..
                `
              : ""
          }
          ${
            this.resultsCount !== 0
              ? html`
                  Found ${this.resultsCount} results
                `
              : ""
          }
        </p>
        <p>
          ${
            this.totalCount !== 0
              ? html`
                  Searched through ${this.totalCount} events
                `
              : ""
          }
        </p>
        <x-table
          customStyle="white-space: initial;word-break: break-word;"
          .content="${
            html`
              <thead>
                <tr>
                  <th width="28">#</th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${
                  this.results.map((r, idx) => {
                    return html`
                      <tr>
                        <td>${idx + 1}</td>
                        <td><a href="${r.link}">${r.name}</a></td>
                        <td>
                          <a href="/#!community/${r.group.urlname}"
                            >${r.group.name}</a
                          >
                        </td>
                        <td>${r.local_date} ${r.local_time}</td>
                      </tr>
                      <tr>
                        <td colspan="4">
                          <div>${r.description.slice(0, 300)} ...</div>
                        </td>
                      </tr>
                    `;
                  })
                }
              </tbody>
            `
          }"
        ></x-table>
      </x-container>
    `;
  }
}

customElements.define("x-search-events", SearchEvents);
