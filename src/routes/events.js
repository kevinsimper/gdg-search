import { LitElement, css, html } from "lit-element";
import { until } from "lit-html/directives/until.js";
import "../components/container.js";

class Events extends LitElement {
  static get properties() {
    return {
      countries: { type: Array }
    };
  }
  constructor() {
    super();
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
        ${
          until(
            this.fetching.then(() => {
              return html`
                <table>
                  ${
                    this.countries
                      .map(c => c.name.common)
                      .sort()
                      .map(c => {
                        return html`
                          <tr>
                            <td>
                              <a href="#!events/${c.toLowerCase()}">${c}</a>
                            </td>
                          </tr>
                        `;
                      })
                  }
                </table>
              `;
            }),
            html`
              Loading
            `
          )
        }
      </x-container>
    `;
  }
}

customElements.define("x-events", Events);
