import { LitElement, css, html } from "lit-element";
import { until } from "lit-html/directives/until.js";

class MostActive extends LitElement {
  static get properties() {
    return {
      communities: { type: Array }
    };
  }
  constructor() {
    super();
    this.fetching = this.fetchList();
  }
  static get styles() {
    return css`
      .container {
        max-width: 1000px;
        margin: 0 auto;
      }
    `;
  }
  async fetchList() {
    const listRequest = await fetch("./src/most-active.json");
    const json = await listRequest.json();
    this.communities = json;
  }
  render() {
    return html`
      <div class="container">
        <h1>Most Active</h1>
        <ul>
          ${
            until(
              this.fetching.then(f => {
                return html`
                  ${
                    this.communities.map(c => {
                      return html`
                        <li>${c.name} - ${c.count}</li>
                      `;
                    })
                  }
                `;
              }),
              html`
                Loading...
              `
            )
          }
        </ul>
      </div>
    `;
  }
}

customElements.define("x-most-active", MostActive);
