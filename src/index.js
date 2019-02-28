import { LitElement, css, html } from "lit-element";
import { until } from "lit-html/directives/until.js";

class SearchMeetups extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      communities: { type: Array }
    };
  }
  static get styles() {
    return css`
      :host-context(body) {
        font-family: "Roboto", sans-serif;
      }
      .group {
        margin: 10px 0;
      }
      .search {
        font-size: 20px;
        width: 100%;
        max-width: 250px;
        padding: 5px;
      }
    `;
  }
  constructor() {
    super();
    this.name = "";
    this.fetching = this.fetchCommunities();
  }
  async fetchCommunities() {
    const listRequest = await fetch("./src/list.json");
    const json = await listRequest.json();
    this.communities = json;
  }

  render() {
    return html`
      <h4 style="float:right;">
        <a href="https://github.com/kevinsimper/gdg-search"
          >Get the source code</a
        >
      </h4>
      <h1>🌍 Search all GDG's in the world</h1>
      <input
        class="search"
        type="text"
        @input="${e => (this.name = e.target.value)}"
        placeholder="Search.."
      />
      <div>
        ${
          until(
            this.fetching.then(() => {
              return this.communities
                .filter(c => {
                  if (this.name === "") return true;
                  return (
                    c.name.toLowerCase().includes(this.name.toLowerCase()) ||
                    c.city.toLowerCase().includes(this.name.toLowerCase()) ||
                    c.country.toLowerCase().includes(this.name.toLowerCase())
                  );
                })
                .map(c => {
                  return html`
                    <div class="group">
                      <div>
                        <a href="https://meetup.com/${c.urlname}">${c.name}</a>
                      </div>
                      <div>${c.city}, ${c.country}</div>
                    </div>
                  `;
                });
            }),
            html`
              waiting
            `
          )
        }
      </div>
    `;
  }
}

customElements.define("simple-greeting", SearchMeetups);

let gdgs = [];
async function main() {
  const listRequest = await fetch("./src/list.json");
  const json = await listRequest.json();
  gdgs = json;
}
main();
