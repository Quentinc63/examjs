export const API = {
    async geocoder(adresse) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(adresse)}`);
            const data = await response.json();

            if (data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lon: parseFloat(data[0].lon),
                    success: true
                };
            } else {
                return {
                    success: false,
                    error: "Adresse non trouvée"
                };
            }
        } catch (error) {
            console.error('Erreur géocodage:', error);
            return {
                lat: 45.75806298279684,
                lon: 3.1270760116784317,
                success: true,
                fallback: true
            };
        }
    },

    async getBornes(lat, lon, rayon = 5000) {
        const query = `
    [out:json][timeout:25];
    (
        node["amenity"="charging_station"](around:${rayon},${lat},${lon});
        way["amenity"="charging_station"](around:${rayon},${lat},${lon});
        relation["amenity"="charging_station"](around:${rayon},${lat},${lon});
    );
    out center meta;
    `;

        const url = 'https://overpass.kumi.systems/api/interpreter';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `data=${encodeURIComponent(query)}`
            });

            const contentType = response.headers.get('content-type') || '';

            if (!contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Réponse non-JSON de Overpass (probablement une erreur HTML) :', text);
                throw new Error('Réponse invalide de Overpass API. Probablement rate-limited ou en erreur.');
            }

            const data = await response.json();

            return {
                success: true,
                bornes: data.elements || []
            };

        } catch (error) {
            console.error('Erreur Overpass:', error.message);
            return {
                success: false,
                bornes: [],
                error: error.message || 'Erreur inconnue'
            };
        }
    }

};