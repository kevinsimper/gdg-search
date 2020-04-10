import { LitElement, css, html } from "lit-element";
import { until } from "lit-html/directives/until.js";
import "../components/container.js";
import "../components/table.js";

class MostActive extends LitElement {
  static get properties() {
    return {
      active: { type: Array },
      communities: { type: Array },
      sortBy: { type: String }
    };
  }
  constructor() {
    super();
    this.sortBy = "all";
    this.fetching = Promise.all([this.fetchList(), this.fetchCommunities()]);
  }
  static get styles() {
    return css`
      .button {
        background-color: #6200ee;
        color: #fff;
        padding: 8px 16px;
        height: 36px;
        border-radius: 4px;
        line-height: 36px;
        margin: 0 8px;
        text-decoration: none;
      }
      .button:hover {
        background-color: #6200eee6;
      }
    `;
  }
  async fetchList() {
    const listRequest = await fetch("./src/most-active.json");
    const json = await listRequest.json();
    this.active = json;
  }
  async fetchCommunities() {
    const listRequest = await fetch("./src/list.json");
    const json = await listRequest.json();
    this.communities = json;
  }
  renderList(events, property) {
    return events
      .sort((a, b) => {
        return b[property] - a[property];
      })
      .map((c, i) => {
        const community = this.communities.find(i => i.urlname === c.name);
        if (!community) {
          return html`
            <tr>
              <td>${i + 1}</td>
              <td>${c.name} - ${c[property]}</td>
            </tr>
          `;
        }
        return html`
          <tr>
            <td>${i + 1}</td>
            <td>
              <a target="_blank" href="https://meetup.com/${community.urlname}"
                >${community.name}</a
              >
            </td>
            <td>${c[property]}</td>
            <td><a href="#!community/${community.urlname}">Details</a></td>
          </tr>
        `;
      });
  }
  render() {
    return html`
      <x-container>
        <h1>
          Most Active
          <img
            src="/src/logo-GDG.svg"
            style="width: 55px;vertical-align: middle;"
          />
          GDG
        </h1>
        <p>
          This is the list of GDG that has organized the most events. I think it
          is interesting and I created this list so that anyone can look at
          other active GDG's and get inspired by what kind of events that they
          are running. So it is not a competetion about how can create the most
          events 😄
        </p>
        <p>
          ${
            until(
              this.fetching.then(f => {
                const total =
                  this.sortBy === "all"
                    ? this.active.reduce((cur, i) => cur + i.all, 0)
                    : this.sortBy === "yearly"
                    ? this.active.reduce((cur, i) => cur + i.yearly, 0)
                    : this.active.reduce((cur, i) => cur + i.quarter, 0);
                return html`
                  Total events: ${total}
                `;
              }),
              html`
                Loading...
              `
            )
          }
        </p>
        <p>
          Most Active:
          <a class="button" href="/#!most-active/quarter">Quarterly</a>
          <a class="button" href="/#!most-active">Yearly</a>
          <a class="button" href="/#!most-active/all">All</a>
        </p>
        <x-table
          .content="${
            html`
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Events</th>
                  <th></th>
                </tr>
              </thead>
              ${
                until(
                  this.fetching.then(f => {
                    return html`
                      ${
                        this.sortBy === "all"
                          ? this.renderList(this.active, "all")
                          : this.sortBy === "yearly"
                          ? this.renderList(this.active, "yearly")
                          : this.renderList(this.active, "quarter")
                      }
                    `;
                  }),
                  html`
                    Loading...
                  `
                )
              }
            `
          }"
        >
        </x-table>
      </x-container>
    `;
  }
}

customElements.define("x-most-active", MostActive);
