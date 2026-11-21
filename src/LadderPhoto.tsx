import { useState } from "react";
export const photoSources = [
  {
    file: "stehleiter.webp",
    title: "Stehleiter mit sichtbarer Spreizsicherung",
    author: "INCOSV",
    license: "Public Domain",
    licenseUrl: "https://commons.wikimedia.org/wiki/File:Inco_Ladder.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Inco_Ladder.jpg",
    changes: "Verkleinert und als WebP gespeichert.",
  },
  {
    file: "leiter-sichtkontrolle.webp",
    title: "Zusammengeklappte Stufenleiter mit Kennzeichnung",
    author: "Amin",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "https://commons.wikimedia.org/wiki/File:Ladder_aluminum.jpg",
    changes: "Verkleinert und als WebP gespeichert.",
  },
  {
    file: "leiterfuesse.webp",
    title: "Detail: Leiterfüße und untere Stufe",
    author: "Amin",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "https://commons.wikimedia.org/wiki/File:Ladder_aluminum.jpg",
    changes:
      "Bildausschnitt der Leiterfüße; WebP. Bearbeitung ebenfalls unter CC BY-SA 4.0.",
  },
  {
    file: "aufstellort.webp",
    title: "Praxisfoto: Leiter vor einer Tür mit Fußmatte im Aufstellbereich",
    author: "Nerijp",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "https://commons.wikimedia.org/wiki/File:Escabeau_alu.JPG",
    changes: "Als WebP gespeichert.",
  },
];
const scenes = [
  {
    photo: 0,
    caption:
      "Bauart erkennen: Stehleiter mit Spreizsicherung. Die Herstellerangaben bestimmen die Benutzung.",
  },
  {
    photo: 2,
    caption:
      "Genau hinsehen: Leiterfüße und Verbindung zur unteren Stufe. Die Quizsituation beschreibt einen davon unabhängigen Fall.",
  },
  {
    photo: 0,
    caption:
      "Die Spreizsicherung verbindet die Leiterseiten. Vor der Benutzung muss sie nach Anleitung wirksam sein.",
  },
  {
    photo: 0,
    caption:
      "Arbeitsmittel und Aufstellort müssen zur Aufgabe passen. Ein Foto ersetzt die Beurteilung vor Ort nicht.",
  },
  {
    photo: 1,
    caption:
      "Vor jeder Verwendung: Zustand und Kennzeichnung kontrollieren. Die zusammengeklappte Leiter wird so nicht benutzt.",
  },
  {
    photo: 3,
    caption:
      "Aufstellort beurteilen: Beachte die Tür und die Matte im Bereich der Leiterfüße.",
  },
];
export function LadderPhoto({
  scene = 0,
  hero = false,
}: {
  scene?: number;
  hero?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const choice = hero
    ? {
        photo: 0,
        caption: "Arbeitsmittel kennen. Gefahren erkennen. Sicher entscheiden.",
      }
    : scenes[scene] || scenes[0];
  const photo = photoSources[choice.photo];
  return (
    <figure
      className={`ladder-photo ${hero ? "hero-photo" : ""} ${scene === 5 ? "site-photo" : ""}`}
    >
      <div className="photo-stage">
        {failed ? (
          <div className="photo-unavailable">
            Foto nicht verfügbar. {photo.title}. Die Lernaufgabe bleibt über den
            Text bearbeitbar.
          </div>
        ) : (
          <img
            key={photo.file}
            src={`${import.meta.env.BASE_URL}images/${photo.file}`}
            alt={photo.title}
            loading={hero ? "eager" : "lazy"}
            decoding="async"
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <figcaption>
        <span>{choice.caption}</span>
        <small>
          Foto: {photo.author} · {photo.license} · Bildnachweise unter
          Informationen & Quellen
        </small>
      </figcaption>
    </figure>
  );
}
export function PhotoCredits() {
  return (
    <section className="photo-credits">
      <h2>Bildnachweise</h2>
      <p>
        Echte Fotografien von Wikimedia Commons. Sie zeigen einzelne Merkmale
        und sind keine Freigabe oder vollständige Anleitung. Die Bildautoren
        unterstützen diese App nicht ausdrücklich.
      </p>
      {photoSources.map((p) => (
        <div className="credit" key={p.file}>
          <a href={p.source} target="_blank" rel="noreferrer">
            {p.title}
          </a>
          <p>
            {p.author} ·{" "}
            <a href={p.licenseUrl} target="_blank" rel="noreferrer">
              {p.license}
            </a>
          </p>
          <small>{p.changes}</small>
        </div>
      ))}
    </section>
  );
}
