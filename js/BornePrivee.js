import { Borne } from './Borne.js';

export class BornePrivee extends Borne {
    constructor(id, lat, lon) {
        super(id, lat, lon);
        this._proprietaire = this.genererProprietaire();
    }

    genererProprietaire() {
        const proprietaires = [
            "EDF", "Engie", "TotalEnergies", "Izivia", "Ionity",
            "Fastned", "Allego", "Tesla", "ChargePoint", "Electra",
            "Freshmile", "NewMotion", "Plugsurfing", "Shell Recharge",
            "BP Pulse", "Vattenfall", "E.ON", "Carrefour", "Leclerc"
        ];

        return proprietaires[Math.floor(Math.random() * proprietaires.length)];
    }

    get proprietaire() {
        return this._proprietaire;
    }

    getLabel() {
        return `Borne Privée - Propriétaire : ${this.proprietaire}`;
    }

    toHTML() {
        return `
        <div class="borne-privee">
            <h3>Borne Privée</h3>
            <p>ID: ${this.id}</p>
            <p>Latitude: ${this.lat}</p>
            <p>Longitude: ${this.lon}</p>
            <p>Propriétaire: ${this.proprietaire}</p>
            <button class="btn-reserver" data-id="${this.id}" data-type="privee">Réserver</button>
        </div>`;
    }
}
