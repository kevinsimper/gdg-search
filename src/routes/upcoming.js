import { LitElement, html } from "lit-element";

class UpcomingEvents extends LitElement {
  render() {
    return html`
      <x-container> <h1>Upcoming events</h1> </x-container>
    `;
  }
}

customElements.define("x-upcoming", UpcomingEvents);
