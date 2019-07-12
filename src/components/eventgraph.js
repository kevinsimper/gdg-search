import { LitElement, html } from "lit-element";

class EventGraph extends LitElement {
  static get properties() {
    return {
      events: Array
    };
  }
  firstUpdated() {
    this.drawGraph();
  }
  shouldUpdate(changedProperties) {
    if (changedProperties.get("events") !== undefined) {
      this.drawGraph.bind(this)();
    }
    return true;
  }
  drawGraph() {
    const graphData = this.events
      .map(i => {
        return [
          new Date(i.time).getMonth() + 1,
          new Date(i.time).getFullYear()
        ];
      })
      .reduce((sum, cur) => {
        if (sum.has(cur.join())) {
          return sum.set(cur.join(), sum.get(cur.join()) + 1);
        } else {
          return sum.set(cur.join(), 1);
        }
      }, new Map());

    const xlabels = [...graphData]
      .map(i => i[0])
      .reverse()
      .map(i => {
        let date = i.split(",");
        return `${date[1]}-${date[0].padStart(2, "0")}-01 00:00:00`;
      });
    const ydata = [...graphData].map(i => i[1]).reverse();
    const tickmode = ydata.find(i => i > 20) === undefined ? "linear" : "auto";
    var data = [
      {
        x: xlabels,
        y: ydata,
        type: "bar"
      }
    ];
    const layout = {
      yaxis: {
        tickmode,
        rangemode: "tozero"
      }
    };
    Plotly.newPlot(this.renderRoot.querySelector(".graph"), data, layout, {
      displayModeBar: false
    });
  }
  render() {
    return html`
      <div>
        <div class="graph"></div>
      </div>
    `;
  }
}

customElements.define("x-event-graph", EventGraph);
