export type LadderKind = "anlege" | "steh" | "schiebe" | "gelenk";
export type Finding = "ok" | "problem" | "unsicher";
export type Findings = Record<string, Finding>;
export interface InspectionPoint {
  id: string;
  title: string;
  x: number;
  y: number;
  checks: string[];
}
export interface LadderType {
  id: LadderKind;
  name: string;
  description: string;
  special: string;
  points: InspectionPoint[];
}
const common = {
  holme: { id: "holme", title: "Holme und Verbindungen", checks: ["Beide Holme auf Risse, Verformung und Verschleiß ansehen.", "Auf lose Verbindungen und fehlende Teile achten; auch die Rückseite betrachten."] },
  stufen: { id: "stufen", title: "Stufen oder Sprossen", checks: ["Alle Auftritte und ihre Befestigungen auf Schäden ansehen.", "Auf Öl, Schmutz und andere rutschige Beläge achten."] },
  fuesse: { id: "fuesse", title: "Füße und Standbasis", checks: ["Alle Füße auf Vollständigkeit, Schäden und Verschleiß ansehen.", "Falls vorhanden: Traverse und ihre Befestigung mitkontrollieren. Der Untergrund muss geeignet sein."] },
  kennzeichnung: { id: "kennzeichnung", title: "Kennzeichnung und Anleitung", checks: ["Sind Sicherheitskennzeichnung und Angaben zur Verwendung lesbar?", "Leiter eindeutig zuordnen und die passende Herstelleranleitung heranziehen. Vorgaben des Betriebs beachten."] },
};
const point = (id: keyof typeof common, x: number, y: number): InspectionPoint => ({ ...common[id], x, y });
export const ladderTypes: LadderType[] = [
  {
    id: "anlege", name: "Anlegeleiter", description: "Einteilig · mit sicherer Anlegestelle",
    special: "Aufstellrichtung, Anlegestelle und Sicherung gegen Verrutschen nach Herstelleranleitung beachten.",
    points: [point("holme", 116, 206), point("stufen", 180, 284), point("fuesse", 86, 435), point("kennzeichnung", 183, 359),
      { id: "kopf", title: "Leiterkopf und Auflage", x: 257, y: 87, checks: ["Auflageflächen und vorhandene Kopfsicherungen auf Schäden ansehen.", "Nur eine tragfähige, sichere Anlegestelle wählen und die erforderliche Sicherung gegen Verrutschen herstellen."] },
      { id: "aufbau", title: "Aufstellung und Umgebung", x: 291, y: 397, checks: ["Aufstellrichtung und Anlegewinkel anhand der Kennzeichnung und Anleitung kontrollieren.", "Verkehrswege, Türen und andere Gefahren im Aufstellbereich berücksichtigen."] },
    ],
  },
  {
    id: "steh", name: "Stehleiter", description: "Mit Plattform · frei stehend",
    special: "Vollständig öffnen. Spreizsicherung muss wirksam sein. Diese Bauart nicht als Anlegeleiter verwenden.",
    points: [point("holme", 90, 286), point("stufen", 185, 289), point("fuesse", 80, 435), point("kennzeichnung", 211, 365),
      { id: "plattform", title: "Plattform und Haltebügel", x: 143, y: 139, checks: ["Plattform, Haltebügel und Befestigungen auf Schäden ansehen.", "Die Plattform muss nach Anleitung vollständig in Gebrauchsstellung sein."] },
      { id: "spreizung", title: "Spreizsicherung", x: 263, y: 280, checks: ["Gurte, Ketten oder Streben samt Befestigungen auf Schäden ansehen.", "Die vorgesehene Spreizsicherung muss beim vollständig geöffneten Aufbau wirksam sein."] },
      { id: "gelenke", title: "Obere Gelenke", x: 213, y: 154, checks: ["Gelenke und Verbindungsteile auf sichtbare Beschädigungen prüfen.", "Auf fehlende oder lockere Verbindungselemente achten."] },
    ],
  },
  {
    id: "schiebe", name: "Schiebeleiter", description: "Mehrteilig · ausziehbar",
    special: "Leiterteile, Führungen und Verriegelungen zusätzlich kontrollieren. Auszug und Überdeckung richten sich nach dem Modell.",
    points: [point("holme", 96, 238), point("stufen", 174, 301), point("fuesse", 80, 435), point("kennzeichnung", 182, 370),
      { id: "verriegelung", title: "Haken und Verriegelungen", x: 222, y: 233, checks: ["Haken und Sperreinrichtungen auf Beschädigung und fehlende Teile ansehen.", "Alle vorgesehenen Sperren müssen nach Anleitung vollständig eingerastet oder eingelegt sein."] },
      { id: "fuehrungen", title: "Führungen und Leiterteile", x: 143, y: 151, checks: ["Führungen, Anschläge und gegebenenfalls Seilzug auf Schäden ansehen.", "Zulässigen Auszug und Überdeckung anhand der Herstelleranleitung kontrollieren."] },
      { id: "kopf", title: "Leiterkopf und Sicherung", x: 269, y: 79, checks: ["Kopfbereich und vorhandene Sicherungsteile auf Schäden ansehen.", "Sichere Anlegestelle und für diese Bauart geeignete Kopfsicherung nach Anleitung beachten."] },
    ],
  },
  {
    id: "gelenk", name: "Gelenkleiter", description: "Klappbare Segmente · verriegelbare Gelenke",
    special: "Nur vom Hersteller zugelassene Stellungen verwenden. Jedes Gelenk muss sicher in Sperrstellung sein.",
    points: [point("holme", 115, 183), point("stufen", 160, 295), point("fuesse", 78, 435), point("kennzeichnung", 176, 368),
      { id: "gelenksperren", title: "Gelenke und Sperrstellungen", x: 265, y: 249, checks: ["Alle Gelenke und Sperrmechanismen auf sichtbare Schäden ansehen.", "An jedem Gelenk die Sperrstellung anhand der Kennzeichnung und Herstelleranleitung kontrollieren."] },
      { id: "stellung", title: "Zulässige Gebrauchsstellung", x: 234, y: 84, checks: ["Den gewählten Aufbau mit der Anleitung abgleichen; nicht jede Klappstellung ist zulässig.", "Für diesen Aufbau vorgesehene Sicherungen und Anbauteile müssen vollständig vorhanden und wirksam sein."] },
    ],
  },
];
export function inspectionState(type: LadderType, findings: Findings): "offen" | "stopp" | "angesehen" {
  if (type.points.some(p => findings[p.id] === "problem" || findings[p.id] === "unsicher")) return "stopp";
  return type.points.every(p => findings[p.id] === "ok") ? "angesehen" : "offen";
}
export const inspectionSources = [
  { title: "DGUV 208-016 · Bauartabhängige Verwendung", url: "https://www.bgbau-medien.de/handlungshilfen_gb/daten/dguv/208_016/5.htm" },
  { title: "DGUV 208-016 · Prüfung und Instandhaltung", url: "https://www.bgbau-medien.de/handlungshilfen_gb/daten/dguv/208_016/6.htm" },
  { title: "DGUV 208-016 · Umgang mit Schäden", url: "https://www.bgbau-medien.de/handlungshilfen_gb/daten/dguv/208_016/7.htm" },
];
