export type Question = {
  question: string;
  situation: string;
  options: string[];
  correct: number;
  explanation: string;
  feedback: string[];
  scene: number;
  showPhoto?: boolean;
  source: string;
};
export type Lesson = {
  id: string;
  title: string;
  short: string;
  text: string;
  example: string;
  practice: string;
  question: Question;
  source: string;
};
export const questions: Question[] = [
  {
    situation: "Sichtkontrolle im Lager",
    question:
      "An einem Leiterfuß ist das Material eingerissen. Die Prüfkennzeichnung ist noch gültig. Wie gehst du vor?",
    options: [
      "Ich melde den Schaden nach dem Auftrag und nutze die Leiter bis dahin.",
      "Ich entziehe die Leiter der Benutzung und melde den Schaden.",
      "Ich lasse einen Kollegen die Leiter festhalten und erledige den Auftrag.",
    ],
    correct: 1,
    explanation:
      "Ein neuer Schaden zählt auch bei gültiger Prüfkennzeichnung. Die Leiter darf bis zur fachkundigen Klärung nicht benutzt werden.",
    feedback: [
      "Eine Meldung erst nach der Arbeit kommt zu spät. Der erkannte Schaden muss vor der Benutzung geklärt werden.",
      "Du reagierst auf den aktuellen Zustand der Leiter.",
      "Festhalten behebt den beschädigten Fuß nicht.",
    ],
    scene: 1,
    source: "DGUV 208-016, Abschnitte 5.1, 6 und 7",
  },
  {
    situation: "Arbeitsmittel auswählen",
    question:
      "Du sollst an einer hohen Anlage länger mit Werkzeug arbeiten. Was klärst du zuerst?",
    options: [
      "Welches Arbeitsmittel die betriebliche Gefährdungsbeurteilung für diese Aufgabe vorsieht.",
      "Welche verfügbare Leiter bis zur Arbeitsstelle reicht.",
      "Ob sich die Arbeit in mehrere kurze Leiter-Einsätze aufteilen lässt.",
    ],
    correct: 0,
    explanation:
      "Reichweite allein genügt nicht. Arbeitsdauer, Werkzeug und Umgebung gehören zur Auswahl. Kläre mit der zuständigen Person, ob zum Beispiel eine Arbeitsbühne nötig ist.",
    feedback: [
      "Damit beziehst du die Aufgabe und die betrieblichen Schutzmaßnahmen ein.",
      "Eine passende Höhe sagt noch nichts darüber aus, ob die Arbeit auf einer Leiter sicher ist.",
      "Das Aufteilen ersetzt die Beurteilung der gesamten Tätigkeit nicht.",
    ],
    scene: 0,
    source: "DGUV 208-016, Abschnitte 2 und 3; TRBS 2121 Teil 2, 3–4",
  },
  {
    situation: "Vorbereitung in der Werkstatt",
    question:
      "Am vorgesehenen Aufstellort liegt eine lose Matte. Wie stellst du einen sicheren Stand her?",
    options: [
      "Ich lege eine feste Platte auf die Matte, damit die Füße gleichmäßig stehen.",
      "Ich stelle die Leiter auf und prüfe durch leichtes Rütteln, ob sie stabil wirkt.",
      "Ich lasse die lose Unterlage entfernen und prüfe den freien Untergrund.",
    ],
    correct: 2,
    explanation:
      "Der Untergrund muss eben, tragfähig und rutschhemmend sein. Lose Unterlagen können verrutschen. Eine Wackelprobe ersetzt diese Voraussetzungen nicht.",
    feedback: [
      "Eine Platte auf einer losen Matte beseitigt die Rutschgefahr nicht zuverlässig.",
      "Auch eine zunächst ruhig stehende Leiter kann auf einer losen Unterlage verrutschen.",
      "Du beseitigst die Ursache und kontrollierst danach den tatsächlichen Aufstellort.",
    ],
    scene: 5,
    source: "DGUV 208-016, Abschnitt 5.2",
  },
  {
    situation: "Arbeitsstelle wechseln",
    question:
      "Ein Kollege auf der Leiter bittet dich, sie ein Stück zum nächsten Regal zu versetzen. Wie reagierst du?",
    options: [
      "Ich lasse ihn zuerst sicher absteigen und stelle die Leiter danach neu auf.",
      "Ich versetze sie erst, wenn er sich mit beiden Händen festhält.",
      "Ich lasse ihn auf die unterste Stufe gehen und versetze sie dann.",
    ],
    correct: 0,
    explanation:
      "Die Leiter wird erst bewegt, wenn niemand mehr darauf steht. Am neuen Ort muss sie wieder sicher aufgestellt werden.",
    feedback: [
      "So wird die Leiter ohne Person darauf umgesetzt.",
      "Auch beim Festhalten kann die Person beim Versetzen das Gleichgewicht verlieren.",
      "Auch auf der untersten Stufe steht noch eine Person auf der Leiter.",
    ],
    scene: 3,
    showPhoto: false,
    source: "DGUV 208-016, Abschnitt 5.2",
  },
  {
    situation: "Arbeiten am Regal",
    question:
      "Das nächste Fach erreichst du nur noch mit weit ausgestrecktem Arm zur Seite. Was ist der sichere nächste Schritt?",
    options: [
      "Ich lasse die Leiter unten festhalten und greife seitlich weiter.",
      "Ich beende den Griff, steige sicher ab und wähle einen besseren Aufstellort.",
      "Ich halte mich mit einer Hand fest und verlagere mein Gewicht zum Fach.",
    ],
    correct: 1,
    explanation:
      "Weites seitliches Hinauslehnen kann die Leiter kippen lassen. Die Arbeitsstelle muss erreichbar sein, ohne den Körper weit aus dem Leiterbereich zu verlagern.",
    feedback: [
      "Eine zweite Person ersetzt den passenden Aufstellort nicht.",
      "Du passt den Aufstellort an, statt deine Reichweite zu erzwingen.",
      "Festhalten gleicht die seitliche Verlagerung des Körpergewichts nicht zuverlässig aus.",
    ],
    scene: 3,
    showPhoto: false,
    source: "DGUV 208-016, Abschnitt 5.2",
  },
  {
    situation: "Stehleiter vorbereiten",
    question:
      "Die Stehleiter passt nur halb geöffnet in eine Nische. Die Spreizsicherung ist noch locker. Was tust du?",
    options: [
      "Ich nutze sie, wenn alle Füße den Boden berühren.",
      "Ich lasse die Leiter zusätzlich von einer Person sichern.",
      "Ich beginne nicht und kläre ein Arbeitsmittel, das dort sicher aufgestellt werden kann.",
    ],
    correct: 2,
    explanation:
      "Die Spreizsicherung muss nach Herstelleranleitung wirksam sein. Eine halb geöffnete Stehleiter wird durch Festhalten nicht passend für den engen Platz.",
    feedback: [
      "Bodenkontakt allein ersetzt die wirksame Spreizsicherung nicht.",
      "Zusätzliches Festhalten ersetzt das vollständige, korrekte Aufstellen nicht.",
      "Du klärst die Aufstellbedingungen, bevor jemand die Leiter benutzt.",
    ],
    scene: 2,
    source: "DGUV 208-016, Abschnitt 5.3",
  },
  {
    situation: "Arbeit im Verkehrsbereich",
    question:
      "Für einen Auftrag soll die Leiter in einem Fahrweg stehen. Welche Vorbereitung ist entscheidend?",
    options: [
      "Ich kündige den Auftrag den Kollegen an und beginne in einer ruhigen Phase.",
      "Ich lasse den Bereich vor Beginn wirksam gegen Anfahren und Umstoßen sichern.",
      "Ich stelle ein Warnschild direkt an die Leiter und halte den Fahrweg sonst frei.",
    ],
    correct: 1,
    explanation:
      "Die Sicherung muss zur tatsächlichen Verkehrssituation passen. Eine Ankündigung oder ein einzelnes Schild allein verhindert das Anfahren der Leiter nicht.",
    feedback: [
      "Auch in einer ruhigen Phase kann unerwartet Verkehr auftreten.",
      "Du verlangst eine wirksame Maßnahme für diesen Arbeitsbereich.",
      "Ein Schild warnt. Es stellt allein noch keine wirksame Absicherung gegen Anfahren her.",
    ],
    scene: 4,
    showPhoto: false,
    source: "DGUV 208-016, Abschnitt 5.2; TRBS 2121 Teil 2, 4.2.1",
  },
  {
    situation: "Die Leiter wurde gerade erst geprüft",
    question:
      "Die Prüfkennzeichnung ist aktuell. Was bleibt vor deinem Einsatz zu tun?",
    options: [
      "Ich kontrolliere die Leiter selbst auf sichtbare Schäden.",
      "Ich kontrolliere sie nur dann, wenn sie seit der Prüfung transportiert wurde.",
      "Ich kontrolliere sie nur, wenn mir ein Schaden gemeldet wurde.",
    ],
    correct: 0,
    explanation:
      "Schäden können jederzeit entstehen. Die Sichtkontrolle vor jeder Verwendung ergänzt die wiederkehrende Prüfung.",
    feedback: [
      "Du prüfst den Zustand zum Zeitpunkt deiner Benutzung.",
      "Auch ohne Transport kann sich der Zustand verändert haben.",
      "Nicht jeder Schaden wurde bereits bemerkt oder gemeldet.",
    ],
    scene: 1,
    source: "DGUV 208-016, Abschnitte 5.1 und 6",
  },
  {
    situation: "Außenarbeit bei wechselndem Wetter",
    question:
      "Während der Arbeit kommen starke Windböen auf. Welche Entscheidung ist richtig?",
    options: [
      "Ich setze die Arbeit mit einer zweiten Person zur Sicherung fort.",
      "Ich warte eine windstille Pause ab und erledige die restliche Arbeit schnell.",
      "Ich unterbreche die Arbeit sicher und lasse die Bedingungen neu beurteilen.",
    ],
    correct: 2,
    explanation:
      "Bei Wetter, das die Sicherheit gefährdet, darf die Arbeit nicht fortgesetzt werden. Eine kurze Windpause beseitigt die Gefahr durch weitere Böen nicht.",
    feedback: [
      "Eine zweite Person beseitigt die Gefährdung durch Windböen nicht.",
      "Weitere Böen bleiben möglich. Zeitdruck ist keine Schutzmaßnahme.",
      "Die veränderten Bedingungen müssen vor einer Fortsetzung geklärt sein.",
    ],
    scene: 4,
    showPhoto: false,
    source: "DGUV 208-016, Abschnitt 5.2; TRBS 2121 Teil 2, 4.2.4",
  },
  {
    situation: "Eine Auffälligkeit richtig einordnen",
    question:
      "Eine Stufe wirkt verbogen. Du kannst den Schaden nicht sicher beurteilen. Was veranlasst du?",
    options: [
      "Ich bitte einen erfahrenen Kollegen um eine kurze Belastungsprobe.",
      "Ich nutze die Leiter vorerst nicht und lasse die Auffälligkeit fachkundig klären.",
      "Ich vermeide diese Stufe und melde die Auffälligkeit nach der Arbeit.",
    ],
    correct: 1,
    explanation:
      "Eine unklare Verformung muss vor der Benutzung geklärt werden. Informiere die zuständige Person. Eine befähigte oder benannte Prüfperson beurteilt den Zustand.",
    feedback: [
      "Eine Belastungsprobe kann die Beteiligten gefährden und ersetzt die fachkundige Beurteilung nicht.",
      "Unsicherheit ist ein Grund, vor der Benutzung nachzufragen.",
      "Das Auslassen einer Stufe behebt eine mögliche Schwächung der Leiter nicht.",
    ],
    scene: 1,
    source: "DGUV 208-016, Abschnitte 5.1, 6 und 7",
  },
];
export const lessons: Lesson[] = [
  {
    id: "auswahl",
    title: "Welche Leiter brauche ich?",
    short: "Das passende Arbeitsmittel wählen.",
    text: "Wähle das Arbeitsmittel passend zur Aufgabe. Eine Leiter ist nicht immer die sicherste Lösung. Dein Betrieb muss vorher die Gefahren beurteilen.",
    example:
      "Im Lager sollst du mehrere Fächer neu beschriften. Du klärst zuerst, wie lange die Arbeit dauert, was du mitnehmen musst und welches Arbeitsmittel dafür vorgesehen ist.",
    practice:
      "Sieh dir vom Boden aus einen Tritt und eine Leiter an. Besprich mit einer zuständigen Person, wofür beide vorgesehen sind. Steige nicht auf.",
    question: questions[1],
    source:
      "DGUV 208-016, Abschnitte 2 und 3.1; TRBS 2121 Teil 2, Abschnitte 3 und 4.1",
  },
  {
    id: "kontrolle",
    title: "Ist meine Leiter in Ordnung?",
    short: "Schäden rechtzeitig entdecken.",
    text: "Sieh dir die Leiter vor jeder Benutzung an. Die Holme sind die langen Seitenteile. Sie, die Stufen und die Füße müssen unbeschädigt sein.",
    example:
      "Vor dem Einräumen fällt dir ein eingerissener Leiterfuß auf. Du benutzt die Leiter nicht und meldest den Schaden.",
    practice:
      "Betrachte eine sicher gelagerte Leiter vom Boden aus. Suche Holme, Stufen und Füße. Bei Schäden: nicht benutzen und melden. Keine Belastungsprobe.",
    question: questions[0],
    source: "DGUV 208-016, Abschnitte 5.1, 6 und 7",
  },
  {
    id: "aufstellen",
    title: "Wie stelle ich die Leiter sicher auf?",
    short: "Ein sicherer Stand ist der Anfang.",
    text: "Die Leiter braucht einen ebenen, tragfähigen und rutschhemmenden Untergrund. Beachte die Anleitung an deiner Leiter.",
    example:
      "Im Flur liegt Verpackungsmaterial. Vor Arbeitsbeginn wird der Bereich frei gemacht und gegen Verkehr gesichert.",
    practice:
      "Prüfe einen möglichen Aufstellort nur vom Boden aus. Ist er eben und frei von Hindernissen? Besprich eine sichere Lösung. Stelle nichts auf Kisten oder lose Unterlagen.",
    question: questions[2],
    source:
      "DGUV 208-016, Abschnitte 5.2 und 5.3; TRBS 2121 Teil 2, Abschnitt 4.2.1",
  },
  {
    id: "arbeiten",
    title: "Wie arbeite ich sicher auf der Leiter?",
    short: "Sicher stehen und festhalten.",
    text: "Lehne dich nicht weit zur Seite. Wenn du die Stelle nicht bequem erreichst, steige sicher ab und stelle die Leiter neu auf.",
    example:
      "Beim Einräumen liegt das nächste Fach zu weit rechts. Du unterbrichst die Arbeit, statt dich hinüberzustrecken.",
    practice:
      "Plane vom Boden aus, wo die Leiter stehen müsste. Zeige auf die Arbeitsstelle und besprich den Abstand. Für diese Übung ist kein Aufstieg nötig.",
    question: questions[4],
    source: "DGUV 208-016, Abschnitt 5.2; TRBS 2121 Teil 2, Abschnitt 4.2.1",
  },
  {
    id: "gefahr",
    title: "Was mache ich bei Gefahr?",
    short: "Stoppen. Sichern. Bescheid sagen.",
    text: "Benutze eine beschädigte Leiter nicht. Melde den Mangel und verhindere nach betrieblicher Vorgabe, dass andere sie weiterverwenden.",
    example:
      "Du bemerkst eine verbogene Stufe. Du informierst die verantwortliche Person. Die Leiter wird bis zur Klärung der Benutzung entzogen.",
    practice:
      "Finde heraus, wem du einen Mangel meldest und wo gesperrte Leitern sicher aufbewahrt werden. Sprich den Meldeweg mit deiner Führungskraft durch.",
    question: questions[9],
    source: "DGUV 208-016, Abschnitte 5.1 und 7",
  },
];
export const checkItems = [
  [
    "Holme und Verbindungen",
    "Sind die Seitenteile und Verbindungen ohne sichtbare Risse, Verformungen oder lockere Teile?",
  ],
  [
    "Stufen und Plattform",
    "Sind alle Stufen fest, unbeschädigt und frei von Öl oder Schmutz?",
  ],
  [
    "Füße und Sicherungen",
    "Sind die Füße vollständig und unbeschädigt? Sind die für diese Leiter vorgesehenen Sicherungen nach Anleitung wirksam?",
  ],
  [
    "Aufstellort und Umgebung",
    "Ist der Untergrund eben, tragfähig und rutschhemmend? Sind Verkehrswege und andere Gefahren wirksam abgesichert?",
  ],
  [
    "Aufgabe und Anleitung",
    "Ist die Leiter für diese Aufgabe betrieblich vorgesehen? Kennst du die Herstelleranleitung und die betrieblichen Vorgaben?",
  ],
];
export const practices = [
  {
    title: "Prüfe deine Leiter.",
    description: "Schau genau hin – bevor du sie benutzt.",
    scene: 1,
    steps: [
      "Sieh dir eine sicher gelagerte Leiter vom Boden aus an.",
      "Kontrolliere Holme, Stufen und Füße ohne Belastungsprobe.",
      "Achte auf Risse, fehlende Füße und verbogene Teile.",
      "Bei einem Mangel oder Zweifel: nicht benutzen, melden und gegen Weiterbenutzung sichern lassen.",
    ],
  },
  {
    title: "Eine geeignete Leiter auswählen",
    description: "Welche Lösung passt zur Aufgabe?",
    scene: 0,
    steps: [
      "Beschreibe deiner Führungskraft eine typische Aufgabe.",
      "Vergleicht Tritt, Leiter und sicherere Alternativen.",
      "Beachtet Arbeitsstelle, Dauer, Werkzeug und Umgebung.",
      "Lasst die zuständige Person das geeignete Arbeitsmittel festlegen.",
    ],
  },
  {
    title: "Gefährliche Aufstellungen erkennen",
    description: "Ein guter Stand macht den Unterschied.",
    scene: 2,
    steps: [
      "Betrachte einen möglichen Aufstellort vom Boden.",
      "Suche lose Unterlagen, Unebenheiten und rutschige Stellen.",
      "Prüfe, ob Türen oder Verkehr die Leiter gefährden könnten.",
      "Besprich die nötigen Maßnahmen. Baue keine unsichere Situation nach.",
    ],
  },
  {
    title: "Die Umgebung kontrollieren",
    description: "Sicherheit beginnt um dich herum.",
    scene: 4,
    steps: [
      "Sieh dich vom Boden aus um.",
      "Achte auf Fahrwege, Türen und elektrische Gefahren.",
      "Überlege, ob Wetter oder andere Arbeiten gefährlich werden.",
      "Kläre offene Fragen mit der verantwortlichen Person vor Arbeitsbeginn.",
    ],
  },
  {
    title: "Einen Aufstellort im Foto beurteilen",
    description: "Beobachten, nachfragen und sicher entscheiden.",
    scene: 5,
    steps: [
      "Betrachte das Foto: Wo stehen die Füße? Was liegt hinter der Leiter?",
      "Beantworte die Praxisfrage zum Aufstellort.",
      "Lies die Erklärung und vergleiche sie mit deiner Beobachtung.",
      "Besprich einen ähnlichen Ort im Betrieb, ohne die gezeigte Situation nachzustellen.",
    ],
  },
];
export const sources = [
  {
    title: "DGUV Information 208-016",
    detail: "Die Verwendung von Leitern und Tritten · Ausgabe August 2022",
    url: "https://publikationen.dguv.de/widgets/pdf/download/article/450",
  },
  {
    title: "TRBS 2121 Teil 2",
    detail:
      "Gefährdung von Beschäftigten bei der Verwendung von Leitern · Ausgabe Dezember 2018",
    url: "https://www.baua.de/DE/Angebote/Regelwerk/TRBS/TRBS-2121-Teil-2",
  },
  {
    title: "DGUV: Verwendung und Sichtkontrolle",
    detail: "Offizielle Wiedergabe bei der BG BAU · Abschnitt 5",
    url: "https://www.bgbau-medien.de/handlungshilfen_gb/daten/dguv/208_016/5.htm",
  },
  {
    title: "DGUV: Umgang mit Schäden",
    detail: "Offizielle Wiedergabe bei der BG BAU · Abschnitt 7",
    url: "https://www.bgbau-medien.de/handlungshilfen_gb/daten/dguv/208_016/7.htm",
  },
];
export const photoExercise: Question = {
  situation: "Beobachtung am Aufstellort",
  question:
    "Im Praxisfoto steht die Leiter direkt vor einer Tür. Eine Matte liegt im Bereich der Füße. Was muss vor einem Einsatz geklärt werden?",
  options: [
    "Ob die Tür kurz geschlossen bleiben kann; die Matte ist im Innenraum unproblematisch.",
    "Ob Türbereich und Untergrund wirksam gesichert werden können; die Leiter bis dahin nicht benutzen.",
    "Ob eine zweite Person vor der Tür warten kann; eine weitere Kontrolle des Untergrunds ist dann unnötig.",
  ],
  correct: 1,
  explanation:
    "Die Tür kann die Leiter gefährden. Eine lose Matte kann verrutschen. Beide Punkte müssen vor der Benutzung geklärt werden. Zustand, Sicherungen und Eignung der Leiter lassen sich aus dem Foto nicht vollständig beurteilen.",
  feedback: [
    "Eine geschlossene Tür ist nicht automatisch gegen Öffnen gesichert. Auch die Matte muss geprüft werden.",
    "Du berücksichtigst beide erkennbaren Bedingungen und klärst sie vor Arbeitsbeginn.",
    "Ein Warnposten kann je nach Situation eine Maßnahme sein. Er behebt aber keinen unsicheren Untergrund.",
  ],
  scene: 5,
  source: "DGUV 208-016, Abschnitte 5.2 und 5.3",
};
