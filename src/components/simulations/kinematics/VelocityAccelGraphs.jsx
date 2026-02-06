import { useRef, useEffect, useState } from "react";
import { COLORS, FONTS } from "../../../styles/theme";
import { drawText, drawCircle } from "../../../utils/canvasHelpers";

export default function VelocityAccelGraphs() {
  const velCanvasRef = useRef(null);
  const accelCanvasRef = useRef(null);
  const [initialVel, setInitialVel] = useState(5);
  const [acceleration, setAcceleration] = useState(-1);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animRef = useRef(null);

  const width = 280;
  const height = 200;
  const padding = 40;
  const maxTime = 10;
  const maxVel = 10;
  const minVel = -10;

  const drawGraph = (canvas, type) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;
    const scaleX = graphWidth / maxTime;
    const scaleY = graphHeight / (maxVel - minVel);

    ctx.fillStyle = COLORS.bgCard;
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = COLORS.gridLine;
    ctx.lineWidth = 1;
    for (let t = 0; t <= maxTime; t += 2) {
      const x = padding + t * scaleX;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }
    for (let v = minVel; v <= maxVel; v += 5) {
      const y = height - padding - (v - minVel) * scaleY;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Zero line
    const zeroY = height - padding - (0 - minVel) * scaleY;
    ctx.strokeStyle = "rgba(241,245,249,0.2)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padding, zeroY);
    ctx.lineTo(width - padding, zeroY);
    ctx.stroke();

    // Axes
    ctx.strokeStyle = COLORS.textSecondary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    if (type === "velocity") {
      // v(t) = v0 + at
      ctx.strokeStyle = COLORS.velocity;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let t = 0; t <= maxTime; t += 0.1) {
        const v = initialVel + acceleration * t;
        const clampedV = Math.max(minVel, Math.min(maxVel, v));
        const x = padding + t * scaleX;
        const y = height - padding - (clampedV - minVel) * scaleY;
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Current point
      const currentVel = Math.max(minVel, Math.min(maxVel, initialVel + acceleration * time));
      const x = padding + time * scaleX;
      const y = height - padding - (currentVel - minVel) * scaleY;
      drawCircle(ctx, x, y, 6, COLORS.velocity, COLORS.textPrimary);

      drawText(ctx, "v(t)", width / 2, 20, COLORS.velocity, 12);
      drawText(ctx, `${currentVel.toFixed(1)} m/s`, width - padding, 20, COLORS.velocity, 11, "right");
    } else {
      // Constant acceleration
      ctx.strokeStyle = COLORS.force;
      ctx.lineWidth = 3;
      const aY = height - padding - (acceleration - minVel) * scaleY;
      ctx.beginPath();
      ctx.moveTo(padding, aY);
      ctx.lineTo(width - padding, aY);
      ctx.stroke();

      // Current point
      const x = padding + time * scaleX;
      drawCircle(ctx, x, aY, 6, COLORS.force, COLORS.textPrimary);

      drawText(ctx, "a(t)", width / 2, 20, COLORS.force, 12);
      drawText(ctx, `${acceleration.toFixed(1)} m/s²`, width - padding, 20, COLORS.force, 11, "right");
    }
  };

  useEffect(() => {
    drawGraph(velCanvasRef.current, "velocity");
    drawGraph(accelCanvasRef.current, "acceleration");
  }, [initialVel, acceleration, time]);

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

  return (
    <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: 16, border: `1px solid ${COLORS.border}` }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.velocity, marginBottom: 12 }}>
        Velocity & Acceleration vs Time
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <canvas ref={velCanvasRef} width={width} height={height} style={{ borderRadius: 8 }} />
        <canvas ref={accelCanvasRef} width={width} height={height} style={{ borderRadius: 8 }} />
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 16, flexWrap: "wrap" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.textSecondary, fontSize: 13 }}>
          v₀ (m/s):
          <input
            type="range"
            min="-5"
            max="10"
            step="0.5"
            value={initialVel}
            onChange={(e) => setInitialVel(parseFloat(e.target.value))}
            style={{ width: 80 }}
          />
          <span style={{ color: COLORS.velocity, fontFamily: FONTS.mono, width: 35 }}>{initialVel}</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.textSecondary, fontSize: 13 }}>
          a (m/s²):
          <input
            type="range"
            min="-3"
            max="3"
            step="0.5"
            value={acceleration}
            onChange={(e) => setAcceleration(parseFloat(e.target.value))}
            style={{ width: 80 }}
          />
          <span style={{ color: COLORS.force, fontFamily: FONTS.mono, width: 35 }}>{acceleration}</span>
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
          onClick={() => { setIsPlaying(false); setTime(0); }}
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
      <div style={{ marginTop: 12, fontFamily: FONTS.mono, fontSize: 12, color: COLORS.textSecondary }}>
        v(t) = {initialVel} + ({acceleration})t = {(initialVel + acceleration * time).toFixed(1)} m/s
      </div>
    </div>
  );
}
