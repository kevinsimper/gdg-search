import { LitElement, css, html } from "lit-element";
import { until } from "lit-html/directives/until.js";
import "../components/container.js";
import {
  fetchCommunities,
  fetchEvents,
  fetchOrganizers
} from "../models/index.js";
import "../components/table.js";
import "../components/organizer.js";

class EventsCountry extends LitElement {
  static get properties() {
    return {
      country: { type: String },
      countries: { type: Array },
      communities: { type: Array },
      countryCommunities: { type: Array },
      events: { type: Array },
      allOrganizers: { type: Array }
    };
  }
  constructor() {
    super();
    this.countryCommunities = [];
    this.events = [];
    this.fetching = Promise.all([fetchCommunities.bind(this)()])
      .then(() => this.filterCountry())
      .then(() => this.fetchEvents())
      .then(() => this.fetchOrganizers());
  }
  filterCountry() {
    return (this.countryCommunities = this.communities.filter(
      i => i.country.toLowerCase() === this.country
    ));
  }
  fetchEvents() {
    return Promise.all(
      this.countryCommunities.map(c => {
        return fetchEvents(c.urlname);
      })
    )
      .then(d => d.flat())
      .then(d => {
        return d.sort((a, b) => b.time - a.time);
      })
      .then(d => {
        this.events = d;
        return d;
      });
  }
  fetchOrganizers() {
    return Promise.all(
      this.countryCommunities.map(c => {
        return fetchOrganizers(c.urlname).then(organizers => {
          return [c.urlname, organizers];
        });
      })
    ).then(allOrganizers => {
      this.allOrganizers = allOrganizers;
    });
  }
  render() {
    return html`
      <x-container>
        <h1>Events in ${this.country}</h1>
        <p>This page will show events per country.</p>
        <h3>
          Communities in ${this.country} -
          ${this.countryCommunities.length || ""}
        </h3>
        <x-table
          .content="${
            html`
              ${
                this.countryCommunities.map(i => {
                  return html`
                    <tr>
                      <td><a href="/#!community/${i.urlname}">${i.name}</a></td>
                      <td>
                        <div style="display: flex">
                          ${
                            this.allOrganizers
                              .find(a => {
                                if (a[0] === i.urlname) {
                                  return a;
                                }
                              })[1]
                              .map(o => {
                                return html`
                                  <x-organizer
                                    image="${
                                      typeof o.photo !== "undefined"
                                        ? o.photo.photo_link
                                        : ""
                                    }"
                                    name="${o.name}"
                                  ></x-organizer>
                                `;
                              })
                          }
                        </div>
                      </td>
                    </tr>
                  `;
                })
              }
            `
          }"
        ></x-table>
        <h3>Events:</h3>
        ${
          until(
            this.fetching.then(
              () => {
                return html`
                  <x-table
                    .content="${
                      html`
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Group</th>
                            <th>RSVP</th>
                            <th>Event</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${
                            this.events.map(i => {
                              return html`
                                <tr>
                                  <td>${i.local_date}</td>
                                  <td>
                                    <a href="${i.link}">${i.group.name}</a>
                                  </td>
                                  <td>${i.yes_rsvp_count}</td>
                                  <td><a href="${i.link}">${i.name}</a></td>
                                </tr>
                              `;
                            })
                          }
                        </tbody>
                      `
                    }"
                  >
                  </x-table>
                `;
              },
              html`
                loading
              `
            )
          )
        }
      </x-container>
    `;
  }
}

customElements.define("x-events-country", EventsCountry);
