import { LitElement, css, html } from "lit-element";
import "./Search.js";
import "./header.js";
import Navigo from "navigo";

class GDGMain extends LitElement {
  static get properties() {
    return {
      route: { type: Object }
    };
  }
  constructor() {
    super();
    this.router = new Navigo("/", true, "#!");
    this.route = null;
    this.router
      .on({
        "most-active": () => {
          this.route = html`
            <h1>Most active</h1>
          `;
        },
        "*": () => {
          this.route = html`
            <search-gdg></search-gdg>
          `;
        }
      })
      .resolve();
  }
  render() {
    return html`
      <x-header></x-header>${this.route}
    `;
  }
}

customElements.define("x-gdgmain", GDGMain);
