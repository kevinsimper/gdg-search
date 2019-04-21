import { LitElement, css, html } from "lit-element";

export const navigation = () => html`
  <nav>
    <a href="/#!" class="item">Home</a>
    <a href="/#!most-active" class="item">Most Active</a>
    <a href="/#!events" class="item">Events</a>
    <a href="https://goo.gl/forms/mIqfksuzY9wigutt1" class="item"
      >Feedback? 😍</a
    >
  </nav>
`;

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
      nav {
        display: none;
      }
      .showmenu {
        display: block;
      }
      @media (min-width: 760px) {
        nav {
          display: block;
        }
        .showmenu {
          display: none;
        }
      }
    `;
  }
  render() {
    return html`
      <header class="menu">
        <div class="container">
          <a href="/#!" class="header item">🌍 GDG Search</a> ${navigation()}
          <a href="/#!menu" class="showmenu item">Show Menu</a>
        </div>
      </header>
    `;
  }
}

customElements.define("x-header", Header);