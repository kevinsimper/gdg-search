import { LitElement, css, html } from "lit-element";

class Table extends LitElement {
  static get properties() {
    return {
      content: { type: Object }
    };
  }
  static get styles() {
    return css`
      .table {
        max-width: 1000px;
        margin: 0;
        padding: 10px;
        display: table;
      }
    `;
  }
  render() {
    return html`
      <table class="table">
        ${this.content}
      </table>
    `;
  }
}

customElements.define("x-table", Table);
