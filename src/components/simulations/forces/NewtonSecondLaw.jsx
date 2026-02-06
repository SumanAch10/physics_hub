import { useRef, useEffect, useState } from "react";
import { COLORS, FONTS } from "../../../styles/theme";
import { drawArrow, drawText, drawCircle } from "../../../utils/canvasHelpers";

export default function NewtonSecondLaw() {
  const canvasRef = useRef(null);
  const [mass, setMass] = useState(5);
  const [force, setForce] = useState(20);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animRef = useRef(null);

  const width = 600;
  const height = 250;
  const groundY = height - 50;

  const acceleration = force / mass;
  const maxTime = 5;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, width, height);

    // Ground
    ctx.fillStyle = COLORS.border;
    ctx.fillRect(0, groundY, width, height - groundY);

    // Grid lines
    ctx.strokeStyle = COLORS.gridLine;
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, groundY);
      ctx.stroke();
    }

    // Position calculation: x = 0.5 * a * t^2
    const position = 0.5 * acceleration * time * time;
    const velocity = acceleration * time;

    // Scale position for display
    const pixelScale = 15;
    const boxX = 60 + position * pixelScale;
    const boxSize = 30 + mass * 2;

    // Trail
    ctx.fillStyle = COLORS.velocity + "30";
    for (let t = 0; t < time; t += 0.2) {
      const trailPos = 0.5 * acceleration * t * t;
      const trailX = 60 + trailPos * pixelScale;
      ctx.beginPath();
      ctx.arc(trailX, groundY - boxSize / 2, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Object
    const boxY = groundY - boxSize;
    ctx.fillStyle = COLORS.bgCardHover;
    ctx.strokeStyle = COLORS.accent;
    ctx.lineWidth = 2;
    ctx.fillRect(boxX - boxSize / 2, boxY, boxSize, boxSize);
    ctx.strokeRect(boxX - boxSize / 2, boxY, boxSize, boxSize);

    // Mass label on box
    drawText(ctx, `${mass}kg`, boxX, boxY + boxSize / 2 + 5, COLORS.textPrimary, 11);

    // Applied force arrow
    const forceScale = 3;
    const forceLen = force * forceScale;
    drawArrow(ctx, boxX - boxSize / 2 - 10, boxY + boxSize / 2, boxX - boxSize / 2 - 10 - forceLen, boxY + boxSize / 2, COLORS.force, 4, 12);
    ctx.save();
    ctx.translate(boxX - boxSize / 2 - forceLen / 2 - 10, boxY + boxSize / 2 - 15);
    drawText(ctx, `F = ${force}N`, 0, 0, COLORS.force, 12);
    ctx.restore();

    // Velocity arrow (if moving)
    if (velocity > 0.1) {
      const velScale = 5;
      const velLen = Math.min(velocity * velScale, 150);
      drawArrow(ctx, boxX + boxSize / 2 + 5, boxY + boxSize / 2, boxX + boxSize / 2 + 5 + velLen, boxY + boxSize / 2, COLORS.velocity, 3, 10);
      drawText(ctx, `v = ${velocity.toFixed(1)} m/s`, boxX + boxSize / 2 + velLen / 2 + 5, boxY + boxSize / 2 - 15, COLORS.velocity, 11);
    }

    // Acceleration arrow
    const accelScale = 10;
    const accelLen = acceleration * accelScale;
    drawArrow(ctx, boxX, boxY - 15, boxX + accelLen, boxY - 15, COLORS.energy, 2, 8);
    drawText(ctx, `a = ${acceleration.toFixed(2)} m/s²`, boxX + accelLen / 2, boxY - 30, COLORS.energy, 10);

    // Info panel
    ctx.fillStyle = "rgba(17, 24, 39, 0.95)";
    ctx.fillRect(width - 200, 10, 190, 100);
    ctx.strokeStyle = COLORS.border;
    ctx.strokeRect(width - 200, 10, 190, 100);

    drawText(ctx, "F = ma", width - 105, 35, COLORS.textPrimary, 16);
    drawText(ctx, `${force} = ${mass} × ${acceleration.toFixed(2)}`, width - 105, 60, COLORS.textSecondary, 12);
    drawText(ctx, `Position: ${position.toFixed(2)} m`, width - 190, 85, COLORS.position, 11, "left");
    drawText(ctx, `Time: ${time.toFixed(2)} s`, width - 190, 102, COLORS.accent, 11, "left");

  }, [mass, force, time]);

  useEffect(() => {
    if (isPlaying) {
      animRef.current = requestAnimationFrame(function animate() {
        setTime((t) => {
          const position = 0.5 * acceleration * t * t;
          if (t >= maxTime || position > 25) {
            setIsPlaying(false);
            return t;
          }
          return t + 0.03;
        });
        animRef.current = requestAnimationFrame(animate);
      });
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, acceleration]);

  const reset = () => {
    setIsPlaying(false);
    setTime(0);
  };

  return (
    <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: 16, border: `1px solid ${COLORS.border}` }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.force, marginBottom: 12 }}>
        Newton's Second Law: F = ma
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
            onChange={(e) => { setMass(parseInt(e.target.value)); reset(); }}
            style={{ width: 100 }}
          />
          <span style={{ color: COLORS.textPrimary, fontFamily: FONTS.mono, width: 30 }}>{mass}</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.textSecondary, fontSize: 13 }}>
          Force (N):
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={force}
            onChange={(e) => { setForce(parseInt(e.target.value)); reset(); }}
            style={{ width: 100 }}
          />
          <span style={{ color: COLORS.force, fontFamily: FONTS.mono, width: 35 }}>{force}</span>
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
          {isPlaying ? "Pause" : "Apply Force"}
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
