import { COLORS, FONTS } from "../styles/theme";
import { VectorAddition, VectorDecomposition } from "../components/simulations/vectors";

export default function VectorsPage() {
  return (
    <section>
      <h1 style={{ margin: "10px 0 6px" }}>Vectors</h1>
      <p style={{ color: COLORS.textSecondary, marginBottom: 24 }}>
        Visualize vector operations including addition, subtraction, and decomposition into components.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <VectorAddition />
        <VectorDecomposition />
      </div>
    </section>
  );
}
