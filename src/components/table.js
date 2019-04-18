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
        white-space: nowrap;
        border-collapse: collapse;
      }
      .table tbody tr:nth-of-type(odd) {
        background-color: rgba(0, 0, 0, 0.05);
      }
      .table tr:nth-of-type(odd) {
        background-color: rgba(0, 0, 0, 0.05);
      }
      .table thead tr th {
        color: #fff;
        background-color: #343a40;
      }
      .table th {
        padding: 0.5rem;
      }
      .table td {
        padding: 0.5rem;
      }
      .wrapper {
        overflow-x: auto;
      }
    `;
  }
  render() {
    return html`
      <div class="wrapper">
        <table class="table">
          ${this.content}
        </table>
      </div>
    `;
  }
}

customElements.define("x-table", Table);
