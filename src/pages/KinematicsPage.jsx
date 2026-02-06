import { COLORS, FONTS } from "../styles/theme";
import {
  PositionTimeGraph,
  VelocityAccelGraphs,
  ProjectileMotion,
  SUVATEquations,
  VelocityComparator,
  KinematicsChallenges,
} from "../components/simulations/kinematics";

export default function KinematicsPage() {
  return (
    <section>
      <h1 style={{ margin: "10px 0 6px" }}>Kinematics</h1>
      <p style={{ color: COLORS.textSecondary, marginBottom: 24 }}>
        Master motion, velocity, acceleration, and the equations that connect them through interactive simulations.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Core Concepts */}
        <div style={{
          padding: "8px 12px",
          background: COLORS.velocity + "15",
          borderRadius: 6,
          color: COLORS.velocity,
          fontSize: 12,
          fontFamily: FONTS.mono,
        }}>
          Core Concepts: Position, Velocity & Acceleration
        </div>

        <PositionTimeGraph />
        <VelocityComparator />
        <VelocityAccelGraphs />

        {/* SUVAT Section */}
        <div style={{
          padding: "8px 12px",
          background: COLORS.accent + "15",
          borderRadius: 6,
          color: COLORS.accent,
          fontSize: 12,
          fontFamily: FONTS.mono,
          marginTop: 16,
        }}>
          Equations of Motion (SUVAT)
        </div>

        <SUVATEquations />

        {/* Projectile Motion */}
        <div style={{
          padding: "8px 12px",
          background: COLORS.energy + "15",
          borderRadius: 6,
          color: COLORS.energy,
          fontSize: 12,
          fontFamily: FONTS.mono,
          marginTop: 16,
        }}>
          2D Motion: Projectile Motion
        </div>

        <ProjectileMotion />

        {/* MIT Challenges */}
        <div style={{
          padding: "8px 12px",
          background: COLORS.force + "15",
          borderRadius: 6,
          color: COLORS.force,
          fontSize: 12,
          fontFamily: FONTS.mono,
          marginTop: 16,
        }}>
          MIT-Style Problem Challenges
        </div>

        <KinematicsChallenges />
      </div>
    </section>
  );
}
