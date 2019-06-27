import { LitElement, html } from "lit-element";
import { fetchCommunitiesArray } from "./models/index.js";

class GDGMap extends LitElement {
  constructor() {
    super();
    this.map = null;
    this.loadMapSDK();
    window.initMap = this.initMap.bind(this);
  }
  loadMapSDK() {
    const key = "AIzaSyDJMht1fBsxsa4REg-MR8_BAvmmsQRkNdM";
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`;
    document.body.append(s);
  }
  async initMap() {
    let center = { lat: 0, lng: 0 };
    let zoom = 3;
    try {
      const ip = await fetch("https://ipinfo.io/json?token=268f99373d784d");
      const data = await ip.json();
      center = {
        lat: parseInt(data.loc.split(",")[0]),
        lng: parseInt(data.loc.split(",")[1])
      };
      zoom = 6;
    } catch (e) {
      console.log("Adblocked ipinfo");
    }
    this.map = new google.maps.Map(this.shadowRoot.querySelector("#map"), {
      center,
      zoom
    });
    this.addMarkers();
  }
  async addMarkers() {
    const communities = await fetchCommunitiesArray();
    this.markers = communities.map(c => this.addMarker(c));
  }
  addMarker(community) {
    const marker = new google.maps.Marker({
      position: { lat: community.lat, lng: community.lon },
      map: this.map,
      title: community.name
    });
    marker.addListener("click", () => {
      window.open("https://meetup.com/" + community.urlname, "_blank");
    });
    return marker;
  }
  render() {
    return html`
      <h1 style="display: inline-block;">Map</h1>
      <div style="display: inline-block;">
        Note: It will look up your IP and show meetups near you, if it doesn't
        work, disable adblocker.
      </div>
      <div id="map" style="height: 100%;"></div>
    `;
  }
}

customElements.define("x-map", GDGMap);
