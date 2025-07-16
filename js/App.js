import { MapManager } from './MapManager.js';
import { Reservation } from './Reservation.js';
import { createBorne } from './BorneFactory.js';
import { API } from './Api.js';

export class App {
    constructor() {
        this.mapManager = new MapManager();
        this.bornes = [];
        this.timeoutCompteRebours = null;
        this.init();
    }

    async init() {
        await this.mapManager.initCarte();
        const center = this.mapManager.carte.getCenter();
        await this.chargerBornes(center.lat, center.lng);
        this.mapManager.carte.on('moveend', () => {
            if (this.debounceTimeout) {
                clearTimeout(this.debounceTimeout);
            }

            this.debounceTimeout = setTimeout(async () => {
                const center = this.mapManager.carte.getCenter();
                await this.chargerBornes(center.lat, center.lng);
            }, 500);
        });

        this.initUI();
        this.mettreAJourHistorique();
        this.mettreAJourCompteRebours();
    }

    initUI() {
        document.getElementById('form-recherche').addEventListener('submit', async e => {
            e.preventDefault();
            const adresse = e.target['input-adresse'].value.trim();
            if (adresse) {
                await this.rechercherBornes(adresse);
            }
        });

        const btnBasculer = document.getElementById('btn-basculer-vue');
        btnBasculer.addEventListener('click', () => {
            const liste = document.getElementById('liste-bornes');
            if (liste.style.display === 'block') {
                liste.style.display = 'none';
                btnBasculer.textContent = 'Afficher la liste';
            } else {
                liste.style.display = 'block';
                btnBasculer.textContent = 'Afficher la carte';
            }
        });

        document.getElementById('btn-fermer-modal').addEventListener('click', () => {
            this.fermerModalReservation();
        });

        document.getElementById('form-reservation').addEventListener('submit', e => {
            e.preventDefault();
            this.confirmerReservation();
        });

        document.getElementById('historique-reservations').addEventListener('click', e => {
            if (e.target.classList.contains('btn-supprimer')) {
                const id = e.target.dataset.id;
                Reservation.supprimerReservation(id);
                this.mettreAJourHistorique();
                this.mettreAJourCompteRebours();
            }
        });
    }

    async rechercherBornes(adresse) {
        const resultat = await API.geocoder(adresse);

        if (!resultat.success) {
            alert(resultat.error || "Adresse non trouvée");
            return;
        }

        const lat = resultat.lat;
        const lon = resultat.lon;

        this.mapManager.setView(lat, lon);
        await this.chargerBornes(lat, lon);
    }


    async chargerBornes(lat, lon, rayon = 5000) {
        const result = await API.getBornes(lat, lon, rayon);

        if (result.success) {
            this.bornes = result.bornes.map((b, i) => {
                const latitude = b.lat ?? b.center?.lat;
                const longitude = b.lon ?? b.center?.lon;
                const id = b.id || i;
                return createBorne(id, latitude, longitude);
            });
            this.afficherBornes();
        } else {
            alert("Erreur lors de la récupération des bornes");
        }
    }

    afficherBornes() {
        this.mapManager.ajouterMarqueurs(this.bornes, borne => this.ouvrirModalReservation(borne));

        const liste = document.getElementById('liste-bornes');
        liste.innerHTML = this.bornes.map(borne => borne.toHTML()).join('');

        liste.querySelectorAll('.btn-reserver').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const borne = this.bornes.find(b => b.id == id);
                if (borne) this.ouvrirModalReservation(borne);
            });
        });
    }

    ouvrirModalReservation(borne) {
        const modal = document.getElementById('modal-reservation');
        modal.style.display = 'block';

        document.getElementById('borne-id').value = borne.id;

        const type = borne.constructor.name === 'BornePrivee' ? 'privee' : 'publique';
        document.getElementById('borne-type').value = type;

        const form = document.getElementById('form-reservation');
        form['date-reservation'].value = '';
        form['heure-debut'].value = '';
        form['duree'].value = 1;
    }

    fermerModalReservation() {
        const modal = document.getElementById('modal-reservation');
        modal.style.display = 'none';
    }

    confirmerReservation() {
        const form = document.getElementById('form-reservation');
        const idBorne = form['borne-id'].value;
        const typeBorne = form['borne-type'].value;
        const date = form['date-reservation'].value;
        const heure = form['heure-debut'].value;
        const duree = parseInt(form['duree'].value, 10);

        const erreurs = Reservation.validerReservation(date, heure, duree);
        if (erreurs.length > 0) {
            alert(erreurs.join('\n'));
            return;
        }

        const reservation = new Reservation(idBorne, typeBorne, date, heure, duree);
        Reservation.sauvegarder(reservation);

        alert('Réservation enregistrée !');
        this.fermerModalReservation();
        this.mettreAJourHistorique();
        this.mettreAJourCompteRebours();
    }

    mettreAJourHistorique() {
        const html = Reservation.genererHistoriqueHTML();
        document.getElementById('historique-reservations').innerHTML = html;
    }

    mettreAJourCompteRebours() {
        const prochaine = Reservation.getProchaineReservation();
        const compteur = document.getElementById('compte-rebours');

        if (!prochaine) {
            compteur.textContent = "Pas de prochaine réservation";
            return;
        }

        const dateHeure = new Date(`${prochaine.date}T${prochaine.heureDebut}`);
        const maintenant = new Date();
        let diffMs = dateHeure - maintenant;

        if (diffMs <= 0) {
            compteur.textContent = "Prochaine réservation en cours";
            return;
        }

        const heures = Math.floor(diffMs / (1000 * 60 * 60));
        diffMs -= heures * (1000 * 60 * 60);
        const minutes = Math.floor(diffMs / (1000 * 60));
        diffMs -= minutes * (1000 * 60);
        const secondes = Math.floor(diffMs / 1000);

        compteur.textContent = `Prochaine réservation dans ${heures}h ${minutes}m ${secondes}s`;

        clearTimeout(this.timeoutCompteRebours);
        this.timeoutCompteRebours = setTimeout(() => this.mettreAJourCompteRebours(), 1000);
    }
}
