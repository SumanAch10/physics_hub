import { COLORS, FONTS } from "../../styles/theme";

export default function WIPCard({ title, icon, color }) {
  return (
    <section
      style={{
        background: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        padding: 24,
        marginTop: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <h2 style={{ margin: 0, fontSize: 22, color: color || COLORS.accent }}>
          {title}
        </h2>
      </div>
      <p style={{ color: COLORS.textSecondary, marginTop: 10 }}>
        This section is under construction. Check back soon for interactive
        simulations and guided lessons.
      </p>
      <div
        style={{
          marginTop: 16,
          padding: "10px 12px",
          borderRadius: 10,
          background: `${color || COLORS.accent}1a`,
          color: color || COLORS.accent,
          fontFamily: FONTS.mono,
          fontSize: 13,
        }}
      >
        Status: In progress
      </div>
    </section>
  );
}
