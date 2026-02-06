import { useState } from "react";
import { COLORS, FONTS } from "./styles/theme";
import SECTIONS from "./utils/sections";
import { Navbar } from "./components/layout";
import { WIPCard } from "./components/common";
import { HomePage, KinematicsPage, VectorsPage, ForcesPage } from "./pages";

export default function App() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "kinematics":
        return <KinematicsPage />;
      case "vectors":
        return <VectorsPage />;
      case "forces":
        return <ForcesPage />;
      case "work-energy":
      case "momentum":
      case "rotation":
      case "formulas": {
        const s = SECTIONS.find((sec) => sec.id === page);
        return <WIPCard title={s.label} icon={s.icon} color={s.color} />;
      }
      default:
        return <HomePage onNavigate={setPage} />;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        color: COLORS.textPrimary,
        fontFamily: FONTS.body,
      }}
    >
      <Navbar currentPage={page} onNavigate={setPage} />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "20px 20px 60px" }}>
        {renderPage()}
      </main>
    </div>
  );
}
