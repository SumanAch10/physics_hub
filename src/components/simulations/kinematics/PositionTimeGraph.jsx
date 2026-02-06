import { useRef, useEffect, useState } from "react";
import { COLORS, FONTS } from "../../../styles/theme";
import { drawGrid, drawText, drawCircle } from "../../../utils/canvasHelpers";

export default function PositionTimeGraph() {
  const canvasRef = useRef(null);
  const [velocity, setVelocity] = useState(2);
  const [initialPos, setInitialPos] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const animRef = useRef(null);

  const width = 600;
  const height = 300;
  const padding = 50;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;
  const maxTime = 10;
  const maxPos = 25;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear
    ctx.fillStyle = COLORS.bgCard;
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    const scaleX = graphWidth / maxTime;
    const scaleY = graphHeight / maxPos;

    ctx.strokeStyle = COLORS.gridLine;
    ctx.lineWidth = 1;

    // Vertical grid lines
    for (let t = 0; t <= maxTime; t += 2) {
      const x = padding + t * scaleX;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
      drawText(ctx, `${t}s`, x, height - padding + 20, COLORS.textSecondary, 11);
    }

    // Horizontal grid lines
    for (let p = 0; p <= maxPos; p += 5) {
      const y = height - padding - p * scaleY;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      drawText(ctx, `${p}m`, padding - 25, y + 4, COLORS.textSecondary, 11);
    }

    // Axes
    ctx.strokeStyle = COLORS.textSecondary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Labels
    drawText(ctx, "Position (m)", padding - 10, padding - 15, COLORS.position, 12, "left");
    drawText(ctx, "Time (s)", width - padding + 10, height - padding + 5, COLORS.velocity, 12, "right");

    // Draw position line: x = x0 + vt
    ctx.strokeStyle = COLORS.position;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let t = 0; t <= maxTime; t += 0.1) {
      const pos = initialPos + velocity * t;
      if (pos < 0 || pos > maxPos) continue;
      const x = padding + t * scaleX;
      const y = height - padding - pos * scaleY;
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Current point
    const currentPos = initialPos + velocity * time;
    if (currentPos >= 0 && currentPos <= maxPos && time <= maxTime) {
      const x = padding + time * scaleX;
      const y = height - padding - currentPos * scaleY;
      drawCircle(ctx, x, y, 8, COLORS.position, COLORS.textPrimary);

      // Value label
      ctx.fillStyle = COLORS.bgCard;
      ctx.fillRect(x + 12, y - 25, 70, 20);
      drawText(ctx, `${currentPos.toFixed(1)}m`, x + 45, y - 12, COLORS.position, 11);
    }

    // Equation
    const sign = velocity >= 0 ? "+" : "";
    drawText(
      ctx,
      `x(t) = ${initialPos} ${sign} ${velocity}t`,
      width / 2,
      30,
      COLORS.textPrimary,
      14
    );
  }, [velocity, initialPos, time]);

  useEffect(() => {
    if (isPlaying) {
      animRef.current = requestAnimationFrame(function animate() {
        setTime((t) => {
          if (t >= maxTime) {
            setIsPlaying(false);
            return maxTime;
          }
          return t + 0.05;
        });
        animRef.current = requestAnimationFrame(animate);
      });
    } else {
      cancelAnimationFrame(animRef.current);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying]);

  const reset = () => {
    setIsPlaying(false);
    setTime(0);
  };

  return (
    <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: 16, border: `1px solid ${COLORS.border}` }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.position, marginBottom: 12 }}>
        Position vs Time
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ borderRadius: 8, display: "block", maxWidth: "100%" }}
      />
      <div style={{ marginTop: 16, display: "flex", gap: 16, flexWrap: "wrap" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.textSecondary, fontSize: 13 }}>
          Velocity (m/s):
          <input
            type="range"
            min="-5"
            max="5"
            step="0.5"
            value={velocity}
            onChange={(e) => setVelocity(parseFloat(e.target.value))}
            style={{ width: 100 }}
          />
          <span style={{ color: COLORS.velocity, fontFamily: FONTS.mono, width: 40 }}>{velocity}</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.textSecondary, fontSize: 13 }}>
          Initial Position (m):
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={initialPos}
            onChange={(e) => setInitialPos(parseFloat(e.target.value))}
            style={{ width: 100 }}
          />
          <span style={{ color: COLORS.position, fontFamily: FONTS.mono, width: 30 }}>{initialPos}</span>
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
            padding: "8px 16px",
            fontFamily: FONTS.mono,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          {isPlaying ? "Pause" : "Play"}
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
