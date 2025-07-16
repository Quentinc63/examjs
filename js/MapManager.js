import { BornePrivee } from './BornePrivee.js';

export class MapManager {
    constructor() {
        this.carte = null;
        this.marqueurs = [];
    }

    async initCarte(lat = 45.75818, lon = 3.12662) {
        this.carte = L.map('carte').setView([lat, lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.carte);
    }

    ajouterMarqueurs(bornes, onClickBorne) {
        for (const marqueur of this.marqueurs) {
            this.carte.removeLayer(marqueur);
        }
        this.marqueurs = [];

        for (const borne of bornes) {
            const marker = L.marker([borne.lat, borne.lon]).addTo(this.carte);
            marker.bindPopup(`
                <b>${borne.getLabel()}</b><br>ID: ${borne.id}
                <br><button class="btn-reserver-popup" data-id="${borne.id}" data-type="${borne instanceof BornePrivee ? 'privee' : 'publique'}">Réserver</button>
            `);
            marker.on('popupopen', () => {
                const btn = document.querySelector('.btn-reserver-popup');
                if (btn) {
                    btn.addEventListener('click', () => onClickBorne(borne));
                }
            });
            this.marqueurs.push(marker);
        }
    }

    setView(lat, lon, zoom = 13) {
        this.carte.setView([lat, lon], zoom);
    }
}
