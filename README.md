# LeiterSafe – Sicher arbeiten mit Leitern und Tritten

Vollständig deutschsprachiger, mobiloptimierter Lernprototyp. React, TypeScript, Vite, Tailwind CSS und Lucide. Ohne Registrierung, Backend oder Datenbank.

## Lokal starten

Voraussetzung: Node.js 22.12 oder neuer, npm und Git.

```sh
npm ci
npm run dev
```

Die im Terminal angezeigte Adresse öffnen. Produktionsfassung prüfen:

```sh
npm test
npm run build
npm run preview
```

## Zu GitHub hochladen

Ein leeres Repository (zum Beispiel `leitersafe`) in GitHub anlegen. Im Projektordner:

```sh
git init -b main
git add .
git commit -m "LeiterSafe Prototyp"
git remote add origin https://github.com/DEIN-NAME/leitersafe.git
git push -u origin main
```

Falls der Ordner bereits ein Git-Repository mit einem Sites-Remote ist: `git remote add github https://github.com/DEIN-NAME/leitersafe.git` und `git push -u github main`. Vorhandene Remotes nicht überschreiben.

## GitHub Pages aktivieren

1. Im Repository **Settings → Pages** öffnen.
2. Unter **Build and deployment → Source** die Option **GitHub Actions** wählen.
3. Unter **Actions → Deploy LeiterSafe to GitHub Pages → Run workflow** den Workflow starten (oder einen neuen Commit auf `main` pushen).
4. Der erfolgreiche Deploy zeigt die Adresse, typischerweise `https://DEIN-NAME.github.io/leitersafe/`.

Die mitgelieferte `.github/workflows/pages.yml` installiert per Lockdatei, führt Tests und Build aus und veröffentlicht `dist`. Erforderlich sind aktivierte Actions und die in der Datei gesetzten Pages-Rechte. Branch `main` verwenden oder im Workflow anpassen.

Die Vite-Konfiguration übernimmt `BASE_PATH`. Der Workflow setzt sie automatisch auf den tatsächlichen Repositorynamen. Für ein `NAME.github.io`-Repository wird `/` verwendet. Für eine eigene Domain `BASE_PATH` im Workflow auf `/` setzen. Lokal sowie für die private Sites-Vorschau wird ohne Variable `./` verwendet. Die Navigation nutzt Hash-Fragmente: keine Server-Rewrites und keine 404-Probleme bei Direktlinks. Manuell für ein Unterverzeichnis bauen: `BASE_PATH=/leitersafe/ npm run build`.

## Funktionen

- Startseite mit Einstieg, Check, Test und Lernfortschritt
- Fünf Einheiten mit den Schritten Anschauen, Verstehen, Entscheiden, Ausprobieren
- Fünf Praxisaufgaben ohne Aufstieg; Bildfehler-Übung
- Aufklappbare Grundlagen der Leiterkontrolle ohne Zustandsabfrage oder Bewertung
- Zehn Quizfragen mit sofortiger Erklärung und Ergebnisübersicht
- Lokaler Lernfortschritt, Praxisabschlüsse und bestes Testergebnis; Rücksetzen mit Bestätigung
- Quellen- und Informationsseite; echte Leiterfotografien, lokal ausgeliefert und mit Bildnachweisen
- Unter Check → Leitertyp & Prüfstellen: Anlege-, Steh-, Schiebe- und Gelenkleiter mit eigenen schematischen Abbildungen und anklickbaren Bauteilbereichen

## Leitertypen und interaktive Prüfstellen

Direkteinstieg: `#pruefung`. Eine Bauart auswählen und einen Punkt im Bild oder einen Eintrag in der gleichwertigen Prüfliste anklicken. Die Erklärung nennt die zu kontrollierenden Bauteile. Jede Bauart hat sechs oder sieben Prüfstellen; typspezifisch etwa Spreizsicherung, Plattform, Haken, Führungen oder Gelenksperren. Die Darstellungen sind eigene SVG-Schemata und keine modellspezifischen Aufbauzeichnungen.

