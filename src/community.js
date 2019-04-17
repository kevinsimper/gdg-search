import { LitElement, html, css } from "lit-element";
import "./container.js";
import "./table.js";

class Group extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      events: { type: Array }
    };
  }
  constructor() {
    super();
    this.events = [];
  }
  connectedCallback() {
    super.connectedCallback();
    fetch(
      `https://raw.githubusercontent.com/kevinsimper/gdg-events/master/${
        this.name
      }.json`
    )
      .then(r => r.json())
      .then(data => {
        this.events = data.reverse();
      });
  }
  render() {
    return html`
      <x-container>
        <h1>Community: ${this.name}</h1>
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
