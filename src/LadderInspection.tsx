import { useEffect, useRef, useState } from "react";
import { Check, CheckCircle2, Info, RotateCcw, TriangleAlert } from "lucide-react";
import { ladderTypes, inspectionSources, inspectionState, type Finding, type Findings, type LadderKind } from "./inspection";

function LadderDrawing({ kind }: { kind: LadderKind }) {
  const leaning = kind === "anlege" || kind === "schiebe";
  const rungs = (left: number, right: number, top: number, bottom: number, count: number, lean = 0) =>
    Array.from({ length: count }, (_, i) => {
      const y = top + (bottom - top) * i / (count - 1);
      const offset = lean * (bottom - y) / (bottom - top);
      return <path key={i} d={`M ${left + offset} ${y} H ${right + offset}`} />;
    });
  return (
    <svg className="inspection-drawing" viewBox="0 0 360 480" role="img" aria-label={`Schematische Abbildung: ${ladderTypes.find(t => t.id === kind)!.name}`}>
      <path d="M 35 447 H 326" stroke="#cad8de" strokeWidth="2" />
      {leaning ? <>
        <path d="M 291 45 V 435" stroke="#d9e4eb" strokeWidth="12" />
        <g stroke="#5f7889" strokeWidth="10" strokeLinecap="round">
          {kind === "anlege" ? <>
            <path d="M 80 430 L 180 60 M 165 430 L 265 60" />
            {rungs(91, 176, 100, 391, 9, 79)}
          </> : <>
            <path d="M 75 430 L 137 202 M 165 430 L 227 202" />
            {rungs(85, 175, 239, 393, 5, 42)}
            <path d="M 133 265 L 190 55 M 216 265 L 273 55" stroke="#91a7b3" />
            {rungs(144, 227, 84, 224, 5, 38)}
            <path d="M 216 225 V 243 H 202 M 134 225 V 243 H 146" stroke="#23634e" strokeWidth="8" />
          </>}
        </g>
        <g fill="#142d46"><rect x="68" y="421" width="25" height="20" rx="4" /><rect x="153" y="421" width="25" height="20" rx="4" /></g>
        <path d="M 184 341 L 178 365" stroke="#ffc685" strokeWidth="15" />
      </> : <>
        <g strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d={kind === "steh" ? "M 204 133 L 292 431 M 166 133 L 253 431" : "M 220 75 L 309 430 M 177 75 L 266 430"} stroke="#9db0ba" strokeWidth="10" />
          {kind === "steh" ? <>
            <path d="M 78 430 L 120 139 M 210 430 V 139" stroke="#5f7889" strokeWidth="11" />
            {[190, 240, 290, 340, 390].map(y => <path key={y} d={`M ${78 + (430 - y) * 42 / 291} ${y} H 210`} stroke="#5f7889" strokeWidth="10" />)}
            <path d="M 123 139 V 80 Q 123 60 145 60 H 187 Q 210 60 210 80 V 139" stroke="#5f7889" strokeWidth="10" />
            <path d="M 208 270 H 247" stroke="#23634e" strokeWidth="7" />
            <rect x="112" y="127" width="112" height="17" rx="4" fill="#23634e" />
            <circle cx="212" cy="154" r="9" fill="#bdcbd2" stroke="#5f7889" strokeWidth="4" />
          </> : <>
            <path d="M 78 430 L 177 75 M 162 430 L 261 75" stroke="#5f7889" strokeWidth="10" />
            {rungs(90, 174, 113, 387, 8, 78)}
            {[{ x: 128, y: 251 }, { x: 212, y: 251 }, { x: 265, y: 251 }].map(p => <circle key={p.x} cx={p.x} cy={p.y} r="12" stroke="#23634e" strokeWidth="5" fill="#e5eeea" />)}
          </>}
        </g>
        <g fill="#142d46"><rect x="65" y="422" width="27" height="20" rx="4" /><rect x={kind === "steh" ? 198 : 149} y="422" width="27" height="20" rx="4" /><rect x={kind === "steh" ? 279 : 296} y="422" width="27" height="20" rx="4" /></g>
        <path d={kind === "steh" ? "M 210 345 V 372" : "M 182 344 L 175 370"} stroke="#ffc685" strokeWidth="14" />
      </>}
    </svg>
  );
}

const statusLabel = (value?: Finding) => value === "ok" ? "Angesehen" : value === "problem" ? "Problem" : value === "unsicher" ? "Unsicher" : "Offen";

