import { useRef, useEffect, useState } from "react";
import { COLORS, FONTS } from "../../../styles/theme";
import { drawArrow, drawText, drawCircle } from "../../../utils/canvasHelpers";

export default function FreeBodyDiagram() {
  const canvasRef = useRef(null);
  const [mass, setMass] = useState(5);
  const [angle, setAngle] = useState(30);
  const [showNormal, setShowNormal] = useState(true);
  const [showFriction, setShowFriction] = useState(true);

  const width = 500;
  const height = 400;
  const g = 9.8;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, width, height);

    const angleRad = (angle * Math.PI) / 180;
    const weight = mass * g;
    const normal = weight * Math.cos(angleRad);
    const friction = weight * Math.sin(angleRad);

    // Draw inclined plane
    const planeStartX = 50;
    const planeEndX = width - 50;
    const planeStartY = height - 60;
    const planeEndY = planeStartY - (planeEndX - planeStartX) * Math.tan(angleRad);

    ctx.fillStyle = COLORS.border;
    ctx.beginPath();
    ctx.moveTo(planeStartX, planeStartY);
    ctx.lineTo(planeEndX, planeEndY);
    ctx.lineTo(planeEndX, planeStartY);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = COLORS.textSecondary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(planeStartX, planeStartY);
    ctx.lineTo(planeEndX, planeEndY);
    ctx.stroke();

    // Ground
    ctx.fillStyle = COLORS.bgCard;
    ctx.fillRect(0, planeStartY, width, height - planeStartY);

    // Angle arc
    ctx.strokeStyle = COLORS.accent;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(planeEndX, planeStartY, 40, Math.PI, Math.PI + angleRad, false);
    ctx.stroke();
    drawText(ctx, `${angle}°`, planeEndX - 55, planeStartY - 15, COLORS.accent, 11);

    // Object position on plane
    const objX = (planeStartX + planeEndX) / 2;
    const objY = planeStartY - (objX - planeStartX) * Math.tan(angleRad) - 25;

    // Draw object
    const boxSize = 40;
    ctx.save();
    ctx.translate(objX, objY);
    ctx.rotate(-angleRad);
    ctx.fillStyle = COLORS.bgCardHover;
    ctx.fillRect(-boxSize / 2, -boxSize / 2, boxSize, boxSize);
    ctx.strokeStyle = COLORS.accent;
    ctx.lineWidth = 2;
    ctx.strokeRect(-boxSize / 2, -boxSize / 2, boxSize, boxSize);
    ctx.restore();

    // Force scale
    const scale = 2.5;

    // Weight (always down)
    const weightLen = weight * scale;
    drawArrow(ctx, objX, objY, objX, objY + weightLen, COLORS.force, 3, 12);
    drawText(ctx, `W = ${weight.toFixed(1)}N`, objX + 15, objY + weightLen / 2, COLORS.force, 11, "left");

    // Normal force (perpendicular to surface)
    if (showNormal) {
      const normalLen = normal * scale;
      const normalAngle = -angleRad + Math.PI / 2;
      const nx = normalLen * Math.cos(normalAngle);
      const ny = normalLen * Math.sin(normalAngle);
      drawArrow(ctx, objX, objY, objX + nx, objY - ny, COLORS.momentum, 3, 12);
      drawText(ctx, `N = ${normal.toFixed(1)}N`, objX + nx + 10, objY - ny - 10, COLORS.momentum, 11, "left");
    }

    // Friction force (along surface, up the incline)
    if (showFriction) {
      const frictionLen = friction * scale;
      const fx = -frictionLen * Math.cos(angleRad);
      const fy = frictionLen * Math.sin(angleRad);
      drawArrow(ctx, objX, objY, objX + fx, objY + fy, COLORS.energy, 3, 12);
      drawText(ctx, `f = ${friction.toFixed(1)}N`, objX + fx - 10, objY + fy - 15, COLORS.energy, 11, "right");
    }

    // Weight components (dashed)
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = COLORS.force + "60";
    ctx.lineWidth = 1.5;

    // W parallel (down the incline)
    const wParallel = weight * Math.sin(angleRad) * scale;
    const wpx = wParallel * Math.cos(angleRad);
    const wpy = wParallel * Math.sin(angleRad);
    ctx.beginPath();
    ctx.moveTo(objX, objY);
    ctx.lineTo(objX + wpx, objY + wpy);
    ctx.stroke();

    // W perpendicular (into surface)
    const wPerp = weight * Math.cos(angleRad) * scale;
    const wnx = wPerp * Math.sin(angleRad);
    const wny = wPerp * Math.cos(angleRad);
    ctx.beginPath();
    ctx.moveTo(objX, objY);
    ctx.lineTo(objX - wnx, objY + wny);
    ctx.stroke();

    ctx.setLineDash([]);

    // Info panel
    ctx.fillStyle = "rgba(17, 24, 39, 0.95)";
    ctx.fillRect(10, 10, 180, 90);
    ctx.strokeStyle = COLORS.border;
    ctx.strokeRect(10, 10, 180, 90);

    drawText(ctx, `Mass: ${mass} kg`, 20, 32, COLORS.textPrimary, 12, "left");
    drawText(ctx, `Weight: ${weight.toFixed(1)} N`, 20, 52, COLORS.force, 12, "left");
    drawText(ctx, `W∥ = ${(weight * Math.sin(angleRad)).toFixed(1)} N`, 20, 72, COLORS.textSecondary, 11, "left");
    drawText(ctx, `W⊥ = ${(weight * Math.cos(angleRad)).toFixed(1)} N`, 100, 72, COLORS.textSecondary, 11, "left");
    drawText(ctx, `θ = ${angle}°`, 20, 92, COLORS.accent, 12, "left");

  }, [mass, angle, showNormal, showFriction]);

  return (
    <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: 16, border: `1px solid ${COLORS.border}` }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.force, marginBottom: 12 }}>
        Free Body Diagram - Inclined Plane
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ borderRadius: 8, display: "block", maxWidth: "100%" }}
      />
      <div style={{ marginTop: 16, display: "flex", gap: 20, flexWrap: "wrap" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.textSecondary, fontSize: 13 }}>
          Mass (kg):
          <input
            type="range"
            min="1"
            max="20"
            value={mass}
            onChange={(e) => setMass(parseInt(e.target.value))}
            style={{ width: 100 }}
          />
          <span style={{ color: COLORS.textPrimary, fontFamily: FONTS.mono, width: 30 }}>{mass}</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.textSecondary, fontSize: 13 }}>
          Angle (°):
          <input
            type="range"
            min="5"
            max="60"
            value={angle}
            onChange={(e) => setAngle(parseInt(e.target.value))}
            style={{ width: 100 }}
          />
          <span style={{ color: COLORS.accent, fontFamily: FONTS.mono, width: 30 }}>{angle}</span>
        </label>
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 16 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6, color: COLORS.textSecondary, fontSize: 12 }}>
          <input type="checkbox" checked={showNormal} onChange={(e) => setShowNormal(e.target.checked)} />
          Normal Force
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 6, color: COLORS.textSecondary, fontSize: 12 }}>
          <input type="checkbox" checked={showFriction} onChange={(e) => setShowFriction(e.target.checked)} />
          Friction
        </label>
      </div>
    </div>
  );
}
