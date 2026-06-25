# Sprosse – Projektdokumentation für Claude Code

## Was ist Sprosse?

Sprosse ist eine **datenschutzfreundliche, offline-fähige Progressive Web App (PWA)** für Kindergartenpädagog:innen in Österreich. Sie ermöglicht die digitale Erfassung von Kinderentwicklungs-Beobachtungen direkt am Handy – ohne Cloud, ohne Installation, ohne Kompromisse beim Datenschutz.

**Entwickler:** Georg Eder · hallo@ederge.org  
**Status:** Beta v0.10.0  
**Live-URL:** https://edergeorg.github.io/sprosse  
**Repository:** https://github.com/edergeorg/sprosse  

---

## Dateien

```
sprosse/
├── index.html      ← gesamte App (eine einzige HTML-Datei)
├── sw.js           ← Service Worker (muss separat liegen für iOS Safari)
├── .nojekyll       ← verhindert Jekyll-Processing auf GitHub Pages
├── README.md
└── CLAUDE.md       ← diese Datei
```

---

## 🔄 Bei JEDEM Deploy – PFLICHT

Beide Werte müssen immer synchron erhöht werden:

```javascript
const APP_VERSION = '0.10.0';           // → Badge in Mehr-Panel + hartcodiertes Badge (~Zeile 556!)
const CACHE_VERSION = 'sprosse-v0.10.0'; // → immer = 'sprosse-v' + APP_VERSION
```

Und in `sw.js`:
```javascript
const CACHE = 'sprosse-v0.10.0'; // → muss mit CACHE_VERSION übereinstimmen
```

**Achtung:** Das Versions-Badge im Mehr-Panel ist zusätzlich **hartcodiert im HTML**
(`<span ...>v0.10.0</span>`, ~Zeile 556) – beim Bump dort ebenfalls ändern.

**Versionierungsschema:** `0.9.x` Bugfixes · `0.10.0` neues Feature · `1.0.0` stabiler Release

---

## ⚠️ Migrations-Sicherheit – IMMER beachten

Sprosse hat produktive Nutzerdaten. Jede Datenstruktur-Änderung braucht Migration.

### Grundregeln
1. **Neue Felder immer mit Fallback:** `S.neuesFeature = S.neuesFeature || defaultWert`
2. **Keine Keys umbenennen/löschen** – alte Daten gehen sonst verloren
3. **Bei strukturellen Änderungen:** Versions-Key setzen (`__version: '3'`)
4. **Migration-Funktion schreiben** die nach `load()` aufgerufen wird
5. **Raster-Keys:** 3 Zustände – `r[key]` ist `'ja'` (erfüllt) · `'nein'` (nicht erfüllt) · fehlt/`''` (noch nicht beobachtet). Altes `r[key] === true` zählt abwärtskompatibel als `'ja'`. Immer über `rasterState(r,key)` lesen, nie direkt vergleichen.

### Durchgeführte Migrationen
| Version | Was | Warum |
|---|---|---|
| Raster v2 | RASTER_JUNG/RASTER_ALT | Neue altersabhängige Kriterien |
| Raster v3 | NÖ Entwicklungsbogen, Key-Format `b_ab_globalIdx` | Monatsgenaue Kriterien |
| v0.10.0 | Raster-Werte `true` → `'ja'`/`'nein'` (3 Zustände) | Ja/Nein/unbeobachtet unterscheidbar; `true` bleibt als `'ja'` gültig |

### Pre-Deploy Checkliste
- [ ] Funktioniert die App mit alten localStorage-Daten?
- [ ] Gibt es Felder die umbenannt/entfernt wurden?
- [ ] Neue Pflichtfelder haben Fallback?
- [ ] Migration-Funktion vorhanden wenn nötig?
- [ ] CACHE_VERSION und sw.js erhöht?

---

## Technische Architektur

### Single HTML File
Die gesamte App ist **eine einzige HTML-Datei** (`index.html`). Kein Build-System, keine Dependencies, Vanilla JS, localStorage.

