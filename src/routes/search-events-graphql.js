import { LitElement, html } from "lit-element";

const URL = "https://gdg-search-wcazoqzmdq-uc.a.run.app/graphql";

class SearchEventsGraphql extends LitElement {
  static get properties() {
    return {
      query: String,
      data: Object,
      loading: Boolean
    };
  }
  constructor() {
    super();
    this.query = "";
    this.data = {};
    this.loading = false;
  }
  componentDidMount() {}
  async search() {
    this.loading = true;
    const data = await this.fetchResults(this.query);
    this.data = data.data;
    this.loading = false;
  }
  async fetchResults(query) {
    const graphqlQuery = `{
      searchEvents(query: "${query}") {
        eventsCount,
        events {
          name
        }
        communities {
          name
        }
        communityCount
      }
    }`;
    const req = await fetch(URL, {
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        operationName: null,
        variables: {},
        query: graphqlQuery
      }),
      method: "POST"
    });
    const data = await req.json();
    return data;
  }
  render() {
    return html`
      <h1>Search Events GraphQL</h1>
      <input
        type="text"
        value="${this.query}"
        @input="${e => (this.query = e.target.value)}"
      />
      <button
        @click="${() => {
          this.search();
        }}"
      >
        Search
      </button>
      ${this.loading
        ? html`
            <div>Loading..</div>
          `
        : ""}
      ${this.data.searchEvents !== undefined
        ? html`
            <div>${this.data.searchEvents.eventsCount}</div>
            <div>${this.data.searchEvents.communityCount}</div>
          `
        : ""}
    `;
  }
}

customElements.define("x-search-events-graphql", SearchEventsGraphql);
