const sharp = require('sharp');
const path = require('path');

// Cesta k zdrojovému obrázku
const inputPath = path.join(__dirname, 'public', 'Titulná fotka (1).jpg');
// Cesta pre výstupný optimalizovaný WebP pre mobily
const outputPath = path.join(__dirname, 'public', 'hero-mobile.webp');

// Optimalizácia a konverzia na WebP s nízkym rozlíšením pre mobilné zariadenia
sharp(inputPath)
  .resize(768) // Zmenšenie na mobilnú šírku
  .webp({ quality: 70, effort: 6 }) // Nižšia kvalita pre rýchlejšie načítanie na mobiloch
  .toFile(outputPath)
  .then(() => {
    console.log('Mobilný obrázok bol úspešne konvertovaný a optimalizovaný!');
  })
  .catch(err => {
    console.error('Chyba pri konverzii mobilného obrázka:', err);
  });
