class BornePublique extends Borne {
    constructor(id, lat, lon) {
        super(id, lat, lon);
    }

    toHTML() {
        return `<div class="borne-publique">
            <h3>Borne Publique</h3>
            <p><strong>ID:</strong> ${this.id}</p>
            <p><strong>Latitude:</strong> ${this.lat}</p>
            <p><strong>Longitude:</strong> ${this.lon}</p>
        </div>`;
    }
}