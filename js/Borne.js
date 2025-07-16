export class Borne {
    constructor(id, lat, lon) {
        this.id = id;
        this.lat = lat;
        this.lon = lon;
    }

    toHTML() {
        return `<div class="borne">
            <p>ID: ${this.id}</p>
            <p>Latitude: ${this.lat}</p>
            <p>Longitude: ${this.lon}</p>
        </div>`;
    }
}
