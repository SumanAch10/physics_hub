import { useRef, useEffect, useState } from "react";
import { COLORS, FONTS } from "../../../styles/theme";
import { drawGrid, drawArrow, drawCircle, drawDashedLine, drawText } from "../../../utils/canvasHelpers";

export default function ProjectileMotion() {
  const canvasRef = useRef(null);
  const [angle, setAngle] = useState(45);
  const [speed, setSpeed] = useState(20);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trail, setTrail] = useState([]);
  const animRef = useRef(null);

  const width = 600;
  const height = 350;
  const g = 9.8;
  const scale = 8;
  const groundY = height - 40;
  const launchX = 60;

  const angleRad = (angle * Math.PI) / 180;
  const vx = speed * Math.cos(angleRad);
  const vy = speed * Math.sin(angleRad);
  const totalTime = (2 * vy) / g;
  const maxHeight = (vy * vy) / (2 * g);
  const range = vx * totalTime;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, width, height);

    // Grid
    drawGrid(ctx, width, height, launchX, groundY, 50);

    // Ground
    ctx.fillStyle = COLORS.border;
    ctx.fillRect(0, groundY, width, height - groundY);

    // Trail
    ctx.strokeStyle = COLORS.position;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    for (let t = 0; t <= totalTime; t += 0.02) {
      const x = launchX + vx * t * scale;
      const y = groundY - (vy * t - 0.5 * g * t * t) * scale;
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Actual trail points
    trail.forEach((pt, i) => {
      const alpha = 0.3 + (i / trail.length) * 0.7;
      ctx.globalAlpha = alpha;
      drawCircle(ctx, pt.x, pt.y, 3, COLORS.velocity);
    });
    ctx.globalAlpha = 1;

    // Current position
    const currentX = launchX + vx * time * scale;
    const currentY = groundY - (vy * time - 0.5 * g * time * time) * scale;

    if (time > 0 && time <= totalTime) {
      // Velocity vectors
      const currVy = vy - g * time;
      const vScale = 2;

      // Horizontal velocity
      drawArrow(ctx, currentX, currentY, currentX + vx * vScale, currentY, COLORS.velocity, 2, 8);

      // Vertical velocity
      drawArrow(ctx, currentX, currentY, currentX, currentY - currVy * vScale, COLORS.energy, 2, 8);

      // Resultant velocity
      const vMag = Math.sqrt(vx * vx + currVy * currVy);
      const vAngle = Math.atan2(currVy, vx);
      drawArrow(
        ctx,
        currentX,
        currentY,
        currentX + vMag * vScale * Math.cos(vAngle),
        currentY - vMag * vScale * Math.sin(vAngle),
        COLORS.position,
        3,
        10
      );
    }

    // Projectile
    if (time <= totalTime) {
      drawCircle(ctx, currentX, currentY, 10, COLORS.accent, COLORS.textPrimary);
    }

    // Launch angle arc
    ctx.strokeStyle = COLORS.textSecondary;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(launchX, groundY, 30, -Math.PI / 2, -angleRad - Math.PI / 2, true);
    ctx.stroke();
    drawText(ctx, `${angle}°`, launchX + 40, groundY - 15, COLORS.textSecondary, 11);

    // Max height indicator
    if (maxHeight * scale < groundY - 20) {
      const maxHeightY = groundY - maxHeight * scale;
      drawDashedLine(ctx, 0, maxHeightY, width, maxHeightY, COLORS.energy);
      drawText(ctx, `H = ${maxHeight.toFixed(1)}m`, width - 60, maxHeightY - 8, COLORS.energy, 10, "right");
    }

    // Range indicator
    const rangeX = launchX + range * scale;
    if (rangeX < width - 20) {
      drawDashedLine(ctx, rangeX, groundY, rangeX, groundY - 20, COLORS.momentum);
      drawText(ctx, `R = ${range.toFixed(1)}m`, rangeX, groundY + 20, COLORS.momentum, 10);
    }

    // Info panel
    ctx.fillStyle = "rgba(17, 24, 39, 0.9)";
    ctx.fillRect(10, 10, 150, 80);
    ctx.strokeStyle = COLORS.border;
    ctx.strokeRect(10, 10, 150, 80);

    drawText(ctx, `vₓ = ${vx.toFixed(1)} m/s`, 20, 30, COLORS.velocity, 11, "left");
    drawText(ctx, `vᵧ₀ = ${vy.toFixed(1)} m/s`, 20, 48, COLORS.energy, 11, "left");
    drawText(ctx, `T = ${totalTime.toFixed(2)} s`, 20, 66, COLORS.textSecondary, 11, "left");
    drawText(ctx, `t = ${time.toFixed(2)} s`, 20, 84, COLORS.accent, 11, "left");

  }, [angle, speed, time, trail]);

  useEffect(() => {
    if (isPlaying) {
      animRef.current = requestAnimationFrame(function animate() {
        setTime((t) => {
          if (t >= totalTime) {
            setIsPlaying(false);
            return totalTime;
          }
          const newT = t + 0.02;
          const x = launchX + vx * newT * scale;
          const y = groundY - (vy * newT - 0.5 * g * newT * newT) * scale;
          setTrail((prev) => [...prev.slice(-50), { x, y }]);
          return newT;
        });
        animRef.current = requestAnimationFrame(animate);
      });
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, totalTime, vx, vy]);

  const reset = () => {
    setIsPlaying(false);
    setTime(0);
    setTrail([]);
  };

  return (
    <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: 16, border: `1px solid ${COLORS.border}` }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.accent, marginBottom: 12 }}>
        Projectile Motion
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ borderRadius: 8, display: "block", maxWidth: "100%" }}
      />
      <div style={{ marginTop: 16, display: "flex", gap: 20, flexWrap: "wrap" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.textSecondary, fontSize: 13 }}>
          Angle (°):
          <input
            type="range"
            min="10"
            max="80"
            value={angle}
            onChange={(e) => { setAngle(parseInt(e.target.value)); reset(); }}
            style={{ width: 100 }}
          />
          <span style={{ color: COLORS.textPrimary, fontFamily: FONTS.mono, width: 30 }}>{angle}</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.textSecondary, fontSize: 13 }}>
          Speed (m/s):
          <input
            type="range"
            min="5"
            max="30"
            value={speed}
            onChange={(e) => { setSpeed(parseInt(e.target.value)); reset(); }}
            style={{ width: 100 }}
          />
          <span style={{ color: COLORS.accent, fontFamily: FONTS.mono, width: 30 }}>{speed}</span>
        </label>
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            background: COLORS.accent,
            color: COLORS.bg,
            border: "none",
            borderRadius: 6,
            padding: "8px 20px",
            fontFamily: FONTS.mono,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          {isPlaying ? "Pause" : "Launch"}
        </button>
        <button
          onClick={reset}
          style={{
            background: COLORS.border,
            color: COLORS.textPrimary,
            border: "none",
            borderRadius: 6,
            padding: "8px 16px",
            fontFamily: FONTS.mono,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
