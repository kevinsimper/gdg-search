import { LitElement, css, html } from "lit-element";

class Organizer extends LitElement {
  static get properties() {
    return {
      image: { type: String },
      name: { type: String }
    };
  }
  static get styles() {
    return css`
      .organizer {
        padding: 0 10px;
      }
      .organizer-image {
        width: 50px;
        height: 50px;
        overflow: hidden;
        border-radius: 100%;
        vertical-align: -15px;
        margin: 0 6px 0 0;
      }
      .organizer img {
        width: 100%;
      }
    `;
  }
  render() {
    return html`
      <div class="organizer">
        <div class="organizer-image"><img src="${this.image}" /></div>
        ${this.name}
      </div>
    `;
  }
}

customElements.define("x-organizer", Organizer);
