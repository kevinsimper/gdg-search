import { LitElement, css, html } from "lit-element";
import { until } from "lit-html/directives/until.js";
import "../components/container.js";

class Events extends LitElement {
  static get properties() {
    return {
      countries: { type: Array },
      query: { type: String }
    };
  }
  constructor() {
    super();
    this.query = "";
    this.fetching = Promise.all([this.fetchCountries()]);
  }
  async fetchCountries() {
    const listRequest = await fetch("./src/countries-unescaped.json");
    const json = await listRequest.json();
    this.countries = json;
  }
  render() {
    return html`
      <x-container>
        <h1>Countries</h1>
        <p>This page will show events per country.</p>
        <div style="margin: 5px 0">
          <input
            type="text"
            style="font-size: 1.5rem; padding: 5px;"
            placeholder="Search countries.."
            @keyup="${e => {
              this.query = e.target.value;
            }}"
          />
        </div>
        ${until(
          this.fetching.then(() => {
            const content = this.countries
              .map(c => c.name.common)
              .filter(
                c => c.toLowerCase().indexOf(this.query.toLowerCase()) > -1
              )
              .sort()
              .map(c => {
                return html`
                  <tr>
                    <td>
                      <a href="#!events/${c.toLowerCase()}">${c}</a>
                    </td>
                  </tr>
                `;
              });
            return html`
              <x-table
                .content="${html`
                  <thead>
                    <tr>
                      <th>Country</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${content}
                  </tbody>
                `}"
              ></x-table>
            `;
          }),
          html`
            Loading
          `
        )}
      </x-container>
    `;
  }
}

customElements.define("x-events", Events);