export function LadderInspection({ hidden }: { hidden: boolean }) {
  const [kind, setKind] = useState<LadderKind | null>(null);
  const [activeId, setActiveId] = useState("holme");
  const [records, setRecords] = useState<Partial<Record<LadderKind, Findings>>>({});
  const [resetConfirm, setResetConfirm] = useState(false);
  const [focusRequest, setFocusRequest] = useState(0);
  const detailRef = useRef<HTMLHeadingElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<"detail" | "result">("detail");
  const type = ladderTypes.find(t => t.id === kind);
  const findings = kind ? records[kind] ?? {} : {};
  const state = type ? inspectionState(type, findings) : "offen";
  const active = type?.points.find(p => p.id === activeId) ?? type?.points[0];
  const activeIndex = type && active ? type.points.indexOf(active) : 0;
  const count = type?.points.filter(p => findings[p.id] === "ok").length ?? 0;
  useEffect(() => {
    if (!focusRequest) return;
    const target = pendingFocus.current === "result" ? resultRef.current : detailRef.current;
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [focusRequest]);
  const focus = (target: "detail" | "result") => {
    pendingFocus.current = target;
    setFocusRequest(n => n + 1);
  };
  function choosePoint(id: string) {
    setActiveId(id);
    focus("detail");
  }
  function record(finding: Finding) {
    if (!kind || !type || !active || state !== "offen") return;
    const updated = { ...findings, [active.id]: finding };
    setRecords(previous => ({ ...previous, [kind]: updated }));
    if (inspectionState(type, updated) !== "offen") {
      focus("result");
    } else {
      const remaining = [...type.points.slice(activeIndex + 1), ...type.points.slice(0, activeIndex + 1)].find(p => !updated[p.id]);
      if (remaining) setActiveId(remaining.id);
      focus("detail");
    }
  }
  if (hidden) return null;
  return (
    <section className="inspection" aria-label="Leitertypen und Prüfstellen">
      <div className="inspection-intro">
        <span className="eyebrow">BAUART ERKENNEN</span>
        <h2>Welche Leiter möchtest du ansehen?</h2>
        <p>Wähle den Typ deiner Leiter. Tippe danach auf die Punkte im Bild oder auf eine Prüfstelle in der Liste.</p>
      </div>
      <div className="ladder-types" role="group" aria-label="Leitertyp auswählen">
        {ladderTypes.map(t => <button key={t.id} className={`ladder-type ${kind === t.id ? "selected" : ""}`} aria-pressed={kind === t.id} onClick={() => { setKind(t.id); setActiveId(t.points[0].id); setResetConfirm(false); }}>
          <span className="ladder-type-picture" aria-hidden="true"><LadderDrawing kind={t.id} /></span>
          <span><strong>{t.name}</strong><small>{t.description}</small></span>
          {kind === t.id && <CheckCircle2 size={20} aria-hidden="true" />}
        </button>)}
      </div>
      {!type && <p className="inspection-choice-hint"><Info size={20} aria-hidden="true" /> Mit der Typauswahl werden Bild und passende Prüfstellen eingeblendet. Andere Bauarten: Herstelleranleitung heranziehen.</p>}
      {type && active && <>
        <div className="inspection-type-heading">
          <div><span className="eyebrow">DEINE AUSWAHL</span><h2>{type.name}</h2></div>
          <span className="inspection-count" aria-live="polite">{count} von {type.points.length} angesehen</span>
        </div>
        <p className="inspection-special">{type.special}</p>
        {state !== "offen" && <div ref={resultRef} tabIndex={-1} className={`inspection-result ${state === "stopp" ? "is-stop" : "is-reviewed"}`} role="status">
          {state === "stopp" ? <>
            <TriangleAlert size={26} aria-hidden="true" /><div><h3>Stopp. Leiter zunächst nicht benutzen.</h3><p>Bei {type.points.filter(p => findings[p.id] === "problem" || findings[p.id] === "unsicher").map(p => p.title).join(", ")} hast du ein Problem oder Unsicherheit angegeben. Verantwortliche oder fachkundige Person einbeziehen. Schäden klären lassen und die Leiter nach betrieblicher Vorgabe gegen Weiterbenutzung sichern.</p></div>
          </> : <>
            <CheckCircle2 size={26} aria-hidden="true" /><div><h3>Alle Prüfstellen angesehen.</h3><p>Du hast keine Auffälligkeiten angegeben. Das ist keine Einsatzfreigabe und keine dokumentierte wiederkehrende Prüfung. Anleitung und betriebliche Vorgaben gelten weiterhin.</p></div>
          </>}
        </div>}
        <div className="inspection-workspace">
          <div className="inspection-map-panel" ref={mapRef} tabIndex={-1} aria-label="Leiterabbildung mit Prüfstellen">
            <div className="inspection-map">
              <LadderDrawing kind={type.id} />
              {type.points.map((p, i) => <button key={p.id} className={`inspection-hotspot ${findings[p.id] ?? "open"}`} style={{ left: `${p.x / 360 * 100}%`, top: `${p.y / 480 * 100}%` }} aria-label={`Prüfstelle ${i + 1}: ${p.title} – ${statusLabel(findings[p.id])}`} aria-pressed={active.id === p.id} aria-controls="inspection-detail" onClick={() => choosePoint(p.id)}>{findings[p.id] === "ok" ? <Check size={20} aria-hidden="true" /> : i + 1}</button>)}
            </div>
            <p className="inspection-caption">Schematische Darstellung. Markierungen zeigen Bauteilbereiche, keine Schäden. Je nach Modell können Teile anders aussehen oder angeordnet sein.</p>
            <div className="inspection-point-list" role="group" aria-label="Alle Prüfstellen">
              {type.points.map((p, i) => <button key={p.id} aria-pressed={active.id === p.id} aria-controls="inspection-detail" onClick={() => choosePoint(p.id)}><span className="point-number">{i + 1}</span><span>{p.title}<small>{statusLabel(findings[p.id])}</small></span></button>)}
            </div>
          </div>
          <section className="inspection-detail" id="inspection-detail" aria-labelledby="inspection-point-heading">
            <span className="eyebrow">PRÜFSTELLE {activeIndex + 1} VON {type.points.length}</span>
            <h3 id="inspection-point-heading" tabIndex={-1} ref={detailRef}>{active.title}</h3>
            <p className="inspection-detail-lead">Das schaust du dir an deiner Leiter an:</p>
            <ul>{active.checks.map(check => <li key={check}>{check}</li>)}</ul>
            <button className="text-button" onClick={() => { mapRef.current?.focus({ preventScroll: true }); mapRef.current?.scrollIntoView({ block: "start", behavior: "instant" }); }}>Zur Leiterabbildung</button>
            <p className="inspection-ground-note">Vom sicheren Boden aus kontrollieren. Keine Belastungsproben und keine Demontage. Funktionskontrollen nur im Rahmen der Anleitung.</p>
            {state === "offen" ? <>
              <p className="inspection-answer-hint">Deine Antwort bezieht sich auf die Leiter vor Ort. „Keine Auffälligkeit“ führt zur nächsten offenen Prüfstelle.</p>
              <div className="answers">
                <button className="answer check-answer c0" onClick={() => record("ok")}><CheckCircle2 size={21} />Keine Auffälligkeit</button>
                <button className="answer check-answer c1" onClick={() => record("problem")}><TriangleAlert size={21} />Problem erkannt</button>
                <button className="answer check-answer c2" onClick={() => record("unsicher")}><Info size={21} />Ich bin unsicher</button>
              </div>
            </> : <p className="inspection-answer-hint">Die Hinweise bleiben zum Nachlesen anklickbar. Für eine neue Kontrolle bitte neu beginnen.</p>}
          </section>
        </div>
        <div className="inspection-reset">
          <p>Angaben bleiben nur während dieser geöffneten App erhalten. Jede Bauart hat ihren eigenen Kontrollstand.</p>
          {!resetConfirm ? <button className="secondary" disabled={!Object.keys(findings).length} onClick={() => setResetConfirm(true)}><RotateCcw size={18} />Diese Kontrolle neu beginnen</button> : <div className="feedback warning"><div><p>Angaben für „{type.name}“ löschen und neu beginnen?</p><div className="card-actions"><button className="secondary" onClick={() => setResetConfirm(false)}>Abbrechen</button><button className="primary" onClick={() => { setRecords(previous => ({ ...previous, [type.id]: {} })); setActiveId(type.points[0].id); setResetConfirm(false); focus("detail"); }}>Neu beginnen</button></div></div></div>}
        </div>
      </>}
      <details className="inspection-sources"><summary>Sichtkontrolle und betriebliche Prüfung unterscheiden</summary><p>Diese Lernhilfe unterstützt die Sichtkontrolle vor der Verwendung. Die wiederkehrende Sicht- und Funktionsprüfung erfordert eine vom Betrieb festgelegte Prüferperson, Umfang und Frist sowie die entsprechende Dokumentation. Die App stellt kein Prüfprotokoll und keine Prüfplakette aus.</p><p>Vereinfachte Hinweise nach DGUV Information 208-016. Quellenabgleich: 21.11.2026. Die konkrete Bauart und ihre Herstelleranleitung sind maßgeblich.</p>{inspectionSources.map(s => <a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.title}</a>)}</details>
    </section>
  );
}
