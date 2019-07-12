import { LitElement, css, html } from "lit-element";
import { until } from "lit-html/directives/until.js";
import "../components/container.js";
import "../components/table.js";
import { fetchCommunities, fetchCountries } from "../models/index.js";

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
      fetchCommunities.bind(this)(),
      fetchCountries.bind(this)()
    ]).then(() => {
      this.communities.map(c => {
        let country = this.countries.find(country => {
          return (
            country.name.common === c.country ||
            country.name.official === c.country
          );
        });
        c.flag = (country && country.flag) || "";
        c.region = (country && country.region) || "";
        c.subregion = (country && country.subregion) || "";
      });
    });
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
      if (
        c.subregion &&
        c.subregion.toLowerCase().includes(this.name.toLowerCase())
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
  updateSearch(name) {
    this.name = name;
    window.location.hash = "#!search?region=" + name;
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
            value="${this.name}"
            @input="${e => this.updateSearch(e.target.value)}"
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
                          return html`
                            <tr>
                              <td>${i + 1}</td>
                              <td>
                                <a href="https://meetup.com/${c.urlname}"
                                  >${c.name}</a
                                >
                              </td>
                              <td>
                                <a
                                  title="Click and search this city"
                                  href="#"
                                  @click="${
                                    e => {
                                      e.preventDefault();
                                      this.updateSearch(c.city);
                                    }
                                  }"
                                  >${c.city}</a
                                >,
                                <a
                                  title="Click and search this country"
                                  href="#"
                                  @click="${
                                    e => {
                                      e.preventDefault();
                                      this.updateSearch(c.country);
                                    }
                                  }"
                                  >${c.country}</a
                                >
                                ${c.flag}
                              </td>
                              <td>
                                <a
                                  title="Click and search this region"
                                  href="#"
                                  @click="${
                                    e => {
                                      e.preventDefault();
                                      this.updateSearch(c.region);
                                    }
                                  }"
                                  >${c.region}</a
                                >
                              </td>
                              <td>
                                <a
                                  title="Click and search this region"
                                  href="#"
                                  @click="${
                                    e => {
                                      e.preventDefault();
                                      this.updateSearch(c.subregion);
                                    }
                                  }"
                                  >${c.subregion}</a
                                >
                              </td>
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