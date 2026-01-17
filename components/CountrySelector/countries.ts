// app/components/CountrySelector/countries.ts
export type Country = {
  code: string;
  name: string;
};

export const featuredCountries: Country[] = [
  { code: 'mx', name: 'México' },
  { code: 'co', name: 'Colombia' },
  { code: 'es', name: 'España' },
  { code: 'ar', name: 'Argentina' },
  { code: 'cl', name: 'Chile' },
  { code: 'pe', name: 'Perú' },
];

export const allCountries: Country[] = [
  { code: 'mx', name: 'México' },
  { code: 'co', name: 'Colombia' },
  { code: 'es', name: 'España' },
  { code: 'ar', name: 'Argentina' },
  { code: 'cl', name: 'Chile' },
  { code: 'pe', name: 'Perú' },
  { code: 've', name: 'Venezuela' },
  { code: 'ec', name: 'Ecuador' },
  { code: 'uy', name: 'Uruguay' },
  { code: 'py', name: 'Paraguay' },
  { code: 'bo', name: 'Bolivia' },
  { code: 'cr', name: 'Costa Rica' },
  { code: 'pa', name: 'Panamá' },
  { code: 'gt', name: 'Guatemala' },
  { code: 'hn', name: 'Honduras' },
  { code: 'ni', name: 'Nicaragua' },
  { code: 'sv', name: 'El Salvador' },
  { code: 'do', name: 'República Dominicana' },
  { code: 'pr', name: 'Puerto Rico' },
  { code: 'cu', name: 'Cuba' },
  { code: 'br', name: 'Brasil' },
  { code: 'pt', name: 'Portugal' },
  { code: 'it', name: 'Italia' },
  { code: 'fr', name: 'Francia' },
  { code: 'de', name: 'Alemania' },
  { code: 'gb', name: 'Reino Unido' },
  // ... añade los que necesites
].sort((a, b) => a.name.localeCompare(b.name));