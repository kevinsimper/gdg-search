import { LitElement, css, html } from "lit-element";

class AppContainer extends LitElement {
  static get styles() {
    return css`
      .container {
        justify-content: center;
      }
      @media (min-width: 1100px) {
        .container {
          display: flex;
        }
      }
      .content {
        max-width: 1000px;
        padding: 10px;
      }
      * {
        box-sizing: border-box;
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
