# Plan de Implementación: Campos Completos Form 5472

## Objetivo
Añadir TODOS los campos faltantes del Form 5472 al formulario de onboarding, organizados por secciones (Parts).

## Campos a Añadir por Sección

### PART I: Reporting Corporation (Paso 1 - Datos de la LLC)
**Campos ya existentes:**
- ✅ 1a: llcName, llcAddress, llcCity, llcState, llcZip, llcEin
- ✅ 1h: formationDate

**Campos NUEVOS a añadir:**
- 1b: llcEinAlternate (opcional) - "EIN alternativo (si aplica)"
- 1d: llcCountryOfIncorporation - Selector (default: "United States")
- 1e: llcTaxResidenceCountries - Input text (default: "United States")
- 1f: llcActivityCode - Input text (default: "454110")
- 1g: llcActivityDescription - Input text (default: "E-Commerce Retail")
- 1j: isForeignOwnedDE - Checkbox (default: true, disabled)
- 1k: soleOwnerName - Input text (auto-rellenar con ownerName)
- 1L: soleOwnerEin/soleOwnerReferenceId - Input text (auto-rellenar con ownerTaxId)
- 1m: isDirectOwner - Radio (default: true)
- 1n: isOwnerUSPerson - Radio (default: false)
- 1o: isOwnerForeignPerson - Radio (default: true)
- 2: totalAssets - Input number (default: 0)
- 3: hasRelatedPartyTransactions - Radio Yes/No (default: true)

### PART II: 25% Foreign Shareholder (Paso 2 - Datos del Dueño)
**Campos ya existentes:**
- ✅ 4a: ownerName, ownerAddress, ownerCity, ownerCountry
- ✅ 4b(3): ownerTaxId, ownerReferenceIdType

**Campos NUEVOS a añadir:**
- 4c: ownerBusinessCountries - Input text
- 4d: ownerTaxResidenceCountries - Input text
- 4e: ownershipType - Selector: Direct/Indirect (default: Direct)

### PART III: Related Party (Paso 2 - Opcional)
**Campos NUEVOS (todos opcionales):**
- 8a: relatedPartyName, relatedPartyAddress, relatedPartyCity, relatedPartyCountry
- 8b(3): relatedPartyTaxId, relatedPartyReferenceIdType
- 8c: relatedPartyBusinessCountries
- 8d: relatedPartyTaxResidenceCountries
- 8e: relatedPartyRelationship - Input text (default: "25% Foreign Shareholder")
- 8f: relatedPartyOwnershipType - Selector: Direct/Indirect
- 8g: isRelatedPartyUSPerson - Checkbox

**NOTA:** Para single-member LLCs, Part III suele ser igual a Part II. Podemos añadir un botón "Copiar datos del dueño" o auto-rellenar.

### PART IV: Monetary Transactions (Paso 3 - Transacciones)
**Campos ya existentes:**
- ✅ capitalContributionCash
- ✅ capitalContributionProperty
- ✅ capitalDistributionCash
- ✅ capitalDistributionProperty

### PART V: Additional Information (Paso 3)
**Campos ya existentes:**
- ✅ formationCost
- ✅ hasTradeOrBusiness
- ✅ isDisregardedEntity

### PART VII: Additional Questions (Paso 4 - Revisión)
**Campos NUEVOS (todos boolean, default: false):**
- 37: paidInterestToRelatedParty - Radio Yes/No
- 39: paidRentsToRelatedParty - Radio Yes/No
- 40a: paidRoyaltiesToRelatedParty - Radio Yes/No
- 41a: hasCostSharingArrangements - Radio Yes/No
- 42a: paidServicesToRelatedParty - Radio Yes/No
- 42b: receivedServicesFromRelatedParty - Radio Yes/No
- 43a: hasOtherTransactions - Radio Yes/No

### PART VIII: Base Erosion Payments (Paso 4)
**Campos NUEVOS:**
- 45: isBaseErosionTaxpayer - Radio Yes/No (default: false)

## Estrategia de Implementación

### Fase 1: Actualizar Tipos y Estado Inicial ✅
- ✅ Expandir tipo `Form5472Data`
- ✅ Actualizar estado inicial con valores por defecto

### Fase 2: Actualizar UI del Formulario
1. **Paso 1 (Datos de la LLC):** Añadir campos de Part I
2. **Paso 2 (Datos del Dueño):** Añadir campos de Part II y Part III
3. **Paso 3 (Transacciones):** Ya está completo
4. **Paso 4 (Revisión):** Añadir Part VII y Part VIII antes de la firma

### Fase 3: Actualizar Servicio de PDFs
- Mapear todos los nuevos campos a los campos correspondientes del PDF 5472
- Actualizar `TaxFormService.generate5472Package()`

### Fase 4: Actualizar Transformación de Datos
- Actualizar `transformToTaxFormData()` en el API route
- Actualizar interfaz `TaxFormData` en el servicio

## Notas Importantes
- Muchos campos tienen valores por defecto que son apropiados para el 99% de los casos
- Algunos campos se pueden auto-rellenar (ej: soleOwnerName = ownerName)
- Part III suele ser igual a Part II para single-member LLCs
- Los campos de Part VII son casi siempre "No" para LLCs pasivas
