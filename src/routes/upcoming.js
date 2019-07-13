import { LitElement, html } from "lit-element";
import "../components/container.js";
import "../components/table.js";

const URL =
  window.location.host === "127.0.0.1:8081"
    ? "http://localhost:3000/graphql"
    : "https://gdg-search-wcazoqzmdq-uc.a.run.app/graphql";

class UpcomingEvents extends LitElement {
  static get properties() {
    return {
      events: {
        type: Array
      },
      limit: {
        type: Number
      }
    };
  }
  constructor() {
    super();
    this.events = [];
    this.limit = 50;
  }
  async connectedCallback() {
    super.connectedCallback();
    this.upcoming();
  }
  async upcoming() {
    const events = await this.fetchResults();
    this.events = events.data.upcomingEvents;
  }
  async fetchResults(query) {
    const graphqlQuery = `{
      upcomingEvents(first: ${this.limit}) {
        id
        name
        time,
        community {
          name
          urlname
        }
      }
    }`;
    const req = await fetch(URL, {
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        operationName: null,
        variables: {},
        query: graphqlQuery
      }),
      method: "POST"
    });
    const data = await req.json();
    return data;
  }
  render() {
    return html`
      <x-container>
        <h1>Upcoming events</h1>
        <x-table
          .content="${html`
            <thead>
              <tr>
                <th>GDG</th>
                <th>Title</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${this.events.map(e => {
                return html`
                  <tr>
                    <td>
                      <a href="https://meetup.com/${e.community.urlname}"
                        >${e.community.name}</a
                      >
                    </td>
                    <td>
                      <a
                        href="https://meetup.com/${e.community
                          .urlname}/events/${e.id}"
                        >${e.name}</a
                      >
                    </td>
                    <td>
                      ${new Date(parseInt(e.time))
                        .toISOString()
                        .split(":")
                        .slice(0, 2)
                        .join(":")}
                    </td>
                  </tr>
                `;
              })}
            </tbody>
          `}"
        ></x-table>
        Showing ${this.limit} results
        <button
          @click="${e => {
            this.limit += 100;
            this.upcoming();
          }}"
        >
          Show 100 more
        </button>
      </x-container>
    `;
  }
}

customElements.define("x-upcoming", UpcomingEvents);
