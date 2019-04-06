import { LitElement, html } from "lit-element";
import "./container.js";

class Group extends LitElement {
  static get properties() {
    return {
      name: { type: String }
    };
  }
  render() {
    return html`
      <x-container> <h1>Community: ${this.name}</h1> </x-container>
    `;
  }
}

customElements.define("x-gdg-group", Group);
