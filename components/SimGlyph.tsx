import type { Subject } from "@/lib/content";

export function SimGlyph({
  subject,
  variant = 0,
}: {
  subject: Subject;
  variant?: number;
}) {
  const stroke = "var(--ink)";

  if (subject === "Physics") {
    return (
      <svg viewBox="0 0 200 140" width="100%" className="max-h-[120px]">
        <line x1="20" y1="20" x2="180" y2="20" stroke={stroke} strokeWidth="1.2" />
        {[0.2, 0.5, 0.8].map((_, index) => {
          const angle = (index - 1) * 0.5 + variant * 0.1;
          const length = 90 - index * 10;
          const x = 100 + Math.sin(angle) * length;
          const y = 20 + Math.cos(angle) * length;

          return (
            <g key={index} opacity={index === 1 ? 1 : 0.25}>
              <line x1="100" y1="20" x2={x} y2={y} stroke={stroke} strokeWidth="1" />
              <circle
                cx={x}
                cy={y}
                r={index === 1 ? 9 : 6}
                fill={index === 1 ? stroke : "none"}
                stroke={stroke}
                strokeWidth="1"
              />
            </g>
          );
        })}
      </svg>
    );
  }

  if (subject === "Chemistry") {
    return (
      <svg viewBox="0 0 200 140" width="100%" className="max-h-[120px]">
        <path
          d="M70 20 L70 55 L45 120 Q45 130 55 130 L145 130 Q155 130 155 120 L130 55 L130 20"
          fill="none"
          stroke={stroke}
          strokeWidth="1.2"
        />
        <line x1="62" y1="20" x2="138" y2="20" stroke={stroke} strokeWidth="2" />
        <line x1="58" y1="95" x2="142" y2="95" stroke={stroke} strokeWidth="1" strokeDasharray="3 3" />
        <line x1="55" y1="110" x2="145" y2="110" stroke={stroke} strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="85" cy="115" r="2" fill={stroke} />
        <circle cx="115" cy="112" r="2" fill={stroke} />
        <circle cx="100" cy="120" r="1.5" fill={stroke} />
      </svg>
    );
  }

  if (subject === "Biology") {
    return (
      <svg viewBox="0 0 200 140" width="100%" className="max-h-[120px]">
        <circle cx="70" cy="70" r="48" fill="none" stroke={stroke} strokeWidth="1.2" />
        <circle cx="70" cy="70" r="14" fill={stroke} />
        <circle cx="135" cy="55" r="24" fill="none" stroke={stroke} strokeWidth="1" />
        <circle cx="135" cy="55" r="7" fill={stroke} />
        <circle cx="155" cy="100" r="16" fill="none" stroke={stroke} strokeWidth="1" />
        <circle cx="155" cy="100" r="5" fill={stroke} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 140" width="100%" className="max-h-[120px]">
      {[0, 1, 2, 3, 4].map((index) => (
        <line
          key={`v-${index}`}
          x1={20 + index * 40}
          y1="15"
          x2={20 + index * 40}
          y2="125"
          stroke={stroke}
          strokeWidth="0.5"
          opacity="0.3"
        />
      ))}
      {[0, 1, 2, 3].map((index) => (
        <line
          key={`h-${index}`}
          x1="20"
          y1={15 + index * 37}
          x2="180"
          y2={15 + index * 37}
          stroke={stroke}
          strokeWidth="0.5"
          opacity="0.3"
        />
      ))}
      <path
        d="M20 110 Q 60 20, 100 70 T 180 30"
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
      />
      <line x1="20" y1="125" x2="180" y2="125" stroke={stroke} strokeWidth="1.2" />
      <line x1="20" y1="15" x2="20" y2="125" stroke={stroke} strokeWidth="1.2" />
    </svg>
  );
}
