const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('Formularios_5472_1120_PED-1774059219515.pdf');

console.log('pdf type:', typeof pdf);

try {
  pdf(dataBuffer).then(function(data) {
      console.log('PDF Text:');
      console.log(data.text);
  }).catch(function(err) {
      console.log('Error inside then:', err);
  });
} catch (e) {
  console.log('Fallback!');
  // if pdf is an object holding default 
  if (pdf.default) {
      pdf.default(dataBuffer).then(d => console.log(d.text)).catch(console.error);
  }
}
