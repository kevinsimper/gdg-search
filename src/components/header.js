import { LitElement, css, html } from "lit-element";

class Header extends LitElement {
  static get styles() {
    return css`
      .menu {
        background: #1b1c1d;
        color: white;
        height: 60px;
      }

      .container {
        max-width: 940px;
        margin: 0 auto;
        display: flex;
      }
      .header {
        font-weight: bold;
      }
      .item {
        color: white;
        line-height: 60px;
        padding: 0 15px;
        text-decoration: none;
      }
    `;
  }
  render() {
    return html`
      <header class="menu">
        <div class="container">
          <a href="/#!" class="header item">🌍 GDG Search</a>
          <a href="/#!" class="item">Home</a>
          <a href="/#!most-active" class="item">Most Active</a>
          <a href="https://goo.gl/forms/mIqfksuzY9wigutt1" class="item"
            >Feedback? 😍</a
          >
        </div>
      </header>
    `;
  }
}

customElements.define("x-header", Header);