Die Prüfstellen lassen sich frei anwählen oder über „Vorherige Prüfstelle“ und „Nächste Prüfstelle“ durchgehen. Der Bereich vermittelt Wissen: Es gibt keine Zustandsabfrage, Bewertung, Freigabe, Stopp-Auswertung oder Ergebnisaufzeichnung. Allgemeine Hinweise zum Umgang mit Schäden und Unsicherheit bleiben als Lerninhalt erhalten. Die Funktion ersetzt keine wiederkehrende betriebliche Prüfung.

Inhalte und Hotspot-Koordinaten: `src/inspection.ts`; Oberfläche und Schemata: `src/LadderInspection.tsx`. Fachquellen: DGUV Information 208-016, Abschnitte 5, 6 und 7, offizielle Wiedergabe bei der BG BAU; Links stehen direkt in der Funktion. Quellenabgleich am 21.11.2026.

Automatisiert geprüft: Inhalte, eindeutige Punkte und überlappungsfreie 44-Pixel-Tippflächen bei 320 Pixel Bildschirmbreite. Browserprüfung: frei anwählbare Prüfstellen, Vor-/Zurück-Navigation, aufklappbare Grundlagen und keine Zustandsbewertung. Eine Prüfung auf einem physischen iPhone steht aus.

## Neue Inhalte ergänzen

```text
src/
  content.ts        # strukturierte Lernmodule, Fragen, Checkliste, Praxis und Quellen
  LadderPhoto.tsx  # echte Leiterfotos, Lernbezug und Bildnachweise
  progress.ts       # validierter Browser-Speicher (leitersafe-v1)
  main.tsx          # Navigation und interaktive Ansichten
  style.css         # Tailwind-Einbindung und responsive Gestaltung
 tests/             # Daten- und Speicherprüfungen
.github/workflows/pages.yml
```

In `src/content.ts` ein Objekt im Array `lessons` ergänzen: eindeutige stabile `id`, `title`, `short`, `text`, `example`, `practice`, `question`, `source`. Die Übersicht und Fortschrittsberechnung passen sich der Modulanzahl an. Jede Frage braucht `situation`, `options`, den nullbasierten Index `correct`, eine kurze `explanation`, eine Rückmeldung je Antwort in `feedback`, `source` und einen passenden Fotoindex `scene`. Mit `showPhoto: false` kann ein Foto entfallen, wenn es keine passende Beobachtung unterstützt. Neue Fragen im Array `questions` werden von der Oberfläche automatisch berücksichtigt. Bei einer geänderten Quizanzahl sind auch die entsprechenden Test-Erwartungen zu aktualisieren. Bei Änderung der Quizanzahl die Speicher-Validierung und Texte über die Anzahl entsprechend anpassen. Neue Fotozuordnungen in `LadderPhoto.tsx` ergänzen. Bildrechte, sichtbare Merkmale und Lernbezug vor der Verwendung prüfen. Inhalte vor Einsatz fachlich gegen offizielle Quellen prüfen; ungeprüfte Ergänzungen als Demo kennzeichnen. Keine gefährlichen praktischen Aufgaben verlangen.

## Fachliche Grenzen

Quellenabgleich am 21.11.2026:

