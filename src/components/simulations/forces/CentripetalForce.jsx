import { useRef, useEffect, useState } from "react";
import { COLORS, FONTS } from "../../../styles/theme";
import { drawArrow, drawText, drawCircle, drawDashedLine } from "../../../utils/canvasHelpers";

export default function CentripetalForce() {
  const canvasRef = useRef(null);
  const [mass, setMass] = useState(2);
  const [radius, setRadius] = useState(100);
  const [speed, setSpeed] = useState(5);
  const [angle, setAngle] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const animRef = useRef(null);

  const width = 500;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;

  const angularVelocity = speed / radius;
  const centripetalAccel = (speed * speed) / radius;
  const centripetalForce = mass * centripetalAccel;
  const period = (2 * Math.PI * radius) / speed;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, width, height);

    // Circular path
    ctx.strokeStyle = COLORS.gridLine;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Center point
    drawCircle(ctx, centerX, centerY, 5, COLORS.textSecondary);

    // Radius line
    const objX = centerX + radius * Math.cos(angle);
    const objY = centerY + radius * Math.sin(angle);

    drawDashedLine(ctx, centerX, centerY, objX, objY, COLORS.textSecondary + "60");
    drawText(ctx, `r = ${(radius / 50).toFixed(1)}m`, centerX + radius / 2 * Math.cos(angle) - 20, centerY + radius / 2 * Math.sin(angle) - 10, COLORS.textSecondary, 10);

    // Object
    const objRadius = 12 + mass * 2;
    drawCircle(ctx, objX, objY, objRadius, COLORS.accent, COLORS.textPrimary);
    drawText(ctx, `${mass}kg`, objX, objY + 4, COLORS.bg, 10);

    // Velocity vector (tangential)
    const velScale = 15;
    const velLen = speed * velScale;
    const velAngle = angle + Math.PI / 2;
    const velEndX = objX + velLen * Math.cos(velAngle);
    const velEndY = objY + velLen * Math.sin(velAngle);
    drawArrow(ctx, objX, objY, velEndX, velEndY, COLORS.velocity, 3, 10);
    drawText(ctx, `v = ${speed} m/s`, velEndX + 10, velEndY, COLORS.velocity, 10, "left");

    // Centripetal force/acceleration (toward center)
    const forceScale = 3;
    const forceLen = centripetalForce * forceScale;
    const forceAngle = angle + Math.PI;
    const forceEndX = objX + forceLen * Math.cos(forceAngle);
    const forceEndY = objY + forceLen * Math.sin(forceAngle);
    drawArrow(ctx, objX, objY, forceEndX, forceEndY, COLORS.force, 3, 10);
    drawText(ctx, `Fc`, forceEndX + 15 * Math.cos(forceAngle), forceEndY + 15 * Math.sin(forceAngle), COLORS.force, 12);

    // Trail
    ctx.strokeStyle = COLORS.position + "40";
    ctx.lineWidth = 3;
    ctx.beginPath();
    const trailLength = Math.PI / 2;
    for (let a = angle - trailLength; a <= angle; a += 0.05) {
      const tx = centerX + radius * Math.cos(a);
      const ty = centerY + radius * Math.sin(a);
      if (a === angle - trailLength) ctx.moveTo(tx, ty);
      else ctx.lineTo(tx, ty);
    }
    ctx.stroke();

    // Info panel
    ctx.fillStyle = "rgba(17, 24, 39, 0.95)";
    ctx.fillRect(10, 10, 200, 130);
    ctx.strokeStyle = COLORS.border;
    ctx.strokeRect(10, 10, 200, 130);

    drawText(ctx, "Circular Motion", 110, 30, COLORS.textPrimary, 14);
    drawText(ctx, `Fc = mv²/r`, 20, 55, COLORS.force, 12, "left");
    drawText(ctx, `Fc = ${centripetalForce.toFixed(1)} N`, 20, 75, COLORS.force, 11, "left");
    drawText(ctx, `ac = ${centripetalAccel.toFixed(2)} m/s²`, 20, 95, COLORS.energy, 11, "left");
    drawText(ctx, `ω = ${angularVelocity.toFixed(2)} rad/s`, 20, 115, COLORS.velocity, 11, "left");
    drawText(ctx, `T = ${period.toFixed(2)} s`, 20, 135, COLORS.textSecondary, 11, "left");

    // Formula breakdown
    ctx.fillStyle = "rgba(17, 24, 39, 0.95)";
    ctx.fillRect(width - 180, height - 50, 170, 40);
    ctx.strokeStyle = COLORS.border;
    ctx.strokeRect(width - 180, height - 50, 170, 40);

    drawText(
      ctx,
      `${mass} × ${speed}² / ${(radius / 50).toFixed(1)} = ${centripetalForce.toFixed(1)}N`,
      width - 95,
      height - 25,
      COLORS.textSecondary,
      11
    );

  }, [mass, radius, speed, angle]);

  useEffect(() => {
    if (isPlaying) {
      animRef.current = requestAnimationFrame(function animate() {
        setAngle((a) => (a + angularVelocity * 0.016) % (Math.PI * 2));
        animRef.current = requestAnimationFrame(animate);
      });
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, angularVelocity]);

  return (
    <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: 16, border: `1px solid ${COLORS.border}` }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.rotation, marginBottom: 12 }}>
        Centripetal Force
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ borderRadius: 8, display: "block", maxWidth: "100%" }}
      />
      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, color: COLORS.textSecondary, fontSize: 12 }}>
          Mass (kg):
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="range"
              min="1"
              max="10"
              value={mass}
              onChange={(e) => setMass(parseInt(e.target.value))}
              style={{ width: 80 }}
            />
            <span style={{ fontFamily: FONTS.mono }}>{mass}</span>
          </div>
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, color: COLORS.textSecondary, fontSize: 12 }}>
          Radius (m):
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="range"
              min="50"
              max="150"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              style={{ width: 80 }}
            />
            <span style={{ fontFamily: FONTS.mono }}>{(radius / 50).toFixed(1)}</span>
          </div>
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, color: COLORS.textSecondary, fontSize: 12 }}>
          Speed (m/s):
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="range"
              min="1"
              max="15"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              style={{ width: 80 }}
            />
            <span style={{ fontFamily: FONTS.mono }}>{speed}</span>
          </div>
        </label>
      </div>
      <div style={{ marginTop: 12 }}>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            background: isPlaying ? COLORS.border : COLORS.accent,
            color: isPlaying ? COLORS.textPrimary : COLORS.bg,
            border: "none",
            borderRadius: 6,
            padding: "8px 20px",
            fontFamily: FONTS.mono,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
}
