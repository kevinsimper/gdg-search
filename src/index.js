import { LitElement, css, html } from "lit-element";
import "./Search.js";
import "./header.js";

class GDGMain extends LitElement {
  render() {
    return html`
      <x-header></x-header><search-gdg></search-gdg>
    `;
  }
}

customElements.define("x-gdgmain", GDGMain);
