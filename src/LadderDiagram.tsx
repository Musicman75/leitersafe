import type { Area, LadderKind } from "./inspection";
export function LadderDiagram({
  kind,
  area,
  platform = false,
}: {
  kind: LadderKind;
  area?: Area;
  platform?: boolean;
}) {
  const color = (a: Area) => (a === area ? "#2463a6" : "#8295a5");
  const low = kind === "step";
  const top = low ? 85 : 20;
  return (
    <svg
      className="ladder-diagram"
      viewBox="0 0 220 200"
      role="img"
      aria-label={`Schematische ${kind === "leaning" ? "Anlegeleiter" : kind === "standing" ? "Stehleiter" : "Tritt"}${area ? `; markiert: ${({ rails: "tragende Seitenteile", treads: "Stufen und Sprossen", feet: "Füße", joints: "Verbindungen und Gelenke", spread: "Sicherung", platform: "Plattform", label: "Kennzeichnung", setup: "Aufstellbereich" } as const)[area]}` : ""}`}
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M20 185H200"
          stroke={color("setup")}
          strokeWidth={area === "setup" ? 6 : 2}
        />
        {kind === "leaning" ? (
          <>
            <path
              d="M70 176L115 25M115 176L160 25"
              stroke={color("rails")}
              strokeWidth="7"
            />
            {[0, 1, 2, 3, 4].map((i) => (
              <path
                key={i}
                d={`M${78 + i * 8} ${150 - i * 27}h45`}
                stroke={color("treads")}
                strokeWidth="6"
              />
            ))}
            <path
              d="M68 178h9M111 178h9"
              stroke={color("feet")}
              strokeWidth="9"
            />
            <path d="M110 18H180V185" stroke="#bccbd7" strokeWidth="2" />
            <rect x="111" y="73" width="9" height="15" fill={color("label")} />
          </>
        ) : (
          <>
            <path
              d={`M52 176L87 ${top}M123 176L112 ${top}M170 176L112 ${top}`}
              stroke={color("rails")}
              strokeWidth="7"
            />
            {(low ? [0, 1] : [0, 1, 2, 3]).map((i) => (
              <path
                key={i}
                d={`M${59 + i * 7} ${150 - i * (low ? 27 : 32)}L${121 - i * 2} ${150 - i * (low ? 27 : 32)}`}
                stroke={color("treads")}
                strokeWidth="7"
              />
            ))}
            <path
              d="M72 113L147 113"
              stroke={color("spread")}
              strokeWidth={area === "spread" ? 7 : 4}
            />
            {(platform || low) && (
              <path
                d={`M83 ${top + 19}h42`}
                stroke={color("platform")}
                strokeWidth="10"
              />
            )}
            <circle cx="100" cy={top + 4} r="7" fill={color("joints")} />
            <path
              d="M48 178h10M118 178h10M165 178h10"
              stroke={color("feet")}
              strokeWidth="9"
            />
            <rect x="112" y="132" width="9" height="15" fill={color("label")} />
          </>
        )}
        {area === "joints" && (
          <>
            <circle
              cx="83"
              cy={low ? 123 : 54}
              r="8"
              stroke="#2463a6"
              strokeWidth="3"
            />
            <circle cx="117" cy="150" r="8" stroke="#2463a6" strokeWidth="3" />
          </>
        )}
      </g>
    </svg>
  );
}