### Kritische CSS-Regeln (GitHub Pages + iOS Kompatibilität)
- **KEINE CSS-Variablen** (`var(--x)`) – alle durch Hex-Werte ersetzt
- **KEIN `<style>` Tag im `<body>`** – bricht CSS-Parsing
- **KEIN `</script>` oder `</style>` in JS-Template-Strings** – bricht HTML-Parser
  - Workaround: `'<'+'style>'` oder String-Concatenation

### iOS Safari Scroll-Fix
```css
#content {
  position: fixed;
  top: calc(62px + env(safe-area-inset-top, 0px));
  bottom: calc(56px + env(safe-area-inset-bottom, 0px));
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}
```
Header-Höhe wird via JS `offsetHeight` dynamisch gemessen.

### Service Worker
- Liegt als separate `sw.js` Datei (Blob-URL funktioniert nicht auf iOS Safari)
- Network-first Strategie, on-demand caching
- Update-Banner erscheint automatisch wenn neue Version erkannt
- Manueller Update-Button in Mehr-Panel

---

## State-Struktur

```javascript
S = {
  children: [
    {
      id: 1,
      name: 'Emma',          // Vorname
      lastname: 'Huber',     // Nachname (neu ab v0.9.3)
      bday: '2019-05-15',    // Geburtsdatum ISO (neu ab v0.9.3, Pflicht)
      age: '5,2 Jahre',      // wird aus bday berechnet (calcAge)
      bg: '#daeeff',         // Avatar-Hintergrundfarbe
      tc: '#0c447c',         // Avatar-Textfarbe
      raster: {
        __version: '3',      // Raster-Version
        'motorik_36_2': true, // Key-Format: bereich_monat_globalIdx
      },
      obs: [
        {
          date: '23.04.2026',    // DD.MM.YYYY
          editedAt: '24.04.2026', // optional, wenn bearbeitet
          text: 'Beobachtungstext',
          mood: 'kann-schon',    // 'sorge'|'kann-schon'|'lerne-noch'|''
          tags: ['motorik'],     // Entwicklungsbereiche
          voice: false,
          photos: [],            // base64 Strings
          steps: ''              // pädagogische Schritte (optional)
        }
      ]
    }
  ],
  nextId: 7,
  remindDays: 5,
  apiKey: '',
  pinEnabled: false
}
```

---

## NÖ Entwicklungsraster

**Quelle:** Entwicklungsbogen für Kinder von 0–6 Jahre, Amt der NÖ Landesregierung, Abt. Kindergärten

```javascript
const BL = {
  motorik:  'Grob- & Feinmotorik',
  sozial:   'Soziale & Emotionale Entwicklung',
  kognitiv: 'Kognitive Entwicklung',
  sprache:  'Sprache & Kommunikation'
};
const BEREICHE = Object.keys(BL); // ['motorik','sozial','kognitiv','sprache']
```

**Wichtig:** `BEREICHE` (= Raster-Bereiche) ist NUR die 4 BL-Keys. Beobachtungs-**Tags**
sind davon getrennt und in `TAGS` definiert (motorik, sozial, kognitiv, sprache,
kreativ, emotional, spielverhalten, allgemein). Neue Tags NICHT zu BL hinzufügen,
sonst entstehen leere Raster-Sektionen.

**109 Kriterien** mit Alters-Referenz in Monaten (ab 24 bis 72 Monate).

**Key-Format:** `bereich_ab_globalIdx` (z.B. `motorik_36_2`)
- `bereich` = einer der 4 BEREICHE
- `ab` = ab welchem Monat das Kriterium gilt
- `globalIdx` = Index im vollständigen `RASTER_NÖ[bereich]` Array

**Achtung:** `globalIdx` ist der Index im **vollen** Array, NICHT im gefilterten!
```javascript
var globalIdx = RASTER_NÖ[b].indexOf(item); // RICHTIG
// NICHT: items.forEach(function(item, i) { var key = b+'_'+ab+'_'+i; }) // FALSCH
```

**Alters-Fenster:**
```javascript
function getAgeRaster(child) {
  var ageMonths = getAgeInMonths(child);
  var minAb = Math.max(24, ageMonths - 6);
  var maxAb = ageMonths + 9;
  // filtert RASTER_NÖ[b] nach minAb <= item.ab <= maxAb
}
```