- [DGUV Information 208-016, August 2022](https://publikationen.dguv.de/widgets/pdf/download/article/450): Abschnitte 2–3 Auswahl, 5 Verwendung, 6–7 Prüfung und Mängel.
- [TRBS 2121 Teil 2, Dezember 2018](https://www.baua.de/DE/Angebote/Regelwerk/TRBS/TRBS-2121-Teil-2): Abschnitte 3 und 4, Gefährdungsbeurteilung und Schutzmaßnahmen. Die BAuA-Detailseite und indexierte Passagen waren zugänglich; der direkte PDF-Abruf lieferte 403. Die relevanten Anforderungen sind auch in der DGUV-Fassung wiedergegeben.
- [Offizielle Wiedergabe bei der BG BAU, Abschnitt 5](https://www.bgbau-medien.de/handlungshilfen_gb/daten/dguv/208_016/5.htm) und [Abschnitt 7](https://www.bgbau-medien.de/handlungshilfen_gb/daten/dguv/208_016/7.htm).

Die Lerninhalte sind eigene vereinfachte Formulierungen. Die beschriebenen Fälle sind didaktische Beispiele. Echte Fotos zeigen einzelne Merkmale, keine vollständigen Aufbauanleitungen. Es werden keine pauschalen Höhen-, Last- oder Winkelgrenzen vermittelt. Leiterbauart, Herstelleranleitung, Gefährdungsbeurteilung und betriebliche Bedingungen müssen im Einzelfall berücksichtigt werden. TRBS 2121 Teil 2 betrifft Leitern; Tritte werden ergänzend anhand der DGUV behandelt.

Der Check ist keine Einsatzfreigabe und ersetzt keine wiederkehrende Prüfung. Die App ersetzt keine betriebliche Unterweisung und stellt kein rechtssicheres Zertifikat oder Unterweisungsprotokoll aus. Vor betrieblichem Einsatz sind Inhalte und Abläufe fachkundig zu prüfen und an den Betrieb anzupassen.

## Datenschutz und Technik

`localStorage` speichert ausschließlich Lernzustände auf diesem Browser unter diesem Ursprung. Keine Übertragung, keine Analytics, keine extern geladenen Schriftarten. Speicherfehler werden angezeigt. Ein anderer Browser oder das Löschen der Browserdaten entfernt den Fortschritt. Der Check-Bereich speichert keine Zustandsangaben zur Leiter.

Die `.openai/hosting.json` dient ausschließlich einer optionalen privaten Sites-Vorschau; GitHub Pages verwendet sie nicht. Für ein unabhängiges Repository kann sie entfernt werden.

## Validierung dieses Prototyps

TypeScript-Prüfung und Produktionsbuild bestanden. Die automatischen Tests prüfen Inhaltskonsistenz, defensive Speicherbehandlung und die Erreichbarkeit der Prüfstellen. Ein zusätzlicher Build mit `BASE_PATH=/leitersafe/` prüft die Ausgabe für ein Repository-Unterverzeichnis. Browser-Interaktionen werden in Chromium bei Handy- und Desktopgrößen geprüft; eine Prüfung auf einem physischen Smartphone steht aus.

Vor Einsatz manuell prüfen: alle vier Lernschritte durchlaufen; falsche Antwort erklären lassen und wiederholen; Praxisaufgabe markieren; Grundlagen aufklappen und Prüfstellen aller Bauarten ansehen; Quiz abschließen und erneut starten; Browser neu laden und Fortschritt prüfen; Rücksetzen abbrechen und bestätigen; Bildschirmbreite 375 px sowie Tastaturbedienung prüfen.

## Überarbeitung: Praxisfragen und Fotografien

Zehn Situationsfragen mit jeweils drei plausiblen Handlungsalternativen und Rückmeldung zur gewählten Antwort. Die Position der richtigen Antwort ist verteilt. Auswahl und Auswertung sind getrennte Schritte. Eine falsche Lernentscheidung kann nach dem Lesen der Erklärung fortgesetzt werden; im Wissenstest bleibt das erste Ergebnis gewertet. Die Bildübung verwendet ein echtes Foto und fragt nach Maßnahmen bei Tür und Matte. Sie behauptet keine aus dem Foto nicht nachweisbaren Defekte.

Vier Fotoansichten aus drei Originalfotografien, lokal in `public/images/` (kein Hotlinking). Urheber, Originalquellen, Änderungen und Lizenzen stehen in `public/images/CREDITS.md` und in der App unter Informationen & Quellen. Die Bilder stammen nicht von einer generativen KI.

## Bildzuordnung zu Lernaufgaben

Die Grundlagen verknüpfen das Thema über einen expliziten Medienschlüssel mit der Ansicht (`src/CheckTopicMedia.tsx`), unabhängig von der Reihenfolge der Themen. Holme, Stufen/Plattform und Spreizsicherung zeigen relevante Ausschnitte vorhandener Originalfotos; Füße und Aufstellort nutzen die passenden Detail- bzw. Umgebungsfotos. Aufgabe und Anleitung werden durch eine beschriftete Darstellung von Tätigkeit, Kennzeichnung und Herstelleranleitung erläutert. In der Schulung sind Bildzuordnungen ausdrücklich in den Einheiten hinterlegt; Einheiten ohne passendes Foto zeigen keine beliebige Leiteraufnahme.
