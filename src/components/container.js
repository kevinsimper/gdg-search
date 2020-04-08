import { LitElement, css, html } from "lit-element";

class AppContainer extends LitElement {
  static get styles() {
    return css`
      .container {
        display: flex;
        justify-content: center;
      }
      .content {
        max-width: 1500px;
      }
    `;
  }
  render() {
    return html`
      <div class="container">
        <div class="content"><slot></slot></div>
      </div>
    `;
  }
}

customElements.define("x-container", AppContainer);
