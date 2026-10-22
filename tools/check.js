const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const indexPath = path.join(root, 'index.html');

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(indexPath)) fail('falta index.html');

const html = fs.readFileSync(indexPath, 'utf8');

if (!/^<!doctype html>/i.test(html.trimStart())) fail('index.html no empieza por <!doctype html>');
if (!/<svg[^>]*\bid="fig"/i.test(html)) fail('index.html no contiene la figura SVG (#fig)');
if (/<script\b[^>]*\bsrc\s*=/i.test(html)) fail('index.html carga un script externo; debe ser autocontenido');
if (/<link\b[^>]*\bhref\s*=\s*["']https?:/i.test(html)) fail('index.html carga una hoja de estilos externa');
if (html.length < 50000) fail('index.html parece incompleto');

for (const image of ['docs/impresora-3d.png', 'docs/impresora-3d-rayos-x.png']) {
  const file = path.join(root, image);
  if (!fs.existsSync(file)) fail(`falta la captura ${image}`);
  if (fs.statSync(file).size < 10000) fail(`la captura ${image} parece vacía`);
}

console.log(`OK: index.html autocontenido (${html.length.toLocaleString('es-ES')} caracteres)`);
console.log('OK: capturas de documentación presentes');
