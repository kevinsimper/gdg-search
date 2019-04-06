import { LitElement, html } from "lit-element";
import "./container.js";

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
        <ul>
          ${
            this.events.map(i => {
              return html`
                <li>
                  ${i.local_date} <a href="${i.link}">${i.name}</a> -
                  ${i.yes_rsvp_count}
                </li>
              `;
            })
          }
        </ul></x-container
      >
    `;
  }
}

customElements.define("x-gdg-group", Group);
