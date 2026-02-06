import { useRef, useEffect, useState } from "react";
import { COLORS, FONTS } from "../../../styles/theme";
import { drawGrid, drawArrow, drawText, drawDashedLine } from "../../../utils/canvasHelpers";

export default function VectorDecomposition() {
  const canvasRef = useRef(null);
  const [magnitude, setMagnitude] = useState(100);
  const [angle, setAngle] = useState(45);

  const width = 450;
  const height = 350;
  const originX = 80;
  const originY = height - 80;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, width, height);

    drawGrid(ctx, width, height, originX, originY, 40);

    const angleRad = (angle * Math.PI) / 180;
    const vx = magnitude * Math.cos(angleRad);
    const vy = -magnitude * Math.sin(angleRad);

    const endX = originX + vx;
    const endY = originY + vy;

    // Right angle marker
    const markerSize = 12;
    ctx.strokeStyle = COLORS.textSecondary;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(endX - markerSize, originY);
    ctx.lineTo(endX - markerSize, originY - markerSize);
    ctx.lineTo(endX, originY - markerSize);
    ctx.stroke();

    // Dashed projection lines
    drawDashedLine(ctx, endX, endY, endX, originY, COLORS.textSecondary + "80");
    drawDashedLine(ctx, endX, endY, originX, endY, COLORS.textSecondary + "80");

    // X component
    drawArrow(ctx, originX, originY, endX, originY, COLORS.velocity, 3, 10);
    drawText(ctx, `Vₓ = ${vx.toFixed(1)}`, originX + vx / 2, originY + 25, COLORS.velocity, 12);

    // Y component
    drawArrow(ctx, originX, originY, originX, endY, COLORS.energy, 3, 10);
    drawText(ctx, `Vᵧ = ${(-vy).toFixed(1)}`, originX - 45, originY + vy / 2, COLORS.energy, 12);

    // Main vector
    drawArrow(ctx, originX, originY, endX, endY, COLORS.position, 4, 14);
    drawText(ctx, "V", endX + 15, endY - 10, COLORS.position, 16);

    // Angle arc
    ctx.strokeStyle = COLORS.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(originX, originY, 35, 0, -angleRad, true);
    ctx.stroke();
    drawText(ctx, `${angle}°`, originX + 50, originY - 15, COLORS.accent, 12);

    // Formulas
    ctx.fillStyle = "rgba(17, 24, 39, 0.95)";
    ctx.fillRect(width - 180, 10, 170, 110);
    ctx.strokeStyle = COLORS.border;
    ctx.strokeRect(width - 180, 10, 170, 110);

    drawText(ctx, "Decomposition:", width - 95, 30, COLORS.textPrimary, 12);
    drawText(ctx, `|V| = ${magnitude}`, width - 160, 55, COLORS.position, 11, "left");
    drawText(ctx, `θ = ${angle}°`, width - 160, 75, COLORS.accent, 11, "left");
    drawText(ctx, `Vₓ = |V|cos(θ) = ${vx.toFixed(1)}`, width - 160, 95, COLORS.velocity, 11, "left");
    drawText(ctx, `Vᵧ = |V|sin(θ) = ${(-vy).toFixed(1)}`, width - 160, 115, COLORS.energy, 11, "left");

    // Verification
    const reconstructed = Math.sqrt(vx * vx + vy * vy);
    drawText(
      ctx,
      `√(Vₓ² + Vᵧ²) = ${reconstructed.toFixed(1)}`,
      width / 2,
      height - 20,
      COLORS.textSecondary,
      11
    );

  }, [magnitude, angle]);

  return (
    <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: 16, border: `1px solid ${COLORS.border}` }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.position, marginBottom: 12 }}>
        Vector Decomposition
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ borderRadius: 8, display: "block", maxWidth: "100%" }}
      />
      <div style={{ marginTop: 16, display: "flex", gap: 20, flexWrap: "wrap" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.textSecondary, fontSize: 13 }}>
          Magnitude |V|:
          <input
            type="range"
            min="30"
            max="150"
            value={magnitude}
            onChange={(e) => setMagnitude(parseInt(e.target.value))}
            style={{ width: 100 }}
          />
          <span style={{ color: COLORS.position, fontFamily: FONTS.mono, width: 40 }}>{magnitude}</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.textSecondary, fontSize: 13 }}>
          Angle θ (°):
          <input
            type="range"
            min="0"
            max="90"
            value={angle}
            onChange={(e) => setAngle(parseInt(e.target.value))}
            style={{ width: 100 }}
          />
          <span style={{ color: COLORS.accent, fontFamily: FONTS.mono, width: 30 }}>{angle}</span>
        </label>
      </div>
    </div>
  );
}
