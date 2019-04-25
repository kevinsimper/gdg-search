import { LitElement, css, html } from "lit-element";
import Navigo from "navigo";
import "./Search.js";
import { navigation } from "./components/header.js";
import "./most-active.js";
import "./search-events.js";
import "./community.js";
import "./events.js";
import "./events-country.js";

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
            <x-most-active sortBy="yearly"></x-most-active>
          `;
        },
        "most-active/all": () => {
          this.route = html`
            <x-most-active sortBy="all"></x-most-active>
          `;
        },
        "most-active/quarter": () => {
          this.route = html`
            <x-most-active sortBy="quarter"></x-most-active>
          `;
        },
        "search-events": (params, query) => {
          let queryEvents = "";
          if (query !== "") {
            queryEvents = decodeURIComponent(query.split("=")[1]);
          }
          this.route = html`
            <x-search-events name="${queryEvents}"></x-search-events>
          `;
        },
        "community/:name": params => {
          this.route = html`
            <x-gdg-group name="${params.name}"></x-gdg-group>
          `;
        },
        events: params => {
          this.route = html`
            <x-events></x-events>
          `;
        },
        "events/:country": params => {
          this.route = html`
            loading
          `;
          setTimeout(() => {
            this.route = html`
              <x-events-country country="${params.country}"></x-events-country>
            `;
          }, 10);
        },
        menu: params => {
          this.route = html`
            <div>${navigation()}</div>
          `;
        },
        search: (params, query) => {
          const region = decodeURIComponent(query.split("=")[1]);
          this.route = html`
            <search-gdg name="${region}"></search-gdg>
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
