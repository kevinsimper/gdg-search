import { LitElement, css, html } from "lit-element";
import "./components/container.js";

class Events extends LitElement {
  render() {
    return html`
      <x-container
        ><h1>Events</h1>
        <p>This page will show events per country.</p></x-container
      >
    `;
  }
}

customElements.define("x-events", Events);
