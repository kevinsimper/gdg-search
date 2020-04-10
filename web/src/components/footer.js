import { LitElement, css, html } from "lit-element";

class Footer extends LitElement {
  static get styles() {
    return css`
      .footer {
        margin-top: 100px;
        text-align: center;
        background: #ececec;
        line-height: 200px;
      }
    `;
  }
  render() {
    return html`
      <footer class="footer">
        GDGSearch.com 2020
      </header>
    `;
  }
}

customElements.define("x-footer", Footer);
