import { LitElement, html, css } from "lit-element";
import "./components/container.js";
import "./components/table.js";
import "./components/organizer.js";
import {
  fetchEvents,
  fetchOrganizers,
  fetchCommunities
} from "./models/index.js";

class Group extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      events: { type: Array },
      community: { type: Object },
      communities: { type: Array },
      organizers: { type: Array }
    };
  }
  static get styles() {
    return css`
      .organizers {
        display: flex;
        margin: 0 0 20px;
      }
    `;
  }
  constructor() {
    super();
    this.events = [];
    this.organizers = [];
    this.community = {};
    this.communities = [];
  }
  async connectedCallback() {
    super.connectedCallback();
    const data = await fetchEvents(this.name);
    this.events = data.reverse();

    this.organizers = await fetchOrganizers(this.name);

    await fetchCommunities.bind(this)();
    this.community = this.communities.find(c => c.urlname === this.name);
  }
  render() {
    return html`
      <x-container>
        <h1>${this.community.name || this.name} - community</h1>
        <h3>Organizers</h3>
        <div class="organizers">
          ${
            this.organizers.map(o => {
              return html`
                <x-organizer
                  image="${
                    typeof o.photo !== "undefined" ? o.photo.photo_link : ""
                  }"
                  name="${o.name}"
                ></x-organizer>
              `;
            })
          }
        </div>
        <x-table
          .content="${
            html`
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Event</th>
                  <th>RSVP</th>
                </tr>
              </thead>
              <tbody>
                ${
                  this.events.map(i => {
                    return html`
                      <tr>
                        <td>${i.local_date}</td>
                        <td><a href="${i.link}">${i.name}</a></td>
                        <td>${i.yes_rsvp_count}</td>
                      </tr>
                    `;
                  })
                }
              </tbody>
            `
          }"
        >
        </x-table>
      </x-container>
    `;
  }
}

customElements.define("x-gdg-group", Group);
