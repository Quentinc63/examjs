import { BornePrivee } from './BornePrivee.js';
import { BornePublique } from './BornePublique.js';

export function createBorne(id, lat, lon) {
    if (id % 2 === 0) {
        return new BornePublique(id, lat, lon);
    } else {
        return new BornePrivee(id, lat, lon);
    }
}
