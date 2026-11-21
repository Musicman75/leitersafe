export type LadderKind = "leaning" | "standing" | "step";
export type Material = "metal" | "wood" | "composite";
export type Variant = "single" | "platform" | "double" | "fixed" | "folding";
export type Area =
  | "rails"
  | "treads"
  | "feet"
  | "joints"
  | "spread"
  | "platform"
  | "label"
  | "setup";
export type InspectionConfig = {
  kind: LadderKind;
  variant: Variant;
  material: Material;
};
export type InspectionItem = {
  id: string;
  area: Area;
  title: string;
  question: string;
  hint: string;
  source: string;
};
export const ladderKinds = [
  {
    id: "leaning",
    title: "Anlegeleiter",
    description: "Einteilig. Wird an eine geeignete Fläche angelegt.",
  },
  {
    id: "standing",
    title: "Stehleiter",
    description: "Steht mit zwei geöffneten Leiterseiten frei.",
  },
  {
    id: "step",
    title: "Tritt",
    description: "Kompakter Aufstieg mit festen oder klappbaren Stufen.",
  },
] as const;
export const variants: Record<LadderKind, { id: Variant; title: string }[]> = {
  leaning: [{ id: "single", title: "Einteilige Anlegeleiter" }],
  standing: [
    { id: "platform", title: "Mit Plattform" },
    { id: "double", title: "Beidseitig begehbar, ohne Plattform" },
  ],
  step: [
    { id: "fixed", title: "Starrer Tritt" },
    { id: "folding", title: "Klappbarer Tritt" },
  ],
};
export function isSupportedConfig(c: InspectionConfig): boolean {
  return (
    ladderKinds.some((k) => k.id === c.kind) &&
    variants[c.kind]?.some((v) => v.id === c.variant) &&
    ["metal", "wood", "composite"].includes(c.material)
  );
}
const source =
  "DGUV Information 208-016, Abschnitte 5–7 und Kontrollblatt im Anhang";
