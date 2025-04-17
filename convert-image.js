const sharp = require('sharp');
const path = require('path');

// Cesta k zdrojovému obrázku
const inputPath = path.join(__dirname, 'public', 'Titulná fotka (1).jpg');
// Cesta pre výstupný optimalizovaný WebP
const outputPath = path.join(__dirname, 'public', 'hero-optimized.webp');

// Optimalizácia a konverzia na WebP
sharp(inputPath)
  .resize(1920) // Zmenšenie rozmerov na maximálne 1920px šírku pri zachovaní pomeru strán
  .webp({ quality: 80, effort: 6 }) // Nastavenie kvality a kompresie
  .toFile(outputPath)
  .then(() => {
    console.log('Obrázok bol úspešne konvertovaný a optimalizovaný!');
  })
  .catch(err => {
    console.error('Chyba pri konverzii obrázka:', err);
  });
