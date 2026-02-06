import { COLORS } from "../../styles/theme";
import SECTIONS from "../../utils/sections";

export default function Navbar({ currentPage, onNavigate }) {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: `${COLORS.bg}ee`,
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "0 20px",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: 4,
          overflowX: "auto",
          padding: "10px 0",
        }}
      >
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => onNavigate(s.id)}
            style={{
              background: currentPage === s.id ? `${s.color || COLORS.accent}22` : "transparent",
              border: "none",
              borderRadius: 8,
              padding: "8px 14px",
              cursor: "pointer",
              color: currentPage === s.id ? s.color || COLORS.accent : COLORS.textSecondary,
              fontWeight: currentPage === s.id ? 700 : 500,
              fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
              borderBottom:
                currentPage === s.id
                  ? `2px solid ${s.color || COLORS.accent}`
                  : "2px solid transparent",
            }}
          >
            <span style={{ marginRight: 5 }}>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
