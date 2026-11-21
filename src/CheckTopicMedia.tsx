import { useState } from "react";
import { BookOpen, ClipboardList, Tag } from "lucide-react";
import { photoSources } from "./LadderPhoto";

export type CheckTopic = "holme" | "stufen" | "fuesse" | "umgebung" | "anleitung";
type PhotoDetail = {
  photo: number;
  width: number;
  height: number;
  viewBox: string;
  title: string;
  caption: string;
};
const topicDetails: Record<Exclude<CheckTopic, "anleitung">, PhotoDetail[]> = {
  holme: [{ photo: 0, width: 643, height: 1300, viewBox: "120 340 320 380", title: "Detail: Holme und Befestigungen der Stufen", caption: "Die seitlichen Holme tragen die Stufen. An den Übergängen sind die Befestigungen zu erkennen. Hier sind Risse, Verformungen und lose Verbindungen wichtige Kontrollmerkmale." }],
  stufen: [{ photo: 3, width: 461, height: 614, viewBox: "65 115 270 295", title: "Detail: Plattform und darunterliegende Stufen", caption: "Oben liegt die Plattform, darunter folgen die Stufen. Zur Kontrolle gehören die Auftrittsflächen und ihre Befestigungen. Das Foto veranschaulicht die Bauteile, nicht ihren sicheren Zustand." }],
  fuesse: [
    { photo: 2, width: 1000, height: 880, viewBox: "0 0 1000 880", title: "Detail: Fußkappen an den unteren Holmenden", caption: "Die Fußkappen sitzen unten an den Holmen. Vollständigkeit, Verschleiß und Beschädigungen gehören hier zur Sichtkontrolle." },
    { photo: 0, width: 643, height: 1300, viewBox: "325 465 265 200", title: "Detail: Spreizsicherung zwischen den Leiterseiten", caption: "Die waagerechte Spreizsicherung verbindet die beiden Leiterseiten. Ihre Ausführung und richtige Gebrauchsstellung richten sich nach der Bauart und der Herstelleranleitung." },
  ],
  umgebung: [{ photo: 3, width: 461, height: 614, viewBox: "0 0 461 614", title: "Leiter vor einer Tür und Matte im Aufstellbereich", caption: "Im Bild sind die Tür hinter der Leiter und die Matte an ihren Füßen zu sehen. Solche Einflüsse müssen bei der Wahl und Absicherung des Aufstellortes berücksichtigt werden." }],
};

function DetailPhoto({ detail }: { detail: PhotoDetail }) {
  const [failed, setFailed] = useState(false);
  const source = photoSources[detail.photo];
  return (
    <figure className="topic-detail-photo">
      <div className="topic-detail-stage">
        {failed ? <p>Foto nicht verfügbar. {detail.title}.</p> : (
          <svg viewBox={detail.viewBox} role="img" aria-label={detail.title} preserveAspectRatio="xMidYMid meet">
            <image href={`${import.meta.env.BASE_URL}images/${source.file}`} width={detail.width} height={detail.height} onError={() => setFailed(true)} />
          </svg>
        )}
      </div>
      <figcaption><strong>{detail.title}</strong><p>{detail.caption}</p><small>Foto: {source.author} · {source.license}{detail.viewBox !== `0 0 ${detail.width} ${detail.height}` ? " · Bildausschnitt" : ""} · Bildnachweise unter Informationen & Quellen</small></figcaption>
    </figure>
  );
}

export function CheckTopicMedia({ topic }: { topic: CheckTopic }) {
  if (topic === "anleitung") return (
    <figure className="topic-instruction-visual" aria-label="Zusammenhang zwischen Aufgabe, Kennzeichnung und Herstelleranleitung">
      <div className="topic-instruction-steps">
        <div><ClipboardList size={26} aria-hidden="true" /><h3>Die Aufgabe</h3><p>Welche Tätigkeit ist geplant? Welche Arbeitsbedingungen gibt es?</p></div>
        <div><Tag size={26} aria-hidden="true" /><h3>Die Kennzeichnung</h3><p>Leitertyp und Modell am Original ablesen. Die Anleitung muss zu dieser Leiter gehören.</p></div>
        <div><BookOpen size={26} aria-hidden="true" /><h3>Die Herstelleranleitung</h3><p>Zulässige Verwendung und Aufbau mit der Aufgabe und den betrieblichen Vorgaben abgleichen.</p></div>
      </div>
      <figcaption>Die Angaben müssen zusammenpassen. Ein Foto einer anderen Leiter kann die passende Herstelleranleitung nicht ersetzen.</figcaption>
    </figure>
  );
  return <div className={`topic-detail-grid ${topicDetails[topic].length > 1 ? "paired" : ""}`}>{topicDetails[topic].map(detail => <DetailPhoto key={detail.title} detail={detail} />)}</div>;
}
