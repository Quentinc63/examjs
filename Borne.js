class Borne {
    constructor(id, lat, lon) {
        this.id = id;
        this.lat = lat;
        this.lon = lon;
    }

    static createBorne(id, lat, lon) {
        if (id % 2 === 0) {
            return new BornePublique(id, lat, lon);
        } else {
            return new BornePrivee(id, lat, lon);
        }
    }

    toHTML() {
        return `<div class="borne">
            <p>ID: ${this.id}</p>
            <p>Latitude: ${this.lat}</p>
            <p>Longitude: ${this.lon}</p>
        </div>`;
    }
}