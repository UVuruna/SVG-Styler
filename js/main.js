import * as klasa from './klasa.js';
// Objekat
const mojRacunar = new klasa.Racunar('HP');
const rezultat = mojRacunar.izracunaj(100000000);
console.log('Rezultat:', rezultat, mojRacunar.naziv);
