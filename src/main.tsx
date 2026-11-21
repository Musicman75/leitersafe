import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Home,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Footprints,
  ShieldCheck,
  Info,
  Check,
  ChevronRight,
  ChevronLeft,
  Clock,
  LockKeyhole,
  TriangleAlert,
  X,
  RotateCcw,
  Lightbulb,
  Flag,
  CheckCircle2,
  HardHat,
} from "lucide-react";
import {
  lessons,
  questions,
  checkItems,
  practices,
  sources,
  photoExercise,
  type Question,
} from "./content";
import { LadderPhoto, PhotoCredits } from "./LadderPhoto";
import { readProgress, emptyProgress } from "./progress";
import { getCheckState } from "./check";
import { LadderInspection } from "./LadderInspection";
import "./style.css";
type Page = "start" | "schulung" | "praxis" | "check" | "pruefung" | "quiz" | "info";
const navigation = [
  { id: "start", label: "Startseite", shortLabel: "Start", icon: Home },
  { id: "schulung", label: "Schulung", shortLabel: "Lernen", icon: BookOpen },
  { id: "praxis", label: "Praxisübungen", shortLabel: "Praxis", icon: Footprints },
  { id: "check", label: "Sicherheitscheck", shortLabel: "Check", icon: ClipboardCheck },
  { id: "quiz", label: "Wissenstest", shortLabel: "Test", icon: GraduationCap },
] as const;
function QuestionCard({
  q,
  onAnswered,
  initialAnswer,
}: {
  q: Question;
  onAnswered?: (correct: boolean, answerIndex: number) => void;
  initialAnswer?: number;
}) {
  const [selected, setSelected] = useState<number | null>(
    initialAnswer ?? null,
  );
  const [answer, setAnswer] = useState<number | null>(initialAnswer ?? null);
  return (
    <div className="question">
      <span className="scenario-label">{q.situation}</span>
      <h3>{q.question}</h3>
      <p className="answer-instruction">
        Wähle die Antwort, die am besten passt.
      </p>
      <div className="answers">
        {q.options.map((option, i) => (
          <button
            key={option}
            disabled={answer !== null}
            aria-pressed={selected === i}
            className={`answer ${selected === i ? "selected" : ""} ${answer !== null && i === q.correct ? "correct" : ""} ${answer === i && i !== q.correct ? "incorrect" : ""}`}
            onClick={() => setSelected(i)}
          >
            <span className="radio">
              {answer !== null && i === q.correct ? (
                <Check size={17} />
              ) : (
                String.fromCharCode(65 + i)
              )}
            </span>
            {option}
          </button>
        ))}
      </div>
      {answer === null ? (
        <button
          className="primary"
          disabled={selected === null}
          onClick={() => {
            if (selected !== null) {
              setAnswer(selected);
              onAnswered?.(selected === q.correct, selected);
            }
          }}
        >
          Antwort prüfen
        </button>
      ) : (
        <div
          className={`feedback ${answer === q.correct ? "positive" : "warning"}`}
          role="status"
        >
          <strong>
            {answer === q.correct
              ? "Sicher entschieden."
              : "Diese Entscheidung reicht für die Sicherheit nicht aus."}
          </strong>
          <p>{q.feedback[answer]}</p>
          <p>{q.explanation}</p>
          <small>Grundlage: {q.source}</small>
        </div>
      )}
    </div>
  );
}
function App() {
  const [page, setPage] = useState<Page>(() => {
    const hash = location.hash.slice(1);
    return ["start", "schulung", "praxis", "check", "pruefung", "quiz", "info"].includes(
      hash,
    )
      ? (hash as Page)
      : "start";
  });
  const [progress, setProgress] = useState(readProgress);
  const [storageError, setStorageError] = useState(false);
  const [lesson, setLesson] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [lessonAnswered, setLessonAnswered] = useState(false);
  const [practice, setPractice] = useState<number | null>(null);
  const [practiceSteps, setPracticeSteps] = useState<number[]>([]);
  const [photoCorrect, setPhotoCorrect] = useState(false);
  const [photoAttempt, setPhotoAttempt] = useState(0);
  const [checkAnswers, setCheckAnswers] = useState<number[]>([]);
  const checkPanelRef = useRef<HTMLElement>(null);
  const previousCheckAnswers = useRef(checkAnswers);
  useEffect(() => {
    if (previousCheckAnswers.current === checkAnswers) return;
    previousCheckAnswers.current = checkAnswers;
    const panel = checkPanelRef.current;
    if (!panel) return;
    // Keep the changed question/result visible after answering near the page bottom.
    panel.querySelector<HTMLElement>("[data-check-heading]")?.focus({ preventScroll: true });
    panel.scrollIntoView({ block: "start", behavior: "instant" });
  }, [checkAnswers]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [resetConfirm, setResetConfirm] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem("leitersafe-v1", JSON.stringify(progress));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [progress]);
  useEffect(() => {
    const handler = () => {
      const h = location.hash.slice(1);
      if (["start", "schulung", "praxis", "check", "pruefung", "quiz", "info"].includes(h))
        setPage(h as Page);
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  function go(p: Page) {
    setPage(p);
    location.hash = p;
    setLesson(null);
    setPractice(null);
    window.scrollTo(0, 0);
  }
  const isNavActive = (id: string) => page === id || (id === "check" && page === "pruefung");
  function openLesson(i: number) {
    setLesson(i);
    setStep(0);
    setLessonAnswered(false);
    window.scrollTo(0, 0);
  }
  const pct = Math.round(
    (lessons.filter((l) => progress.completed.includes(l.id)).length /
      lessons.length) *
      100,
  );
  const current = lessons.findIndex((l) => !progress.completed.includes(l.id));
  const title = (eyebrow: string, heading: string, description: string) => (
    <div className="page-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{heading}</h1>
      <p>{description}</p>
    </div>
  );
  const lessonList = (home = false) => (
    <div className={`lesson-list ${home ? "home-lessons" : ""}`}>
      {lessons.map((l, i) => (
        <button
          className="lesson-row"
          key={l.id}
          onClick={() => {
            if (home) {
              go("schulung");
            }
            openLesson(i);
          }}
        >
          <span
            className={`lesson-number ${progress.completed.includes(l.id) ? "done" : ""}`}
          >
            {progress.completed.includes(l.id) ? (
              <Check size={20} />
            ) : (
              String(i + 1).padStart(2, "0")
            )}
          </span>
          <div>
            <strong>{l.title}</strong>
            <span>{l.short}</span>
          </div>
          <span className="lesson-time">
            <Clock size={14} />
            3–5 Min.
          </span>
          <ChevronRight size={19} />
        </button>
      ))}
    </div>
  );
  return (
    <>
      <a className="skip-link" href="#main">
        Zum Inhalt
      </a>
      <aside className="sidebar">
        <a className="brand" href="#start" onClick={() => go("start")}>
          <span className="brand-mark">
            <span />
            <span />
            <span />
          </span>
          <span>
            Leiter<span className="brand-safe">Safe</span>
            <small>SICHERHEIT, STUFE FÜR STUFE.</small>
          </span>
        </a>
        <div className="nav-caption">DEIN LERNBEREICH</div>
        <nav aria-label="Hauptnavigation">
          {navigation.map((n) => (
            <button
              key={n.id}
              className={isNavActive(n.id) ? "active" : ""}
              aria-current={isNavActive(n.id) ? "page" : undefined}
              onClick={() => go(n.id)}
            >
              <n.icon size={20} />
              {n.label}
              {isNavActive(n.id) && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <ShieldCheck size={24} />
            <strong>Deine Sicherheit zählt.</strong>
            <p>Ein kurzer Check kann einen großen Unterschied machen.</p>
          </div>
          <button
            className={page === "info" ? "info-link selected" : "info-link"}
            onClick={() => go("info")}
          >
            <Info size={18} />
            Informationen & Quellen
          </button>
          <div className="local-note">
            <LockKeyhole size={13} />
            Dein Fortschritt bleibt bei dir.
          </div>
        </div>
      </aside>
      <div className="app-shell">
        <header className="topbar">
          <a className="mobile-brand" href="#start" onClick={() => go("start")} aria-label="LeiterSafe – Startseite">
            Leiter<span>Safe</span>
          </a>
          <span>Sicher arbeiten mit Leitern und Tritten</span>
          <button className="mobile-info" aria-current={page === "info" ? "page" : undefined} onClick={() => go("info")}>
            <Info size={20} aria-hidden="true" />
            Quellen
          </button>
          <div className="topbar-right">
            <span className="prototype">Lern-App</span>
            <span className="profile">
              <HardHat size={20} />
            </span>
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          {storageError && (
            <div className="feedback warning" role="status">
              Der Browser kann deinen Fortschritt gerade nicht speichern. Er
              bleibt nur in dieser Sitzung erhalten.
            </div>
          )}
          {page === "start" && (
            <>
              <div className="welcome-line">
                <span className="eyebrow">
                  <span className="small-line" /> WILLKOMMEN BEI LEITERSAFE
                </span>
                <span className="desktop-only">
                  Einfach lernen. Sicher handeln.
                </span>
              </div>
              <section className="hero">
                <div className="hero-copy">
                  <span className="pill">
                    <ShieldCheck size={15} />
                    MEHR SICHERHEIT IM ARBEITSALLTAG
                  </span>
                  <h1>
                    Sicher auf
                    <br />
                    jeder Stufe<span>.</span>
                  </h1>
                  <p>
                    Ob im Lager, in der Werkstatt oder im Büro:
                    <br className="desktop-only" /> Lerne, wie du Leitern und
                    Tritte sicher benutzt.
                  </p>
                  <button
                    className="primary"
                    onClick={() => {
                      go("schulung");
                      openLesson(current < 0 ? 0 : current);
                    }}
                  >
                    <BookOpen size={19} />
                    {pct > 0 && pct < 100
                      ? "Schulung fortsetzen"
                      : "Schulung starten"}
                  </button>
                  <div className="hero-meta">
                    <span>
                      <Clock size={14} />5 kurze Einheiten
                    </span>
                    <span>
                      <CheckCircle2 size={14} />
                      In deinem Tempo
                    </span>
                  </div>
                </div>
                <LadderPhoto hero />
              </section>
              <div className="quick-grid">
                <button className="quick-card" onClick={() => go("check")}>
                  <span className="icon-box amber">
                    <ClipboardCheck size={25} />
                  </span>
                  <div>
                    <h2>Leiter sicher prüfen</h2>
                    <p>Schritt für Schritt vor der Benutzung.</p>
                  </div>
                  <ChevronRight size={22} />
                </button>
                <button className="quick-card" onClick={() => go("quiz")}>
                  <span className="icon-box lilac">
                    <GraduationCap size={27} />
                  </span>
                  <div>
                    <h2>Wissen testen</h2>
                    <p>10 Fragen aus deinem Arbeitsalltag.</p>
                  </div>
                  <ChevronRight size={22} />
                </button>
              </div>
              <section className="progress-card">
                <div className="progress-icon">
                  <Flag size={23} />
                </div>
                <div className="progress-copy">
                  <div>
                    <h2>Dein Lernfortschritt</h2>
                    <strong>
                      {pct}
                      <small> %</small>
                    </strong>
                  </div>
                  <div
                    className="progress-track"
                    role="progressbar"
                    aria-label="Lernfortschritt"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <span style={{ width: pct + "%" }} />
                  </div>
                  <p>
                    {
                      lessons.filter((l) => progress.completed.includes(l.id))
                        .length
                    }{" "}
                    von {lessons.length} Einheiten abgeschlossen{" "}
                    <span>
                      {pct === 100
                        ? "Gut gemacht! Wiederholen hält dein Wissen frisch."
                        : "Jede Einheit bringt dich einen Schritt weiter."}
                    </span>
                  </p>
                </div>
              </section>
              <div className="home-bottom">
                <section>
                  <div className="section-heading">
                    <div>
                      <span className="eyebrow">
                        DEIN WEG ZU MEHR SICHERHEIT
                      </span>
                      <h2>Fünf Schritte zu sicherem Arbeiten.</h2>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => go("schulung")}
                    >
                      Alle Einheiten <ChevronRight size={16} />
                    </button>
                  </div>
                  {lessonList(true)}
                </section>
                <aside className="daily-tip">
                  <span className="tip-icon">
                    <Lightbulb size={23} />
                  </span>
                  <span className="eyebrow">VOR ARBEITSBEGINN</span>
                  <h2>
                    Erst prüfen.
                    <br />
                    Dann benutzen.
                  </h2>
                  <p>
                    Auch eine kleine Beschädigung kann gefährlich werden. Schau
                    deshalb vor jeder Benutzung genau hin.
                  </p>
                  <div className="tip-rule" />
                  <button className="text-button" onClick={() => go("praxis")}>
                    Jetzt praktisch üben <ChevronRight size={16} />
                  </button>
                </aside>
              </div>
            </>
          )}
          {page === "schulung" &&
            (lesson === null ? (
              <>
                {title(
                  "SCHRITT FÜR SCHRITT",
                  "Deine Schulung",
                  "Fünf kurze Einheiten. Verständlich erklärt und direkt im Alltag anwendbar.",
                )}
                <div className="method-bar">
                  Anschauen <ChevronRight /> Verstehen <ChevronRight />{" "}
                  Entscheiden <ChevronRight /> Ausprobieren
                </div>
                {lessonList()}
              </>
            ) : (
              <>
                <button className="back" onClick={() => setLesson(null)}>
                  <ChevronLeft size={18} />
                  Alle Einheiten
                </button>
                {title(
                  `EINHEIT ${lesson + 1} VON ${lessons.length} · 3–5 MINUTEN`,
                  lessons[lesson].title,
                  lessons[lesson].short,
                )}
                <div className="learning-steps">
                  {[
                    "Anschauen",
                    "Verstehen",
                    "Entscheiden",
                    "Ausprobieren",
                  ].map((s, i) => (
                    <span
                      key={s}
                      className={
                        step === i ? "current" : step > i ? "finished" : ""
                      }
                    >
                      {step > i ? <Check size={15} /> : i + 1} {s}
                    </span>
                  ))}
                </div>
                <section className="learning-card">
                  <LadderPhoto scene={lesson} />
                  <div className="learning-body">
                    {step === 0 && (
                      <>
                        <span className="eyebrow">ANSCHAUEN</span>
                        <h2>{lessons[lesson].short}</h2>
                        <p>{lessons[lesson].text}</p>
                      </>
                    )}
                    {step === 1 && (
                      <>
                        <span className="eyebrow">AUS DEM ARBEITSALLTAG</span>
                        <h2>So kann es dir begegnen.</h2>
                        <p>{lessons[lesson].example}</p>
                        <div className="feedback positive">
                          <Lightbulb size={20} /> Merke dir:{" "}
                          {lessons[lesson].text}
                        </div>
                      </>
                    )}
                    {step === 2 && (
                      <QuestionCard
                        key={lessons[lesson].id}
                        q={lessons[lesson].question}
                        onAnswered={() => setLessonAnswered(true)}
                      />
                    )}{" "}
                    {step === 3 && (
                      <>
                        <span className="eyebrow">DEINE PRAXISAUFGABE</span>
                        <h2>Jetzt bist du dran.</h2>
                        <p>{lessons[lesson].practice}</p>
                        <div className="feedback warning">
                          <TriangleAlert size={20} />
                          <div>
                            Nur vom sicheren Boden aus und unter geeigneten
                            betrieblichen Bedingungen üben. Keine Aufstiege und
                            keine Gefahr nachstellen.
                          </div>
                        </div>
                        <label className="task-check">
                          <input
                            type="checkbox"
                            checked={lessonAnswered}
                            onChange={(e) =>
                              setLessonAnswered(e.target.checked)
                            }
                          />
                          Ich habe die Aufgabe sicher durchgeführt und offene
                          Fragen geklärt.
                        </label>
                      </>
                    )}
                    <div className="card-actions">
                      <button
                        className="secondary"
                        disabled={step === 0}
                        onClick={() => {
                          setStep(step - 1);
                          setLessonAnswered(false);
                        }}
                      >
                        Zurück
                      </button>
                      <button
                        className="primary"
                        disabled={(step === 2 || step === 3) && !lessonAnswered}
                        onClick={() => {
                          if (step < 3) {
                            setStep(step + 1);
                            setLessonAnswered(false);
                          } else {
                            setProgress((p) => ({
                              ...p,
                              completed: [
                                ...new Set([
                                  ...p.completed,
                                  lessons[lesson].id,
                                ]),
                              ],
                            }));
                            setLesson(null);
                          }
                        }}
                      >
                        {step === 3 ? "Einheit abschließen" : "Weiter"}
                      </button>
                    </div>
                    {step === 2 && !lessonAnswered && (
                      <p className="fine-print">
                        Beantworte die Frage und lies die Rückmeldung. Danach
                        geht es weiter.
                      </p>
                    )}
                    {step === 2 && !lessonAnswered && (
                      <button
                        className="text-button"
                        onClick={() => {
                          setStep(1);
                        }}
                      >
                        Erklärung noch einmal ansehen
                      </button>
                    )}
                    <p className="source-note">
                      Grundlage: {lessons[lesson].source}
                    </p>
                  </div>
                </section>
              </>
            ))}
          {page === "praxis" && (
            <>
              {title(
                "VOM WISSEN INS HANDELN",
                "Sicherheit praktisch üben.",
                "Kurze Aufgaben für deinen Arbeitsplatz. Du bleibst dabei auf dem Boden.",
              )}
              <div className="feedback warning">
                <ShieldCheck />
                <p>
                  Übe nur unter geeigneten Bedingungen. Bei Unsicherheit hilft
                  eine verantwortliche Person. Stelle niemals eine Gefahr nach.
                </p>
              </div>
              {practice === null ? (
                <div className="practice-grid">
                  {practices.map((p, i) => (
                    <button
                      className="practice-card"
                      key={p.title}
                      onClick={() => {
                        setPractice(i);
                        setPracticeSteps([]);
                        setPhotoCorrect(false);
                        setPhotoAttempt((v) => v + 1);
                      }}
                    >
                      <LadderPhoto scene={p.scene} />
                      <div>
                        <span className="eyebrow">
                          {progress.practices.includes(i)
                            ? "✓ BEREITS GEÜBT"
                            : "PRAXISAUFGABE"}
                        </span>
                        <h2>{p.title}</h2>
                        <p>{p.description}</p>
                        <span className="text-button">
                          Übung öffnen <ChevronRight size={16} />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <section className="panel">
                  <button className="back" onClick={() => setPractice(null)}>
                    <ChevronLeft size={18} />
                    Alle Übungen
                  </button>
                  <h2>{practices[practice].title}</h2>
                  <LadderPhoto scene={practices[practice].scene} />
                  {practices[practice].steps.map((s, i) => (
                    <label className="task-check" key={s}>
                      <input
                        type="checkbox"
                        checked={practiceSteps.includes(i)}
                        onChange={(e) =>
                          setPracticeSteps((v) =>
                            e.target.checked
                              ? [...v, i]
                              : v.filter((x) => x !== i),
                          )
                        }
                      />
                      <span>{s}</span>
                    </label>
                  ))}
                  {practice === 4 && (
                    <div className="photo-task">
                      <QuestionCard
                        key={photoAttempt}
                        q={photoExercise}
                        onAnswered={setPhotoCorrect}
                      />
                      {!photoCorrect && (
                        <button
                          className="text-button"
                          onClick={() => setPhotoAttempt((v) => v + 1)}
                        >
                          Praxisfrage neu beantworten
                        </button>
                      )}
                    </div>
                  )}
                  <button
                    className="primary"
                    disabled={
                      practiceSteps.length !== 4 ||
                      (practice === 4 && !photoCorrect)
                    }
                    onClick={() => {
                      setProgress((p) => ({
                        ...p,
                        practices: [...new Set([...p.practices, practice])],
                      }));
                      setPractice(null);
                    }}
                  >
                    Übung als erledigt speichern
                  </button>
                </section>
              )}
            </>
          )}
          {(page === "check" || page === "pruefung") && (
            <>
              {title("LEITER KENNEN. SICHER HANDELN.", page === "pruefung" ? "Prüfstellen an deiner Leiter." : "Dein Sicherheitscheck.", "Wähle eine Bauart und entdecke ihre Prüfstellen oder durchlaufe den allgemeinen Sicherheitscheck.")}
              <nav className="check-sections" aria-label="Bereiche der Leiterkontrolle">
                <a href="#check" aria-current={page === "check" ? "page" : undefined} onClick={event => { event.preventDefault(); go("check"); }}>Sicherheitscheck</a>
                <a href="#pruefung" aria-current={page === "pruefung" ? "page" : undefined} onClick={event => { event.preventDefault(); go("pruefung"); }}>Leitertyp & Prüfstellen</a>
              </nav>
              <div className="notice"><Info size={20} aria-hidden="true" /><p>Sichtkontrolle vor der Benutzung: Bei Schäden oder Unsicherheit zunächst nicht benutzen und fachkundig klären lassen. Keine Einsatzfreigabe und kein Ersatz für die wiederkehrende betriebliche Prüfung.</p></div>
            </>
          )}
          <LadderInspection hidden={page !== "pruefung"} />
          {page === "check" && (
            <>
              <section className="panel check-panel" ref={checkPanelRef} aria-labelledby="check-heading">
                {getCheckState(checkAnswers, checkItems.length) === "stop" ? (
                  <>
                    <span className="danger-icon">
                      <X size={30} />
                    </span>
                    <h2 id="check-heading" data-check-heading tabIndex={-1}>Stopp. Leiter zunächst nicht benutzen.</h2>
                    <p>
                      {checkAnswers.at(-1) === 1
                        ? "Du hast ein Problem erkannt."
                        : "Du bist unsicher. Das ist ein guter Grund, nachzufragen."}
                    </p>
                    <div className="feedback danger">
                      Beziehe eine verantwortliche oder fachkundige Person ein.
                      Auffällige Schäden müssen durch eine zur Prüfung befähigte
                      oder benannte Person geklärt werden. Sichere die Leiter
                      nach betrieblicher Vorgabe gegen Weiterbenutzung.
                    </div>
                    <button
                      className="secondary"
                      onClick={() => setCheckAnswers([])}
                    >
                      <RotateCcw size={17} />
                      Neuen Check beginnen
                    </button>
                  </>
                ) : getCheckState(checkAnswers, checkItems.length) ===
                  "reviewed" ? (
                  <>
                    <ShieldCheck size={40} className="green" />
                    <h2 id="check-heading" data-check-heading tabIndex={-1}>Sichtkontrolle durchlaufen.</h2>
                    <p>
                      Du hast keine Auffälligkeiten angegeben. Das ist keine
                      Freigabe zur Benutzung.
                    </p>
                    <div className="feedback warning">
                      Die betrieblichen Schutzmaßnahmen und die
                      Herstelleranleitung gelten weiterhin. Bei neuen Zweifeln:
                      nicht benutzen und nachfragen.
                    </div>
                    <button
                      className="primary"
                      onClick={() => setCheckAnswers([])}
                    >
                      Erneut prüfen
                    </button>
                  </>
                ) : (
                  <>
                    <span className="eyebrow" aria-live="polite" aria-atomic="true">
                      FRAGE {checkAnswers.length + 1} VON {checkItems.length}
                    </span>
                    <div className="progress-track" role="progressbar" aria-label="Beantwortete Prüffragen" aria-valuenow={checkAnswers.length} aria-valuemin={0} aria-valuemax={checkItems.length}>
                      <span
                        style={{
                          width:
                            (checkAnswers.length / checkItems.length) * 100 +
                            "%",
                        }}
                      />
                    </div>
                    <h2 id="check-heading" data-check-heading tabIndex={-1}>{checkItems[checkAnswers.length][0]}</h2>
                    <p>{checkItems[checkAnswers.length][1]}</p>
                    <LadderPhoto scene={[4, 4, 1, 5, 4][checkAnswers.length]} />
                    <p className="check-answer-hint">
                      {checkAnswers.length === checkItems.length - 1
                        ? "Mit „Alles in Ordnung“ schließt du den Check ab."
                        : "Mit „Alles in Ordnung“ geht es direkt zur nächsten Frage."}
                      {" "}Bei einem Problem oder Unsicherheit stoppt der Check.
                    </p>
                    <div className="answers">
                      {[
                        "Alles in Ordnung",
                        "Problem erkannt",
                        "Ich bin unsicher",
                      ].map((s, i) => (
                        <button
                          key={s}
                          className={`answer check-answer c${i}`}
                          onClick={() => setCheckAnswers((v) => [...v, i])}
                        >
                          {i === 0 ? (
                            <CheckCircle2 size={21} />
                          ) : i === 1 ? (
                            <TriangleAlert size={21} />
                          ) : (
                            <Info size={21} />
                          )}{" "}
                          {s}
                        </button>
                      ))}
                    </div>
                    {checkAnswers.length > 0 && (
                      <button
                        className="back"
                        onClick={() => setCheckAnswers((v) => v.slice(0, -1))}
                      >
                        <ChevronLeft size={16} />
                        Vorherige Frage
                      </button>
                    )}
                  </>
                )}
              </section>
            </>
          )}
          {page === "quiz" && (
            <>
              {title(
                "WAS WÜRDEST DU TUN?",
                "Sicher entscheiden im Arbeitsalltag.",
                "Zehn Situationen aus dem Betrieb. Entscheide, prüfe deine Antwort und lies die Begründung.",
              )}
              <section className="panel quiz-panel">
                {quizIndex === questions.length ? (
                  <>
                    <span className="icon-box sage">
                      <GraduationCap size={30} />
                    </span>
                    <h2>
                      {
                        quizAnswers.filter((a, i) => a === questions[i].correct)
                          .length
                      }{" "}
                      von {questions.length} richtig.
                    </h2>
                    <p>
                      {quizAnswers.every((a, i) => a === questions[i].correct)
                        ? "Sehr gut! Du hast alle Situationen sicher eingeschätzt."
                        : "Gut, dass du übst. Schau dir die Erklärungen zu den unsicheren Entscheidungen noch einmal an."}
                    </p>
                    <div className="review-list">
                      {questions.map((q, i) => (
                        <details key={q.question}>
                          <summary>
                            {quizAnswers[i] === q.correct ? (
                              <CheckCircle2 size={18} />
                            ) : (
                              <TriangleAlert size={18} />
                            )}{" "}
                            {q.question}
                          </summary>
                          <p>{q.explanation}</p>
                        </details>
                      ))}
                    </div>
                    <div className="notice">
                      Das Ergebnis ist eine Lernrückmeldung. Es ist kein
                      Unterweisungsnachweis.
                    </div>
                    <div className="card-actions">
                      <button
                        className="secondary"
                        onClick={() => {
                          setQuizIndex(0);
                          setQuizAnswers([]);
                        }}
                      >
                        Noch einmal testen
                      </button>
                      <button
                        className="primary"
                        onClick={() => go("schulung")}
                      >
                        Zur Schulung
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="section-heading">
                      <span className="eyebrow">
                        FRAGE {quizIndex + 1} VON {questions.length}
                      </span>
                      {progress.best !== null && (
                        <span className="fine-print">
                          Bestes Ergebnis: {progress.best}/10
                        </span>
                      )}
                    </div>
                    <div className="progress-track">
                      <span
                        style={{
                          width: (quizIndex / questions.length) * 100 + "%",
                        }}
                      />
                    </div>
                    {questions[quizIndex].showPhoto !== false && (
                      <LadderPhoto scene={questions[quizIndex].scene} />
                    )}
                    <QuestionCard
                      key={quizIndex}
                      q={questions[quizIndex]}
                      initialAnswer={quizAnswers[quizIndex]}
                      onAnswered={(_ok, choice) => {
                        setQuizAnswers((answers) => {
                          const next = [...answers];
                          next[quizIndex] = choice;
                          return next;
                        });
                      }}
                    />
                    {quizAnswers.length > quizIndex && (
                      <button
                        className="primary"
                        onClick={() => {
                          if (quizIndex === questions.length - 1) {
                            const score = quizAnswers.filter(
                              (a, i) => a === questions[i].correct,
                            ).length;
                            setProgress((p) => ({
                              ...p,
                              best: Math.max(p.best ?? 0, score),
                            }));
                          }
                          setQuizIndex((i) => i + 1);
                        }}
                      >
                        {quizIndex === questions.length - 1
                          ? "Ergebnis ansehen"
                          : "Nächste Frage"}
                      </button>
                    )}
                  </>
                )}
              </section>
            </>
          )}
          {page === "info" && (
            <>
              {title(
                "TRANSPARENT UND VERSTÄNDLICH",
                "Informationen & Quellen",
                "LeiterSafe unterstützt dich beim Lernen. Die Verantwortung im Betrieb bleibt bei den zuständigen Personen.",
              )}
              <section className="panel info-panel">
                <h2>Was die App leisten kann</h2>
                <p>
                  Dieser Prototyp vermittelt ausgewählte Grundlagen zu tragbaren
                  Leitern und Tritten. Er ersetzt keine Gefährdungsbeurteilung,
                  persönliche betriebliche Unterweisung, Herstelleranleitung
                  oder Prüfung durch befähigte Personen.
                </p>
                <div className="feedback warning">
                  <TriangleAlert />
                  <p>
                    Eine abgeschlossene digitale Schulung ist nicht automatisch
                    ein rechtssicherer Nachweis einer betrieblichen
                    Unterweisung. LeiterSafe stellt kein Zertifikat und keine
                    Einsatzfreigabe aus.
                  </p>
                </div>
                <h2>Fachliche Grundlagen</h2>
                <p>
                  Quellenabgleich: 21. November 2026. Die Lerntexte sind
                  vereinfachte, selbst formulierte Zusammenfassungen. Die
                  beschriebenen Situationen sind didaktische Beispiele. Die
                  Fotografien zeigen echte Leitern und einzelne Merkmale. Sie
                  sind keine vollständigen technischen Aufbauanleitungen.
                </p>
                {sources.map((s) => (
                  <a
                    className="source-link"
                    key={s.title}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <BookOpen size={21} />
                    <span>
                      <strong>{s.title}</strong>
                      <small>{s.detail}</small>
                    </span>
                    <ChevronRight size={18} />
                  </a>
                ))}
                <p>
                  Wichtige Fundstellen: DGUV Abschnitte 2–3 (Auswahl), 5
                  (Benutzung und Sichtkontrolle), 6–7 (Prüfung und Mängel). TRBS
                  Abschnitte 3–4 (Beurteilung und Schutzmaßnahmen). Die TRBS
                  bezieht sich auf Leitern; für Tritte gelten die einschlägigen
                  betrieblichen Vorgaben und die DGUV-Hinweise.
                </p>
                <PhotoCredits />
                <h2>Deine Daten bleiben im Browser</h2>
                <p>
                  Keine Registrierung, keine Datenbank. Gespeichert werden
                  abgeschlossene Einheiten, Praxisaufgaben und dein bestes
                  Testergebnis. Beim Löschen der Browserdaten oder bei einem
                  anderen Gerät ist der Fortschritt nicht verfügbar. Bei
                  gesperrtem Browserspeicher erscheint ein Hinweis.
                </p>
                <button
                  className="secondary"
                  onClick={() => setResetConfirm(true)}
                >
                  <RotateCcw size={17} />
                  Lernfortschritt zurücksetzen
                </button>
                {resetConfirm && (
                  <div className="feedback warning">
                    <p>Alle lokal gespeicherten Lernergebnisse löschen?</p>
                    <button
                      className="secondary"
                      onClick={() => setResetConfirm(false)}
                    >
                      Abbrechen
                    </button>{" "}
                    <button
                      className="danger-button"
                      onClick={() => {
                        setProgress({ ...emptyProgress });
                        setQuizIndex(0);
                        setQuizAnswers([]);
                        setResetConfirm(false);
                      }}
                    >
                      Jetzt zurücksetzen
                    </button>
                  </div>
                )}
              </section>
            </>
          )}
          <footer>
            <span>
              <ShieldCheck size={15} />
              Sicher lernen. Sicher arbeiten.
            </span>
            <button onClick={() => go("info")}>Quellen & Hinweise</button>
            <span>LeiterSafe · Lernprototyp</span>
          </footer>
        </main>
      </div>
      <nav className="bottom-nav" aria-label="Hauptnavigation">
        {navigation.map((n) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            aria-current={isNavActive(n.id) ? "page" : undefined}
            onClick={(event) => {
              event.preventDefault();
              go(n.id);
            }}
          >
            <span className="bottom-nav-icon"><n.icon size={26} aria-hidden="true" /></span>
            <span>{n.shortLabel}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
