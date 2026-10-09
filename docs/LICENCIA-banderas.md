# Licencia de las banderas (`public/banderas/`)

Las 27 banderas SVG de `public/banderas/` son del proyecto **flag-icons**
(https://github.com/lipis/flag-icons), de Panayiotis Lipiridis, y se distribuyen bajo
**licencia MIT**.

Se copian al repositorio para **no depender de un CDN externo en tiempo de ejecución**: el
paquete `react-country-flag` no incrusta el dibujo de la bandera, pinta un `<img>` que se
descarga de `cdn.jsdelivr.net` (ver `components/Flag.tsx`). Ahora las sirve Next desde
`/banderas/<codigo>.svg`.

Se descargan y actualizan con:

    npm run banderas

(el script `scripts/descarga-banderas.mjs` lee los países de
`components/CountrySelector/countries.ts` y los `countryCode` del código, así que no puede
quedarse desincronizado).

---

## The MIT License (MIT)

Copyright (c) 2013 Panayiotis Lipiridis

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
