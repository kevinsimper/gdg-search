import { LitElement, html } from "lit-element";
import "./container.js";

class SearchEvents extends LitElement {
  render() {
    return html`
      <x-container><h1>Search events</h1></x-container>
    `;
  }
}

customElements.define("x-search-events", SearchEvents);
