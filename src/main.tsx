import React, { useEffect, useState } from "react";
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
  TriangleAlert,
  RotateCcw,
  Lightbulb,
  Flag,
  CheckCircle2,
} from "lucide-react";
import {
  lessons,
  questions,
  practices,
  sources,
  photoExercise,
  type Question,
} from "./content";
import { LadderPhoto, PhotoCredits } from "./LadderPhoto";
import { readProgress, emptyProgress } from "./progress";
import { Inspection } from "./Inspection";
import "./style.css";
type Page = "start" | "schulung" | "praxis" | "check" | "quiz" | "info";
const navigation = [
  { id: "start", label: "Start", icon: Home },
  { id: "schulung", label: "Lernen", icon: BookOpen },
  { id: "praxis", label: "Praxis", icon: Footprints },
  { id: "check", label: "Check", icon: ClipboardCheck },
  { id: "quiz", label: "Test", icon: GraduationCap },
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
    return ["start", "schulung", "praxis", "check", "quiz", "info"].includes(
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
  const [lessonChoice, setLessonChoice] = useState<number | undefined>();
  const [practice, setPractice] = useState<number | null>(null);
  const [practiceSteps, setPracticeSteps] = useState<number[]>([]);
  const [photoCorrect, setPhotoCorrect] = useState(false);
  const [photoAttempt, setPhotoAttempt] = useState(0);
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
      if (["start", "schulung", "praxis", "check", "quiz", "info"].includes(h))
        setPage(h as Page);
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  function go(p: Page) {
    setPage(p);
    location.hash = p;
    window.scrollTo(0, 0);
  }
  function openLesson(i: number) {
    setLesson(i);
    setLessonChoice(undefined);
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
      <nav className="bottom-nav" aria-label="Hauptnavigation">
        {navigation.map((n) => (
          <button
            key={n.id}
            aria-current={page === n.id ? "page" : undefined}
            onClick={() => go(n.id)}
          >
            <n.icon size={22} />
            <span>{n.label}</span>
          </button>
        ))}
      </nav>
      <div className="app-shell">
        <header className="topbar">
          <a
            className="compact-brand"
            href="#start"
            onClick={() => go("start")}
          >
            Leiter<span>Safe</span>
          </a>
          <button
            className="header-info"
            aria-label="Informationen und Quellen"
            aria-current={page === "info" ? "page" : undefined}
            onClick={() => go("info")}
          >
            <Info size={22} />
          </button>
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
              <div className="page-heading home-heading">
                <span className="eyebrow">Dein Lernbereich</span>
                <h1>
                  Sicher arbeiten.
                  <br />
                  Schritt für Schritt.
                </h1>
              </div>
              <section className="continue-card">
                <span className="eyebrow">
                  {pct === 100 ? "Wissen auffrischen" : "Deine nächste Einheit"}
                </span>
                <h2>{lessons[current < 0 ? 0 : current].title}</h2>
                <p>{lessons[current < 0 ? 0 : current].short}</p>
                <button
                  className="primary"
                  onClick={() => {
                    go("schulung");
                    openLesson(current < 0 ? 0 : current);
                  }}
                >
                  {pct > 0 && pct < 100
                    ? "Weiterlernen"
                    : pct === 100
                      ? "Einheit wiederholen"
                      : "Schulung starten"}
                </button>
              </section>
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
              <section className="home-check">
                <div>
                  <h2>Vor dem Einsatz</h2>
                  <p>Kontrolliere die passende Leiter Schritt für Schritt.</p>
                </div>
                <button className="secondary" onClick={() => go("check")}>
                  Leitercheck öffnen
                </button>
              </section>
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
                  {step === 0 && <LadderPhoto scene={lesson} />}
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
                        initialAnswer={lessonChoice}
                        onAnswered={(_ok, choice) => {
                          setLessonChoice(choice);
                          setLessonAnswered(true);
                        }}
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
                        disabled={
                          (step === 2 && lessonChoice === undefined) ||
                          (step === 3 && !lessonAnswered)
                        }
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
                    {step === 2 && lessonChoice === undefined && (
                      <p className="fine-print">
                        Beantworte die Frage und lies die Rückmeldung. Danach
                        geht es weiter.
                      </p>
                    )}
                    {step === 2 && lessonChoice === undefined && (
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
          <Inspection active={page === "check"} />
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
                          window.scrollTo(0, 0);
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
                      <details className="quiz-photo">
                        <summary>Passendes Orientierungsfoto ansehen</summary>
                        <LadderPhoto scene={questions[quizIndex].scene} />
                      </details>
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
                          window.scrollTo(0, 0);
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
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
