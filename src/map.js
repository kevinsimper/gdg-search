import { LitElement, html } from "lit-element";

class GDGMap extends LitElement {
  constructor() {
    super();
    const key = "AIzaSyDJMht1fBsxsa4REg-MR8_BAvmmsQRkNdM";
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`;
    document.body.append(s);
    window.initMap = function() {
      new google.maps.Map(this.shadowRoot.querySelector("#map"), {
        center: { lat: 55.6712473, lng: 12.5236135 },
        zoom: 8
      });
    }.bind(this);
  }
  render() {
    return html`
      <h1>Map</h1>
      <div id="map" style="height: 100%;"></div>
    `;
  }
}

customElements.define("x-map", GDGMap);
