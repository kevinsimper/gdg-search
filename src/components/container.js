import { LitElement, css, html } from "lit-element";

class AppContainer extends LitElement {
  static get styles() {
    return css`
      .container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 10px;
      }
    `;
  }
  render() {
    return html`
      <div class="container"><slot></slot></div>
    `;
  }
}

customElements.define("x-container", AppContainer);
