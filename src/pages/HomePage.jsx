import { COLORS, FONTS } from "../styles/theme";
import SECTIONS from "../utils/sections";

export default function HomePage({ onNavigate }) {
  return (
    <section>
      <header style={{ marginTop: 10 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 12px",
            borderRadius: 999,
            background: `${COLORS.accent}1f`,
            color: COLORS.accent,
            fontFamily: FONTS.mono,
            fontSize: 12,
          }}
        >
          Physics Hub
        </div>
        <h1 style={{ margin: "12px 0 8px", fontSize: 36 }}>
          Learn physics with interactive visuals
        </h1>
        <p style={{ color: COLORS.textSecondary, maxWidth: 620 }}>
          Explore core topics, run small simulations, and build intuition with
          clean, focused explanations.
        </p>
      </header>

      <div
        style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        {SECTIONS.filter((s) => s.id !== "home").map((s) => (
          <button
            key={s.id}
            onClick={() => onNavigate(s.id)}
            style={{
              textAlign: "left",
              padding: 16,
              borderRadius: 14,
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.textPrimary,
              cursor: "pointer",
              transition: "transform 0.15s ease, background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.background = COLORS.bgCardHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.background = COLORS.bgCard;
            }}
          >
            <div style={{ fontSize: 20 }}>{s.icon}</div>
            <div style={{ marginTop: 10, fontWeight: 700 }}>{s.label}</div>
            <div
              style={{
                marginTop: 6,
                color: COLORS.textSecondary,
                fontSize: 12,
                fontFamily: FONTS.mono,
              }}
            >
              {s.wip ? "Work in progress" : "Start lesson"}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
