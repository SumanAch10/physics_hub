import { COLORS, FONTS } from "../styles/theme";
import { FreeBodyDiagram, NewtonSecondLaw, FrictionDemo, CentripetalForce } from "../components/simulations/forces";

export default function ForcesPage() {
  return (
    <section>
      <h1 style={{ margin: "10px 0 6px" }}>Forces</h1>
      <p style={{ color: COLORS.textSecondary, marginBottom: 24 }}>
        Explore Newton's laws, free body diagrams, friction, and circular motion.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <FreeBodyDiagram />
        <NewtonSecondLaw />
        <FrictionDemo />
        <CentripetalForce />
      </div>
    </section>
  );
}
