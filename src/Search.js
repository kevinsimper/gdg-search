import { LitElement, css, html } from "lit-element";
import { until } from "lit-html/directives/until.js";
import "./components/container.js";
import "./components/table.js";

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
      .group {
        margin: 10px 0;
      }
      .search {
        font-size: 20px;
        width: 100%;
        max-width: 250px;
        padding: 5px;
      }
      header {
        border-bottom: 3px solid black;
        margin-bottom: 30px;
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
    this.countries = this.communities.map(i => {
      if (i.country === "USA") {
        i.country = "United States";
      }
      return i;
    });
  }
  async fetchCountries() {
    const listRequest = await fetch("./src/countries-unescaped.json");
    const json = await listRequest.json();
    this.countries = json;
  }
  filterResults() {
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
  }
  render() {
    const communitiesResult = this.fetching.then(() => this.filterResults());
    return html`
      <x-container>
        <header>
          <h4 style="float:right; text-align: right;">
            <a href="https://github.com/kevinsimper/gdg-search"
              >Made with Lit-Element and Firebase ❤️</a
            ><br />
            <a href="https://goo.gl/forms/mIqfksuzY9wigutt1">Feedback?</a>
          </h4>
          <h1>🌍 Search all GDG's in the world</h1>
          <h3>
            There is
            ${
              until(
                this.fetching.then(() => {
                  return this.communities.length;
                }),
                html`
                  loading..
                `
              )
            }
            communties
          </h3>
          <p>
            Select a region:
            ${
              until(
                this.fetching.then(() => {
                  // Only show regions with communities in it
                  // Set does not contain duplicates
                  const removeDups = [
                    ...new Set(this.countries.map(c => c.region))
                  ];
                  return removeDups.map(
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
              )
            }
          </p>
          <input
            class="search"
            type="text"
            .value="${this.name}"
            @input="${e => (this.name = e.target.value)}"
            placeholder="Type and search.."
          />
          <p>
            ${
              until(
                communitiesResult.then(
                  c =>
                    html`
                      Found <strong>${c.length}</strong> results
                    `
                )
              )
            }
          </p>
        </header>
        <div>
          <x-table
            .content="${
              html`
                <tbody>
                  ${
                    until(
                      communitiesResult.then(communities => {
                        return communities.map((c, i) => {
                          let country = this.countries.find(i => {
                            return (
                              i.name.common === c.country ||
                              i.name.official === c.country
                            );
                          });
                          c.region = (country && country.region) || "";
                          return html`
                            <tr>
                              <td>${i + 1}</td>
                              <td>
                                <a href="https://meetup.com/${c.urlname}"
                                  >${c.name}</a
                                >
                              </td>
                              <td>
                                ${c.city}, ${c.country}
                                ${country && country.flag}
                              </td>
                              <td>${country && country.region}</td>
                              <td>
                                <a href="#!community/${c.urlname}">Details</a>
                              </td>
                            </tr>
                          `;
                        });
                      }),
                      html`
                        waiting
                      `
                    )
                  }
                </tbody>
              `
            }"
          >
          </x-table>
        </div>
      </x-container>
    `;
  }
}

customElements.define("search-gdg", SearchMeetups);
