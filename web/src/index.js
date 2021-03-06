import { LitElement, css, html } from "lit-element";
import Navigo from "navigo";
import { navigation } from "./components/header.js";
import "./components/footer.js";
import "./routes/community.js";
import "./routes/events-country.js";
import "./routes/events.js";
import "./routes/map.js";
import "./routes/most-active.js";
import "./routes/search-events.js";
import "./routes/Search.js";
import "./routes/upcoming.js";
import "./routes/about.js";

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
            <x-search-events query="${queryEvents}"></x-search-events>
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
        map: params => {
          this.route = html`
            <x-map></x-map>
          `;
        },
        about: params => {
          this.route = html`
            <x-about></x-about>
          `;
        },
        search: (params, query) => {
          const region = decodeURIComponent(query.split("=")[1]);
          this.route = html`
            <search-gdg query="${region}"></search-gdg>
          `;
        },
        upcoming: (params, query) => {
          let region = "";
          if (query) {
            region = decodeURIComponent(query.split("=")[1]);
          }
          this.route = html`
            <x-upcoming region="${region}"></x-upcoming>
          `;
        },
        "*": () => {
          this.route = html`
            <search-gdg query=""></search-gdg>
          `;
        }
      })
      .resolve();
  }
  render() {
    return html`
      <div style="display: flex;flex-direction: column;min-height: 100vh;">
        <x-header></x-header>
        <div style="flex: 1">${this.route}</div>
        <x-footer></x-footer>
      </div>
    `;
  }
}

customElements.define("x-gdgmain", GDGMain);
