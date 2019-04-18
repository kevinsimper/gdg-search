import { LitElement, css, html } from "lit-element";
import { until } from "lit-html/directives/until.js";
import "./components/container.js";
import { fetchCommunities } from "./models/index.js";
import "./components/table.js";

class EventsCountry extends LitElement {
  static get properties() {
    return {
      country: { type: String },
      countries: { type: Array },
      communities: { type: Array },
      countryCommunities: { type: Array }
    };
  }
  constructor() {
    super();
    this.countryCommunities = [];
    this.fetching = Promise.all([fetchCommunities.bind(this)()]).then(() =>
      this.filterCountry()
    );
  }
  filterCountry() {
    this.countryCommunities = this.communities.filter(
      i => i.country.toLowerCase() === this.country
    );
  }
  render() {
    return html`
      <x-container>
        <h1>Events in ${this.country}</h1>
        <p>This page will show events per country.</p>
        <h3>Communities in ${this.country}</h3>
        <x-table
          .content="${
            html`
              ${
                this.countryCommunities.map(i => {
                  return html`
                    <tr>
                      <td>${i.name}</td>
                    </tr>
                  `;
                })
              }
            `
          }"
        ></x-table>
      </x-container>
    `;
  }
}

customElements.define("x-events-country", EventsCountry);
