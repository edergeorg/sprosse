# 🌱 Sprosse

**Kinderentwicklung liebevoll begleiten**

Sprosse ist eine datenschutzfreundliche, offline-fähige Beobachtungs-App für Kindergartenpädagog:innen. Beobachtungen erfassen, Entwicklung dokumentieren, Berichte erstellen – direkt am Handy, ohne Installation, ohne Cloud.

---

## ✨ Features

### 📝 Beobachtungen erfassen
- **Spracheingabe** – Beobachtungen einfach diktieren, Text wird automatisch erkannt
- **Fotoanhänge** – Bilder direkt zur Beobachtung hinzufügen
- **Stimmungserfassung** – Emotionale Lage des Kindes mit einem Tap festhalten
- **Entwicklungsbereiche** taggen: Sozial · Motorik · Sprache · Kognitiv · Kreativ · Emotional

### 📊 Entwicklungsraster
- 30 pädagogische Kriterien über alle 6 Entwicklungsbereiche
- Angelehnt an die Prinzipien der Bildungs- und Lerngeschichten
- Fortschrittsanzeige pro Kind in Prozent

### 🔔 Erinnerungssystem
- Automatische Warnung wenn ein Kind zu lange nicht beobachtet wurde
- Intervall frei einstellbar (3 / 5 / 7 / 14 Tage)
- Übersicht aller Kinder mit Beobachtungsstand

### 🤖 KI-Berichte (optional)
- **Elternbrief** – herzlicher, persönlicher Brief
- **Entwicklungsbericht** – strukturierter pädagogischer Bericht
- **Gesprächsvorbereitung** – Stichpunkte fürs Elterngespräch
- **Kurzzusammenfassung** – kompakter Überblick
- **Gruppen-Zusammenfassung** – für mehrere Kinder auf einmal
- Export als TXT, Teilen, Drucken

### 🔒 Datenschutz
- **Alle Daten bleiben lokal** auf dem Gerät – nichts wird in die Cloud übertragen
- **Automatische Anonymisierung**: Kindernamen werden vor KI-Anfragen durch Codes ersetzt (`Kind_A`, `Kind_B`, …) und danach wiederhergestellt
- **Optionaler PIN-Schutz**: 4-stelliger Code schützt die App beim Öffnen
- Daten-Export und -Import als JSON für Backups

---

## 📱 Installation am iPhone / iPad

1. Seite in **Safari** öffnen: `https://edergeorg.github.io/sprosse`
2. Unten auf **Teilen** tippen
3. **„Zum Home-Bildschirm"** wählen
4. Sprosse erscheint als App-Icon – fertig!

> Sprosse funktioniert vollständig offline. Nur die KI-Berichte benötigen eine Internetverbindung.

**Android (Chrome)**
Menü → „Zum Startbildschirm hinzufügen"

---

## 🤖 KI-Berichte einrichten (optional)

Ohne API-Key: Der Prompt wird in die Zwischenablage kopiert und kann in [Claude](https://claude.ai) oder ChatGPT eingefügt werden.

Mit API-Key: Berichte werden direkt in der App erstellt.

1. Unter **Mehr → KI / API Key** einen Anthropic API Key eintragen
2. Den Key bekommst du auf [console.anthropic.com](https://console.anthropic.com)
3. Der Key wird ausschließlich lokal gespeichert

---

## 🛡️ Datenschutzhinweis

Sprosse speichert alle Daten ausschließlich lokal im Browser (`localStorage`). Es gibt keine Server, keine Datenbank, keine Nutzerkonten.

**Was das bedeutet:**
- Kein Datenverlust beim App-Update – Daten bleiben im Browser erhalten
- Kein automatisches Backup – regelmäßig unter **Mehr → Exportieren** sichern
- Beim Löschen des Browser-Caches gehen Daten verloren

**DSGVO-Hinweis:** Für die digitale Erfassung von Beobachtungen und Fotos von Kindern ist eine **Einwilligung der Erziehungsberechtigten** erforderlich. Dies ist unabhängig vom verwendeten Tool eine gesetzliche Pflicht.

---

## 🗂️ Technische Details

| | |
|---|---|
| **Typ** | Single-Page Progressive Web App (PWA) |
| **Abhängigkeiten** | Keine – eine einzige HTML-Datei |
| **Datenspeicherung** | localStorage (lokal, kein Server) |
| **Offline-fähig** | Ja |
| **Sprache** | Deutsch (Österreich / Deutschland) |
| **Spracherkennung** | Web Speech API (Chrome, Safari, Edge) |
| **KI** | Anthropic Claude (optional, API-Key erforderlich) |

---

## 📸 Screenshots

| Gruppenübersicht | Beobachtung erfassen | Berichte |
|:---:|:---:|:---:|
| Alle Kinder auf einen Blick | Sprache, Foto, Tags | KI-Elternbrief in Sekunden |

---

## 👤 Autor

**Denise & Georg Eder**  
Kindergartenpädagogin & Entwickler von Sprosse  
📧 [hallo@ederge.org](mailto:hallo@ederge.org)

---

## 📄 Lizenz

Dieses Projekt steht unter keiner Open-Source-Lizenz.  
Alle Rechte vorbehalten © Georg Eder

---

<div align="center">
  <br>
  🌱 <strong>Sprosse</strong> – entwickelt mit ❤️ von Georg Eder für Kindergartenpädagog:innen
  <br>
  <a href="mailto:hallo@ederge.org">hallo@ederge.org</a>
  <br><br>
</div>
