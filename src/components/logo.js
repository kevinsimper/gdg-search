import { LitElement, css, html } from "lit-element";

class LogoContainer extends LitElement {
  static get properties() {
    return {
      name: { type: String }
    };
  }
  static get styles() {
    return css`
      .container {
        font-family: "Product Sans";
        font-size: 2.5rem;
        color: #666c72;
      }
      stronger {
        font-weight: 500;
      }
      .logo {
        width: 55px;
        vertical-align: -0.8rem;
      }
    `;
  }
  constructor() {
    super();
    const fontEl = document.createElement("link");
    fontEl.rel = "stylesheet";
    fontEl.href =
      "https://fonts.googleapis.com/css?family=Product+Sans:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i";
    document.head.appendChild(fontEl);
  }
  render() {
    return html`
      <div class="container">
        <img src="/src/logo-GDG.svg" class="logo" /> ${
          this.name.indexOf("GDG") > -1
            ? html`
                <stronger>GDG</stronger> ${this.name.replace("GDG", "")}
              `
            : this.name
        }
      </div>
    `;
  }
}

customElements.define("x-logo", LogoContainer);
