import { LitElement, css, html } from "lit-element";
import { until } from "lit-html/directives/until.js";

class SearchMeetups extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      communities: { type: Array },
      countries: { type: Array }
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
    this.fetching = Promise.all([
      this.fetchCommunities(),
      this.fetchCountries()
    ]);
  }
  async fetchCommunities() {
    const listRequest = await fetch("./src/list.json");
    const json = await listRequest.json();
    this.communities = json;
  }
  async fetchCountries() {
    const listRequest = await fetch("./src/countries-unescaped.json");
    const json = await listRequest.json();
    this.countries = json;
  }

  render() {
    const communitiesResult = this.fetching.then(() => {
      return this.communities.filter(c => {
        if (this.name === "") return true;
        if (
          c.region &&
          c.region.toLowerCase().includes(this.name.toLowerCase())
        ) {
          return true;
        }
        return (
          c.name.toLowerCase().includes(this.name.toLowerCase()) ||
          c.city.toLowerCase().includes(this.name.toLowerCase()) ||
          c.country.toLowerCase().includes(this.name.toLowerCase())
        );
      });
    });
    return html`
      <h4 style="float:right;">
        <a href="https://github.com/kevinsimper/gdg-search"
          >Made with Lit-Element and Firebase ❤️</a
        >
      </h4>
      <h1>🌍 Search all GDG's in the world</h1>
      <h3>
        There is
        ${until(
          this.fetching.then(() => {
            return this.communities.length;
          }),
          html`
            loading..
          `
        )} communties</h3>
        <p>
          Select a region: ${until(
            this.fetching.then(() => {
              return [...new Set(this.countries.map(c => c.region))].map(
                c =>
                  html`
                    <a
                      href="#"
                      @click="${
                        e => {
                          e.preventDefault();
                          this.name = c;
                        }
                      }"
                      >${c}</a
                    >
                  `
              );
            })
          )}
        </p>
        <input
          class="search"
          type="text"
          .value=${this.name}
          @input="${e => (this.name = e.target.value)}"
          placeholder="Type and search.."
        />
        <p>${until(
          communitiesResult.then(
            c =>
              html`
                Found <strong>${c.length}</strong> results
              `
          )
        )}</p>
        <hr/>
        <div>
          ${until(
            communitiesResult.then(communities => {
              return communities.map(c => {
                let country = this.countries.find(i => {
                  return (
                    i.name.common === c.country || i.name.official === c.country
                  );
                });
                c.region = (country && country.region) || "";
                return html`
                  <div class="group">
                    <div>
                      <a href="https://meetup.com/${c.urlname}">${c.name}</a>
                    </div>
                    <div>
                      ${c.city}, ${c.country} ${country && country.flag}
                    </div>
                    <div>${country && country.region}</div>
                  </div>
                `;
              });
            }),
            html`
              waiting
            `
          )}
        </div>
      </h2>
    `;
  }
}

customElements.define("search-gdg", SearchMeetups);
