import { LitElement, css, html } from "lit-element";
import { until } from "lit-html/directives/until.js";

class MostActive extends LitElement {
  static get properties() {
    return {
      active: { type: Array },
      communities: { type: Array }
    };
  }
  constructor() {
    super();
    this.fetching = Promise.all([this.fetchList(), this.fetchCommunities()]);
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
    this.active = json;
  }
  async fetchCommunities() {
    const listRequest = await fetch("./src/list.json");
    const json = await listRequest.json();
    this.communities = json;
  }
  render() {
    return html`
      <div class="container">
        <h1>Most Active</h1>
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
                const total = this.active.reduce((cur, i) => cur + i.count, 0);
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

        <ol>
          ${
            until(
              this.fetching.then(f => {
                return html`
                  ${
                    this.active.map(c => {
                      const community = this.communities.find(
                        i => i.urlname === c.name
                      );
                      if (!community) {
                        console.log(c);
                        return html`
                          <li>${c.name} - ${c.count}</li>
                        `;
                      }
                      return html`
                        <li>
                          <a
                            target="_blank"
                            href="https://meetup.com/${community.urlname}"
                            >${community.name} - ${c.count}</a
                          >
                        </li>
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
        </ol>
      </div>
    `;
  }
}

customElements.define("x-most-active", MostActive);