export function getInspectionItems(c: InspectionConfig): InspectionItem[] {
  if (!isSupportedConfig(c)) throw new Error("Nicht unterstützte Ausführung");
  const item = (
    id: string,
    area: Area,
    title: string,
    question: string,
    hint: string,
  ): InspectionItem => ({ id, area, title, question, hint, source });
  const list = [
    item(
      "identification",
      "label",
      "Kennzeichnung und Anleitung",
      "Sind Kennzeichnung und Sicherheitshinweise lesbar und ist die passende Herstelleranleitung bekannt?",
      "Gleiche Bauart und Ausführung ab. Eine aktuelle Prüfkennzeichnung ersetzt die Kontrolle vor der Benutzung nicht.",
    ),
    item(
      "rails",
      "rails",
      c.kind === "step" ? "Tragende Teile" : "Holme",
      "Sind die tragenden Seitenteile ohne sichtbare Risse, Knicke oder Verformungen?",
      "Betrachte beide Seiten und die Anschlussstellen. Keine Belastungsprobe durchführen.",
    ),
    item(
      "material",
      "rails",
      "Werkstoff beachten",
      c.material === "wood"
        ? "Ist das Holz ohne erkennbare Fäulnis oder Splitter, und bleiben Schäden unter einer Beschichtung erkennbar?"
        : c.material === "composite"
          ? "Ist der Kunststoff oder Faserverbund ohne sichtbare Brüche, Abplatzungen oder freiliegende Fasern?"
          : "Sind die Metallteile ohne erkennbare Korrosion oder andere Materialschäden?",
      "Bei unklarem Materialzustand nicht weiterverwenden und fachkundig klären lassen. Dieser Check beurteilt keine elektrische Isoliereignung.",
    ),
    item(
      "treads",
      "treads",
      "Stufen und Sprossen",
      "Sind alle vorgesehenen Stufen oder Sprossen vorhanden, unbeschädigt und sichtbar fest mit den Seitenteilen verbunden?",
      "Achte auf Verformungen, fehlende Teile und auffällige Verbindungen. Nicht aufsteigen, um die Festigkeit zu testen.",
    ),
    item(
      "connections",
      "joints",
      "Verbindungen",
      "Sind die sichtbaren Schrauben, Nieten und Verbindungsstellen vollständig und ohne erkennbare Lockerung oder Schäden?",
      "Kontrolliere insbesondere die Verbindungen zu Stufen und tragenden Teilen. Keine eigenmächtige Reparatur.",
    ),
    item(
      "feet",
      "feet",
      "Füße und Abrutschsicherung",
      "Sind alle für diese Ausführung vorgesehenen Füße oder Fußkappen vorhanden, befestigt und ohne starke Abnutzung?",
      "Ein erforderliches fehlendes Teil ist ein Mangel. Bei Rollen, verstellbaren Füßen oder anderer Sonderausstattung bitte das passende Herstellerverfahren verwenden.",
    ),
    item(
      "clean",
      "treads",
      "Saubere Trittflächen",
      "Sind Trittflächen und Griffbereiche frei von rutschigen oder verdeckenden Verunreinigungen?",
      "Achte beispielsweise auf Öl, Fett, Farbe und anhaftenden Schmutz.",
    ),
  ];
  if (c.kind === "standing" || c.variant === "folding") {
    list.push(
      item(
        "hinges",
        "joints",
        "Gelenke und Klappteile",
        "Sind Gelenke und ihre Befestigungen ohne sichtbare Schäden und ist die vorgeschriebene Stellung nach Anleitung erreicht?",
        "Bewegliche Teile nur nach Herstelleranleitung und vom Boden aus bedienen. Finger von Quetschstellen fernhalten.",
      ),
    );
    list.push(
      item(
        "spread",
        "spread",
        c.kind === "standing"
          ? "Spreizsicherung"
          : "Sicherung gegen Zusammenklappen",
        "Sind die vorgesehenen Sicherungen vollständig, unbeschädigt und nach Herstelleranleitung wirksam?",
        "Gurte, Streben oder Verriegelungen können unterschiedlich aussehen. Fehlt eine vorgeschriebene Sicherung oder ist ihre Wirkung unklar: stoppen.",
      ),
    );
  }
  if (c.variant === "platform")
    list.push(
      item(
        "platform",
        "platform",
        "Plattform",
        "Ist die Plattform vollständig, unbeschädigt und nach Anleitung sicher in ihrer vorgesehenen Stellung?",
        "Achte auf Befestigung und Auflage. Nicht durch Besteigen oder Wippen ausprobieren.",
      ),
    );
  list.push(
    item(
      "equipment",
      "label",
      "Ausstattung vollständig",
      "Sind alle laut Hersteller erforderlichen Anbauteile vorhanden, unbeschädigt und korrekt befestigt?",
      "Zum Beispiel eine vorgeschriebene Traverse. Die schematische Zeichnung zeigt nicht jedes Modell. Bei unbekannter Ausstattung nicht einfach bestätigen.",
    ),
  );
  list.push(
    item(
      "task",
      "setup",
      "Aufgabe und Arbeitsmittel",
      "Ist dieses Arbeitsmittel für die konkrete Aufgabe nach betrieblicher Vorgabe geeignet?",
      "Arbeitsdauer, Werkzeug und Erreichbarkeit müssen berücksichtigt sein. Im Zweifel zuständige Person fragen.",
    ),
  );
  list.push(
    item(
      "location",
      "setup",
      "Aufstellort und Umgebung",
      "Sind Untergrund und Umgebung geeignet und Gefahren durch Türen, Verkehr, Wetter oder elektrischen Strom geklärt?",
      "Eben, tragfähig und rutschhemmend aufstellen. Vorgesehene Schutzmaßnahmen vor Beginn umsetzen.",
    ),
  );
  if (c.kind === "leaning")
    list.push(
      item(
        "leaning",
        "setup",
        "Sicher anlegen",
        "Sind Anlegefläche, Aufstellrichtung, Anstellwinkel und Sicherung gegen Verrutschen nach Anleitung und betrieblicher Vorgabe geklärt?",
        "Die passende Aufstellung hängt von Leiter und Einsatz ab. Keine pauschale Einsatzfreigabe aus diesem Check ableiten.",
      ),
    );
  return list;
}
export type InspectionSession = {
  config: InspectionConfig | null;
  answers: number[];
};
export type InspectionAction =
  | { type: "configure"; config: InspectionConfig }
  | { type: "answer"; value: number }
  | { type: "back" }
  | { type: "reset" };
export function inspectionReducer(
  s: InspectionSession,
  a: InspectionAction,
): InspectionSession {
  if (a.type === "reset") return { config: null, answers: [] };
  if (a.type === "configure")
    return isSupportedConfig(a.config)
      ? { config: a.config, answers: [] }
      : { config: null, answers: [] };
  if (a.type === "back") return { ...s, answers: s.answers.slice(0, -1) };
  if (
    !s.config ||
    ![0, 1, 2].includes(a.value) ||
    s.answers.some((x) => x !== 0) ||
    s.answers.length >= getInspectionItems(s.config).length
  )
    return s;
  return { ...s, answers: [...s.answers, a.value] };
}
