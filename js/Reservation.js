export class Reservation {
    constructor(idBorne, typeBorne, date, heureDebut, duree) {
        this.idBorne = idBorne;
        this.typeBorne = typeBorne;
        this.date = date;
        this.heureDebut = heureDebut;
        this.duree = duree;
        this.id = `${idBorne}-${date}-${heureDebut}`;
    }
    static validerReservation(date, heureDebut, duree) {
        const errors = [];
        const dateReservation = new Date(date);
        const aujourdhui = new Date();
        aujourdhui.setHours(0, 0, 0, 0);
        if (dateReservation < aujourdhui) {
            errors.push("La date doit être future");
        }
        const [heures, minutes] = heureDebut.split(':').map(Number);
        if (heures < 6 || heures > 22) {
            errors.push("L'heure doit être entre 6h et 22h");
        }
        if (duree < 1 || duree > 6) {
            errors.push("La durée doit être entre 1 et 6 heures");
        }
        return errors;
    }
    static sauvegarder(reservation) {
        const reservations = this.lireReservations();
        reservations.push(reservation);
        localStorage.setItem('reservations', JSON.stringify(reservations));
    }
    static lireReservations() {
        const data = localStorage.getItem('reservations');
        return data ? JSON.parse(data) : [];
    }
    static supprimerReservation(reservationId) {
        const reservations = this.lireReservations();
        const filtered = reservations.filter(r => r.id !== reservationId);
        localStorage.setItem('reservations', JSON.stringify(filtered));
    }
    static getProchaineReservation() {
        const reservations = this.lireReservations();
        const maintenant = new Date();
        const reservationsFutures = reservations
            .map(r => {
                const dateTime = new Date(`${r.date}T${r.heureDebut}`);
                return { ...r, dateTime };
            })
            .filter(r => r.dateTime > maintenant)
            .sort((a, b) => a.dateTime - b.dateTime);
        return reservationsFutures[0] || null;
    }
    static genererHistoriqueHTML() {
        const reservations = this.lireReservations();
        if (reservations.length === 0) {
            return '<p>Aucune réservation trouvée</p>';
        }
        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID Borne</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Heure</th>
                        <th>Durée</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
        `;
        for (const reservation of reservations) {
            html += `
                <tr>
                    <td>${reservation.idBorne}</td>
                    <td>${reservation.typeBorne}</td>
                    <td>${reservation.date}</td>
                    <td>${reservation.heureDebut}</td>
                    <td>${reservation.duree}h</td>
                    <td>
                        <button class="btn-supprimer btn-small" data-id="${reservation.id}">Supprimer</button>
                    </td>
                </tr>
            `;
        }
        html += `
                </tbody>
            </table>
        `;
        return html;
    }
}