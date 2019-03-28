import { LitElement, css, html } from "lit-element";

class MostActive extends LitElement {
  static get styles() {
    return css`
      .container {
        max-width: 1000px;
        margin: 0 auto;
      }
    `;
  }
  render() {
    return html`
      <div class="container"><h1>Most Active</h1></div>
    `;
  }
}

customElements.define("x-most-active", MostActive);
