import { useRef, useEffect, useState } from "react";
import { COLORS, FONTS } from "../../../styles/theme";
import { drawGrid, drawArrow, drawText, drawDashedLine } from "../../../utils/canvasHelpers";

export default function VectorAddition() {
  const canvasRef = useRef(null);
  const [v1Mag, setV1Mag] = useState(80);
  const [v1Angle, setV1Angle] = useState(30);
  const [v2Mag, setV2Mag] = useState(60);
  const [v2Angle, setV2Angle] = useState(120);
  const [showComponents, setShowComponents] = useState(true);

  const width = 500;
  const height = 400;
  const originX = width / 2;
  const originY = height / 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, width, height);

    drawGrid(ctx, width, height, originX, originY, 40);

    const v1Rad = (v1Angle * Math.PI) / 180;
    const v2Rad = (v2Angle * Math.PI) / 180;

    const v1x = v1Mag * Math.cos(v1Rad);
    const v1y = -v1Mag * Math.sin(v1Rad);
    const v2x = v2Mag * Math.cos(v2Rad);
    const v2y = -v2Mag * Math.sin(v2Rad);

    const rx = v1x + v2x;
    const ry = v1y + v2y;
    const rMag = Math.sqrt(rx * rx + ry * ry);
    const rAngle = (Math.atan2(-ry, rx) * 180) / Math.PI;

    // Component dashed lines
    if (showComponents) {
      // V1 components
      drawDashedLine(ctx, originX, originY, originX + v1x, originY, COLORS.velocity + "60");
      drawDashedLine(ctx, originX + v1x, originY, originX + v1x, originY + v1y, COLORS.velocity + "60");

      // V2 components (from tip of V1)
      drawDashedLine(ctx, originX + v1x, originY + v1y, originX + v1x + v2x, originY + v1y, COLORS.energy + "60");
      drawDashedLine(ctx, originX + v1x + v2x, originY + v1y, originX + rx, originY + ry, COLORS.energy + "60");
    }

    // V2 from origin (ghost)
    ctx.globalAlpha = 0.3;
    drawArrow(ctx, originX, originY, originX + v2x, originY + v2y, COLORS.energy, 2, 8);
    ctx.globalAlpha = 1;

    // V1 vector
    drawArrow(ctx, originX, originY, originX + v1x, originY + v1y, COLORS.velocity, 3, 12);
    drawText(ctx, "A", originX + v1x / 2 - 15, originY + v1y / 2 - 10, COLORS.velocity, 14);

    // V2 vector (from tip of V1 - head to tail)
    drawArrow(ctx, originX + v1x, originY + v1y, originX + rx, originY + ry, COLORS.energy, 3, 12);
    drawText(ctx, "B", originX + v1x + v2x / 2 + 15, originY + v1y + v2y / 2, COLORS.energy, 14);

    // Resultant vector
    drawArrow(ctx, originX, originY, originX + rx, originY + ry, COLORS.position, 4, 14);
    drawText(ctx, "A + B", originX + rx / 2 + 20, originY + ry / 2 + 20, COLORS.position, 14);

    // Parallelogram (optional visualization)
    ctx.strokeStyle = COLORS.textSecondary + "40";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(originX + v2x, originY + v2y);
    ctx.lineTo(originX + rx, originY + ry);
    ctx.stroke();
    ctx.setLineDash([]);

    // Info panel
    ctx.fillStyle = "rgba(17, 24, 39, 0.95)";
    ctx.fillRect(10, 10, 160, 100);
    ctx.strokeStyle = COLORS.border;
    ctx.strokeRect(10, 10, 160, 100);

    drawText(ctx, `|A| = ${v1Mag.toFixed(0)}`, 20, 32, COLORS.velocity, 12, "left");
    drawText(ctx, `θ₁ = ${v1Angle}°`, 100, 32, COLORS.velocity, 12, "left");
    drawText(ctx, `|B| = ${v2Mag.toFixed(0)}`, 20, 52, COLORS.energy, 12, "left");
    drawText(ctx, `θ₂ = ${v2Angle}°`, 100, 52, COLORS.energy, 12, "left");
    drawText(ctx, `|A+B| = ${rMag.toFixed(1)}`, 20, 78, COLORS.position, 12, "left");
    drawText(ctx, `θᵣ = ${rAngle.toFixed(1)}°`, 20, 98, COLORS.position, 12, "left");

  }, [v1Mag, v1Angle, v2Mag, v2Angle, showComponents]);

  return (
    <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: 16, border: `1px solid ${COLORS.border}` }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.position, marginBottom: 12 }}>
        Vector Addition (Head-to-Tail Method)
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ borderRadius: 8, display: "block", maxWidth: "100%" }}
      />
      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <div style={{ color: COLORS.velocity, fontSize: 12, marginBottom: 8, fontFamily: FONTS.mono }}>Vector A</div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.textSecondary, fontSize: 12, marginBottom: 6 }}>
            Magnitude:
            <input
              type="range"
              min="20"
              max="150"
              value={v1Mag}
              onChange={(e) => setV1Mag(parseInt(e.target.value))}
              style={{ width: 80 }}
            />
            <span style={{ fontFamily: FONTS.mono, width: 30 }}>{v1Mag}</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.textSecondary, fontSize: 12 }}>
            Angle (°):
            <input
              type="range"
              min="0"
              max="360"
              value={v1Angle}
              onChange={(e) => setV1Angle(parseInt(e.target.value))}
              style={{ width: 80 }}
            />
            <span style={{ fontFamily: FONTS.mono, width: 30 }}>{v1Angle}</span>
          </label>
        </div>
        <div>
          <div style={{ color: COLORS.energy, fontSize: 12, marginBottom: 8, fontFamily: FONTS.mono }}>Vector B</div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.textSecondary, fontSize: 12, marginBottom: 6 }}>
            Magnitude:
            <input
              type="range"
              min="20"
              max="150"
              value={v2Mag}
              onChange={(e) => setV2Mag(parseInt(e.target.value))}
              style={{ width: 80 }}
            />
            <span style={{ fontFamily: FONTS.mono, width: 30 }}>{v2Mag}</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.textSecondary, fontSize: 12 }}>
            Angle (°):
            <input
              type="range"
              min="0"
              max="360"
              value={v2Angle}
              onChange={(e) => setV2Angle(parseInt(e.target.value))}
              style={{ width: 80 }}
            />
            <span style={{ fontFamily: FONTS.mono, width: 30 }}>{v2Angle}</span>
          </label>
        </div>
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.textSecondary, fontSize: 12, marginTop: 12 }}>
        <input
          type="checkbox"
          checked={showComponents}
          onChange={(e) => setShowComponents(e.target.checked)}
        />
        Show component lines
      </label>
    </div>
  );
}