**Zwei Ansichten im Modal:**
- `Aktuelle Stufe`: gefiltertes Fenster ±6/+9 Monate
- `Gesamte Laufbahn`: alle Kriterien 24–maxAb, nach Monaten gruppiert

---

## Einschätzung (statt Stimmung)

Drei Optionen, togglebar (nochmals tippen = abwählen):
```javascript
mood: 'sorge'      // ⚠️ rot
mood: 'kann-schon' // ✅ grün  
mood: 'lerne-noch' // 🌱 amber
```

---

## Spracherkennung (iOS Safari)

```javascript
function doRec() {
  // Immer neue Instanz, nie abort() - nur stop()
  // continuous: false (iOS)
  // interimResults: true (live preview im Textarea)
  // onresult: interim → live in ta.value, final → baseText fixieren
  // onend: setTimeout(doRec, 150) für Neustart
  // onerror: bei not-allowed stoppen, sonst neu starten
}
```

**Wichtig:** `abort()` triggert `onerror` → Race condition → nur `stop()` verwenden!

---

## Datenschutz & Sicherheit

- **Lokale Speicherung** – kein Server, keine Cloud
- **PIN-Schutz** – optional, 4-stellig, gehasht (`hashPin`)
- **Anonymisierung** bei KI-Berichten: Namen → `Kind_A`, `Kind_B`, ... vor dem API-Call
- **Deanonymisierung** nach API-Antwort

---

## Anthropic API

```javascript
// Modell: claude-sonnet-4-20250514
// Header: 'anthropic-dangerous-direct-browser-access': 'true'
// Anonymisierung VOR dem Senden, Deanonymisierung NACH dem Empfang
// Ohne API-Key: Prompt in Zwischenablage kopieren
```

---

## Funktionen – wichtige Übersicht

| Funktion | Was |
|---|---|
| `fullName(c)` | `c.lastname + ' ' + c.name` |
| `calcAge(bday)` | `'5,2 Jahre'` aus ISO-Datum |
| `getAgeInMonths(c)` | Alter in Monaten aus `c.bday` |
| `getAgeRaster(c)` | Gefiltertes Raster für aktuelles Alter |
| `getRaster(c)` | Alias für `getAgeRaster(c)` |
| `rasterPct(c)` | % aktuelle Stufe (gefiltertes Fenster) |
| `rasterPctAll(c)` | % gesamte Laufbahn (24 bis maxAb) |
| `anonymize(text, children)` | Namen → Kind_A, Kind_B |
| `deanonymize(text, children)` | Kind_A → Namen |
| `hashPin(p)` | Einfacher Hash für PIN |
| `nav(p)` | Zwischen Panels wechseln |
| `openModal(id)` | Modal öffnen |
| `closeModal(id)` | Modal schließen |
| `toast(msg)` | Kurze Benachrichtigung |
| `save()` | State in localStorage |
| `load()` | State aus localStorage laden |
| `exportData()` | JSON-Export + Timestamp |
| `checkBackupReminder()` | Wöchentliche Backup-Erinnerung |

---

## Bekannte Einschränkungen

1. **localStorage ~5MB** – bei vielen Fotos kann es voll werden
2. **Spracherkennung** – nur Safari, Chrome, Edge (nicht Firefox)
3. **Kein Multi-User** – jedes Gerät hat eigene Daten
4. **iOS `position:fixed`** – Header und Nav müssen `fixed` sein, sonst scrollen sie mit
5. **CSS-Variablen** – funktionieren nicht auf GitHub Pages → immer Hex-Werte

---

## Offene TODOs

- [ ] Matomo Analytics (analytics.ederge.org, Site-ID noch einrichten)
- [ ] Zugangscode-System (mehrere Codes pro Einrichtung)
- [ ] PDF-Export pro Kind (strukturiert und formatiert)
- [ ] Sprach-Bereinigung (ähm, Grammatikfehler) via KI – optional per Button
- [ ] Dunkelmodus
- [ ] Kind umbenennen (nur Name, Rest schon editierbar)

---

## Commit-Konventionen

```
feat: neue Funktion
fix: Bugfix
style: UI ohne Logik
refactor: Code-Umstrukturierung
docs: Dokumentation
```
