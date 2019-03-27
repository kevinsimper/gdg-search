import { LitElement, css, html } from "lit-element";
import "./Search.js"

class GDGMain extends LitElement {
  render() {
    return html`<search-gdg/>`
  }
}

customElements.define('x-gdgmain', GDGMain)
