import { Borne } from './Borne.js';

export class BornePublique extends Borne {
    constructor(id, lat, lon) {
        super(id, lat, lon);
        this._responsable = this.genererResponsable();
    }

    genererResponsable() {
        const responsables = [
            "Alice Dupont", "Jean Martin", "Sophie Bernard", "Pierre Dubois",
            "Marie Lefèvre", "Luc Moreau", "Claire Lambert", "Thomas Garnier",
            "Julie Faure", "Nicolas Simon", "Emma Marchand", "Antoine Girard"
        ];
        return responsables[Math.floor(Math.random() * responsables.length)];
    }

    get responsable() {
        return this._responsable;
    }
    getLabel() {
        return `Borne Publique - Responsable : ${this.responsable}`;
    }


    toHTML() {
        return `
        <div class="borne-publique">
            <h3>Borne Publique</h3>
            <p><strong>ID:</strong> ${this.id}</p>
            <p><strong>Latitude:</strong> ${this.lat}</p>
            <p><strong>Longitude:</strong> ${this.lon}</p>
            <p><strong>Responsable:</strong> ${this.responsable}</p>
            <button class="btn-reserver" data-id="${this.id}" data-type="publique">Réserver</button>
        </div>`;
    }
}
