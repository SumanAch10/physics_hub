import { COLORS, FONTS } from "../styles/theme";
import { PositionTimeGraph, VelocityAccelGraphs, ProjectileMotion } from "../components/simulations/kinematics";

export default function KinematicsPage() {
  return (
    <section>
      <h1 style={{ margin: "10px 0 6px" }}>Kinematics</h1>
      <p style={{ color: COLORS.textSecondary, marginBottom: 24 }}>
        Explore position, velocity, and acceleration relationships through interactive simulations.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <PositionTimeGraph />
        <VelocityAccelGraphs />
        <ProjectileMotion />
      </div>
    </section>
  );
}
