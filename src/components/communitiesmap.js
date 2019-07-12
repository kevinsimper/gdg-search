import { LitElement, html } from "lit-element";

class CommunitiesMap extends LitElement {
  static get properties() {
    return {
      communities: Array,
      type: String
    };
  }
  constructor() {
    super();
    this.markers = [];
    this.heatmap;
    this.map;
    this.loadMapSDK();
  }
  firstUpdated() {
    this.checkIfLoaded(() => this.drawMap());
  }
  checkIfLoaded(callback) {
    if (window.google) {
      return callback();
    }
    setTimeout(() => {
      this.checkIfLoaded(callback);
    }, 100);
  }
  shouldUpdate(changedProperties) {
    if (changedProperties.get("communities") !== undefined) {
      this.checkIfLoaded(() => this.drawMap());
    }
    if (changedProperties.get("type")) {
      this.checkIfLoaded(() => this.drawMap());
    }
    return true;
  }
  drawMap() {
    if (!this.map) {
      this.map = new google.maps.Map(this.shadowRoot.querySelector(".map"), {
        center: { lat: 0, lng: 0 },
        zoom: 3
      });
    }
    this.drawMarkers(this.communities);
  }
  drawMarkers(communitiesToDraw) {
    if (this.heatmap) {
      this.heatmap.setMap(null);
    }
    if (this.markers.length > 0) {
      this.markers.forEach(marker => marker.setMap(null));
    }

    if (this.type === "heatmap") {
      this.heatmap = new google.maps.visualization.HeatmapLayer({
        data: communitiesToDraw.map(({ community, finds }) => {
          return {
            location: new google.maps.LatLng(community.lat, community.lon),
            weight: finds.length
          };
        }),
        radius: 40
      });
      this.heatmap.setMap(this.map);
    } else {
      this.markers = communitiesToDraw.map(c => this.addMarker(c));
    }
  }
  addMarker({ community, finds }) {
    const marker = new google.maps.Marker({
      position: { lat: community.lat, lng: community.lon },
      map: this.map,
      title: `${community.name} - ${finds.length} events`
    });
    marker.addListener("click", () => {
      window.open(
        "https://gdg-search.firebaseapp.com/#!search?region=" + community.city,
        "_blank"
      );
    });
    return marker;
  }
  loadMapSDK() {
    if (window.google) return true;
    const key = "AIzaSyDJMht1fBsxsa4REg-MR8_BAvmmsQRkNdM";
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=visualization`;
    document.body.append(s);
  }
  render() {
    return html`
      <div>
        map
        <div class="map" style="height: 300px"></div>
      </div>
    `;
  }
}

customElements.define("x-communities-map", CommunitiesMap);
