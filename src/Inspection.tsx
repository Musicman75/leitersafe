import { useEffect, useReducer, useRef, useState } from "react";
import {
  CheckCircle2,
  CircleHelp,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { LadderDiagram } from "./LadderDiagram";
import {
  getInspectionItems,
  inspectionReducer,
  ladderKinds,
  variants,
  type LadderKind,
  type Material,
  type Variant,
} from "./inspection";
export function Inspection({ active }: { active: boolean }) {
  const [session, dispatch] = useReducer(inspectionReducer, {
    config: null,
    answers: [],
  });
  const [kind, setKind] = useState<LadderKind | "">("");
  const [variant, setVariant] = useState<Variant | "">("");
  const [material, setMaterial] = useState<Material | "">("");
  const [unsupported, setUnsupported] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const items = session.config ? getInspectionItems(session.config) : [];
  const stopped = session.answers.some((a) => a !== 0);
  const done =
    !!session.config && !stopped && session.answers.length === items.length;
  const current = items[session.answers.length];
  useEffect(() => {
    if (active) {
      window.scrollTo(0, 0);
      heading.current?.focus({ preventScroll: true });
    }
  }, [
    active,
    session.answers.length,
    session.config,
    unsupported,
    kind,
    variant,
    material,
  ]);
  function reset() {
    dispatch({ type: "reset" });
    setUnsupported(false);
    setConfirmed(false);
    setKind("");
    setVariant("");
    setMaterial("");
  }
  return (
    <section
      className="inspection"
      hidden={!active}
      aria-label="Kontrolle vor der Benutzung"
    >
      <div className="page-heading">
        <span className="eyebrow">Vor jeder Benutzung</span>
        <h1>Dein Leitercheck</h1>
        <p>
          Wähle die Ausführung. Kontrolliere dann einen Bereich nach dem
          anderen.
        </p>
      </div>
      {!session.config ? (
        <>
          {unsupported ? (
            <section className="panel">
              <h2 ref={heading} tabIndex={-1}>
                Ausführung zuerst klären
              </h2>
              <div className="feedback warning">
                <CircleHelp />
                <p>
                  Diese Ausführung ist noch nicht abgedeckt oder nicht sicher
                  erkannt. Kläre Typ, Ausstattung und die passende
                  Herstelleranleitung mit einer zuständigen Person. Aus diesem
                  Check ergibt sich keine Aussage zum Zustand oder zur Eignung.
                </p>
              </div>
              <button className="secondary" onClick={reset}>
                Zur Auswahl
              </button>
            </section>
          ) : (
            <section className="panel selector-panel">
              <h2 ref={heading} tabIndex={-1}>
                {!kind
                  ? "Welche Leiter oder welchen Tritt hast du?"
                  : !variant
                    ? "Welche Ausführung hast du?"
                    : !material
                      ? "Aus welchem Werkstoff besteht sie?"
                      : "Passt die Auswahl zu deiner Leiter?"}
              </h2>
              {!kind && (
                <div
                  className="type-grid"
                  role="group"
                  aria-label="Bauart auswählen"
                >
                  {ladderKinds.map((k) => (
                    <button
                      key={k.id}
                      className="type-option"
                      onClick={() => {
                        setKind(k.id);
                        setVariant(k.id === "leaning" ? "single" : "");
                        setMaterial("");
                        setConfirmed(false);
                        dispatch({ type: "reset" });
                      }}
                    >
                      <LadderDiagram kind={k.id} />
                      <strong>{k.title}</strong>
                      <span>{k.description}</span>
                    </button>
                  ))}
                </div>
              )}
              {!kind && (
                <button
                  className="text-button"
                  onClick={() => setUnsupported(true)}
                >
                  Anderer Typ oder ich bin unsicher
                </button>
              )}
              {kind && (
                <div className="configuration">
                  <div className="inspection-meta">
                    <span>
                      {ladderKinds.find((k) => k.id === kind)?.title}
                      {variant
                        ? ` · ${variants[kind].find((v) => v.id === variant)?.title}`
                        : ""}
                      {material
                        ? ` · ${{ metal: "Metall", wood: "Holz", composite: "Kunststoff / Faserverbund" }[material]}`
                        : ""}
                    </span>
                    <button className="text-button" onClick={reset}>
                      Auswahl ändern
                    </button>
                  </div>
                  {!variant && (
                    <fieldset>
                      <legend>Ausführung</legend>
                      {variants[kind].map((v) => (
                        <button
                          className="answer"
                          key={v.id}
                          onClick={() => {
                            setVariant(v.id);
                            setConfirmed(false);
                          }}
                        >
                          {v.title}
                        </button>
                      ))}
                    </fieldset>
                  )}
                  {variant && !material && (
                    <fieldset>
                      <legend>Werkstoff der tragenden Teile</legend>
                      {(
                        [
                          {
                            id: "metal",
                            title: "Metall (z. B. Aluminium oder Stahl)",
                          },
                          { id: "wood", title: "Holz" },
                          {
                            id: "composite",
                            title: "Kunststoff / Faserverbund",
                          },
                        ] as const
                      ).map((m) => (
                        <button
                          className="answer"
                          key={m.id}
                          onClick={() => setMaterial(m.id)}
                        >
                          {m.title}
                        </button>
                      ))}
                      <button
                        className="text-button"
                        onClick={() => setUnsupported(true)}
                      >
                        Werkstoff nicht sicher erkannt
                      </button>
                    </fieldset>
                  )}
                  {variant && material && (
                    <>
                      <div className="feedback warning">
                        <TriangleAlert />
                        <p>
                          Die Bilder sind schematisch. Mehrzweck-, Schiebe-,
                          Gelenk-, Teleskop- und Podestleitern sowie
                          Sonderausstattungen wie Rollen oder verstellbare Füße
                          sind hier noch nicht abgedeckt.
                        </p>
                      </div>
                      <label className="task-check">
                        <input
                          type="checkbox"
                          checked={confirmed}
                          onChange={(e) => setConfirmed(e.target.checked)}
                        />
                        Die Auswahl passt zu meiner Leiter. Ihre
                        Herstelleranleitung und die betrieblichen Vorgaben sind
                        bekannt; nicht abgedeckte Sonderausstattung ist nicht
                        vorhanden.
                      </label>
                      <button
                        className="primary"
                        disabled={!kind || !variant || !material || !confirmed}
                        onClick={() => {
                          if (kind && variant && material)
                            dispatch({
                              type: "configure",
                              config: { kind, variant, material },
                            });
                        }}
                      >
                        Kontrolle beginnen
                      </button>
                    </>
                  )}
                </div>
              )}
            </section>
          )}
        </>
      ) : (
        <section className="panel inspection-panel">
          <div className="inspection-meta">
            <span>
              {ladderKinds.find((k) => k.id === session.config?.kind)?.title} ·{" "}
              {
                variants[session.config.kind].find(
                  (v) => v.id === session.config?.variant,
                )?.title
              }
            </span>
            <button className="text-button" onClick={reset}>
              Auswahl ändern / neu beginnen
            </button>
          </div>
          {stopped ? (
            <>
              <TriangleAlert className="inspection-stop" size={36} />
              <h2 ref={heading} tabIndex={-1}>
                Stopp. Zunächst nicht benutzen.
              </h2>
              <p>
                {session.answers.at(-1) === 1
                  ? "Du hast einen Mangel erkannt."
                  : "Eine Angabe ist unklar. Kläre den Punkt vor der Benutzung."}
              </p>
              <div className="feedback danger">
                <p>
                  Betroffener Bereich:{" "}
                  <strong>{items[session.answers.length - 1].title}</strong>.
                  Informiere eine verantwortliche oder fachkundige Person. Bei
                  einem Mangel die Leiter nach betrieblicher Vorgabe gegen
                  Weiterbenutzung sichern. Keine Belastungsprobe und keine
                  eigenmächtige Reparatur.
                </p>
              </div>
              <button className="secondary" onClick={reset}>
                <RotateCcw size={18} />
                Neue Kontrolle beginnen
              </button>
            </>
          ) : done ? (
            <>
              <CheckCircle2 size={36} className="green" />
              <h2 ref={heading} tabIndex={-1}>
                Kontrolle durchlaufen
              </h2>
              <p>
                Du hast bei {items.length} Punkten keine Auffälligkeiten
                angegeben.
              </p>
              <div className="feedback warning">
                <p>
                  Das ist keine Einsatzfreigabe und kein Prüfprotokoll.
                  Herstelleranleitung, betriebliche Schutzmaßnahmen und
                  erforderliche Prüfungen gelten weiterhin. Bei neuen Schäden
                  oder Zweifeln erneut klären.
                </p>
              </div>
              <button className="primary" onClick={reset}>
                Neue Kontrolle beginnen
              </button>
            </>
          ) : (
            <>
              <div className="inspection-step">
                <span className="eyebrow">
                  {current.area === "setup"
                    ? "Einsatzbedingungen"
                    : "Zustand und Ausstattung"}
                </span>
                <span>
                  {session.answers.length + 1} von {items.length}
                </span>
              </div>
              <div className="progress-track">
                <span
                  style={{
                    width: `${(session.answers.length / items.length) * 100}%`,
                  }}
                />
              </div>
              <div className="inspection-content">
                <figure>
                  <LadderDiagram
                    kind={session.config.kind}
                    area={current.area}
                    platform={session.config.variant === "platform"}
                  />
                  <figcaption>
                    Schematische Orientierung · markierter Bereich
                  </figcaption>
                </figure>
                <div>
                  <h2 ref={heading} tabIndex={-1}>
                    {current.title}
                  </h2>
                  <p>{current.question}</p>
                  <details className="inspection-help">
                    <summary>Worauf muss ich achten?</summary>
                    <p>{current.hint}</p>
                    <small>
                      Grundlage: {current.source}. Die konkrete
                      Herstelleranleitung ist zusätzlich maßgeblich.
                    </small>
                  </details>
                </div>
              </div>
              <div className="answers inspection-answers">
                {[
                  { title: "Keine Auffälligkeit", icon: CheckCircle2 },
                  {
                    title: "Mangel / Bedingung nicht erfüllt",
                    icon: TriangleAlert,
                  },
                  { title: "Ich bin unsicher", icon: CircleHelp },
                ].map((a, i) => (
                  <button
                    key={a.title}
                    className={`answer check-answer c${i}`}
                    onClick={() => dispatch({ type: "answer", value: i })}
                  >
                    <a.icon size={21} />
                    {a.title}
                  </button>
                ))}
              </div>
              {session.answers.length > 0 && (
                <button
                  className="text-button"
                  onClick={() => dispatch({ type: "back" })}
                >
                  Vorheriger Punkt
                </button>
              )}
            </>
          )}
        </section>
      )}
      <p className="inspection-note">
        Lernhilfe zur Kontrolle vor der Benutzung. Keine wiederkehrende Prüfung
        durch eine befähigte Person. Keine Aufstiege oder Belastungsproben für
        diesen Check. Ergebnisse werden nicht gespeichert.
      </p>
    </section>
  );
}
