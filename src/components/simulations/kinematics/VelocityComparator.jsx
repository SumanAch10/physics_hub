import { useRef, useEffect, useState } from "react";
import { COLORS, FONTS } from "../../../styles/theme";
import { drawArrow, drawText, drawCircle } from "../../../utils/canvasHelpers";

export default function VelocityComparator() {
  const canvasRef = useRef(null);
  const [scenario, setScenario] = useState("acceleration");
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animRef = useRef(null);

  const scenarios = {
    acceleration: {
      name: "Acceleration",
      desc: "Object speeds up: v > u",
      u: 5,
      a: 3,
      duration: 5,
      color: COLORS.momentum,
    },
    deceleration: {
      name: "Deceleration",
      desc: "Object slows down: v < u",
      u: 20,
      a: -4,
      duration: 5,
      color: COLORS.force,
    },
    constant: {
      name: "Constant Velocity",
      desc: "No acceleration: v = u",
      u: 10,
      a: 0,
      duration: 5,
      color: COLORS.velocity,
    },
    freefall: {
      name: "Free Fall",
      desc: "Gravity accelerates object",
      u: 0,
      a: 9.8,
      duration: 4,
      color: COLORS.energy,
    },
  };

  const current = scenarios[scenario];
  const width = 600;
  const height = 320;

  const currentVel = current.u + current.a * time;
  const displacement = current.u * time + 0.5 * current.a * time * time;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, width, height);

    const graphLeft = 60;
    const graphRight = width - 40;
    const graphTop = 50;
    const graphBottom = 200;
    const graphWidth = graphRight - graphLeft;
    const graphHeight = graphBottom - graphTop;

    // Grid
    ctx.strokeStyle = COLORS.gridLine;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const x = graphLeft + (i / 5) * graphWidth;
      ctx.beginPath();
      ctx.moveTo(x, graphTop);
      ctx.lineTo(x, graphBottom);
      ctx.stroke();
      drawText(ctx, `${i}s`, x, graphBottom + 15, COLORS.textSecondary, 10);
    }

    const maxVel = Math.max(current.u, current.u + current.a * current.duration, 25);
    const minVel = Math.min(0, current.u + current.a * current.duration);
    const velRange = maxVel - minVel;

    for (let v = Math.ceil(minVel / 5) * 5; v <= maxVel; v += 5) {
      const y = graphBottom - ((v - minVel) / velRange) * graphHeight;
      ctx.beginPath();
      ctx.moveTo(graphLeft, y);
      ctx.lineTo(graphRight, y);
      ctx.stroke();
      drawText(ctx, `${v}`, graphLeft - 20, y + 4, COLORS.textSecondary, 10);
    }

    // Axes
    ctx.strokeStyle = COLORS.textSecondary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(graphLeft, graphTop);
    ctx.lineTo(graphLeft, graphBottom);
    ctx.lineTo(graphRight, graphBottom);
    ctx.stroke();

    // Zero line
    const zeroY = graphBottom - ((0 - minVel) / velRange) * graphHeight;
    if (minVel < 0) {
      ctx.strokeStyle = COLORS.textSecondary + "50";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(graphLeft, zeroY);
      ctx.lineTo(graphRight, zeroY);
      ctx.stroke();
    }

    // Velocity line (v = u + at)
    ctx.strokeStyle = current.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let t = 0; t <= current.duration; t += 0.1) {
      const v = current.u + current.a * t;
      const x = graphLeft + (t / current.duration) * graphWidth;
      const y = graphBottom - ((v - minVel) / velRange) * graphHeight;
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Initial velocity marker
    const uY = graphBottom - ((current.u - minVel) / velRange) * graphHeight;
    drawCircle(ctx, graphLeft, uY, 8, COLORS.momentum, COLORS.textPrimary);
    drawText(ctx, `u = ${current.u}`, graphLeft + 20, uY - 10, COLORS.momentum, 11, "left");

    // Current point
    const currentX = graphLeft + (time / current.duration) * graphWidth;
    const currentY = graphBottom - ((currentVel - minVel) / velRange) * graphHeight;

    // Vertical line from current point to x-axis
    ctx.strokeStyle = COLORS.accent + "50";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(currentX, currentY);
    ctx.lineTo(currentX, graphBottom);
    ctx.stroke();
    ctx.setLineDash([]);

    drawCircle(ctx, currentX, currentY, 10, current.color, COLORS.textPrimary);

    // Final velocity (at current time)
    drawText(ctx, `v = ${currentVel.toFixed(1)} m/s`, currentX + 15, currentY - 15, COLORS.velocity, 12, "left");

    // Axis labels
    drawText(ctx, "Velocity (m/s)", graphLeft - 10, graphTop - 15, COLORS.velocity, 11, "left");
    drawText(ctx, "Time (s)", graphRight, graphBottom + 15, COLORS.accent, 11, "right");

    // Info boxes at bottom
    const boxY = 230;
    const boxHeight = 70;
    const boxWidth = 130;
    const gap = 15;

    // Initial Velocity box
    ctx.fillStyle = COLORS.momentum + "20";
    ctx.fillRect(graphLeft, boxY, boxWidth, boxHeight);
    ctx.strokeStyle = COLORS.momentum;
    ctx.lineWidth = 2;
    ctx.strokeRect(graphLeft, boxY, boxWidth, boxHeight);
    drawText(ctx, "Initial Velocity", graphLeft + boxWidth / 2, boxY + 20, COLORS.textSecondary, 10);
    drawText(ctx, "u", graphLeft + boxWidth / 2, boxY + 40, COLORS.momentum, 16);
    drawText(ctx, `${current.u} m/s`, graphLeft + boxWidth / 2, boxY + 58, COLORS.momentum, 12);

    // Current/Final Velocity box
    ctx.fillStyle = COLORS.velocity + "20";
    ctx.fillRect(graphLeft + boxWidth + gap, boxY, boxWidth, boxHeight);
    ctx.strokeStyle = COLORS.velocity;
    ctx.strokeRect(graphLeft + boxWidth + gap, boxY, boxWidth, boxHeight);
    drawText(ctx, "Current Velocity", graphLeft + boxWidth + gap + boxWidth / 2, boxY + 20, COLORS.textSecondary, 10);
    drawText(ctx, "v", graphLeft + boxWidth + gap + boxWidth / 2, boxY + 40, COLORS.velocity, 16);
    drawText(ctx, `${currentVel.toFixed(1)} m/s`, graphLeft + boxWidth + gap + boxWidth / 2, boxY + 58, COLORS.velocity, 12);

    // Change box
    const deltaV = currentVel - current.u;
    const deltaColor = deltaV > 0 ? COLORS.momentum : deltaV < 0 ? COLORS.force : COLORS.textSecondary;
    ctx.fillStyle = deltaColor + "20";
    ctx.fillRect(graphLeft + 2 * (boxWidth + gap), boxY, boxWidth, boxHeight);
    ctx.strokeStyle = deltaColor;
    ctx.strokeRect(graphLeft + 2 * (boxWidth + gap), boxY, boxWidth, boxHeight);
    drawText(ctx, "Change (Δv)", graphLeft + 2 * (boxWidth + gap) + boxWidth / 2, boxY + 20, COLORS.textSecondary, 10);
    drawText(ctx, "v - u", graphLeft + 2 * (boxWidth + gap) + boxWidth / 2, boxY + 40, deltaColor, 16);
    drawText(ctx, `${deltaV >= 0 ? "+" : ""}${deltaV.toFixed(1)} m/s`, graphLeft + 2 * (boxWidth + gap) + boxWidth / 2, boxY + 58, deltaColor, 12);

    // Displacement box
    ctx.fillStyle = COLORS.position + "20";
    ctx.fillRect(graphLeft + 3 * (boxWidth + gap), boxY, boxWidth, boxHeight);
    ctx.strokeStyle = COLORS.position;
    ctx.strokeRect(graphLeft + 3 * (boxWidth + gap), boxY, boxWidth, boxHeight);
    drawText(ctx, "Displacement", graphLeft + 3 * (boxWidth + gap) + boxWidth / 2, boxY + 20, COLORS.textSecondary, 10);
    drawText(ctx, "s", graphLeft + 3 * (boxWidth + gap) + boxWidth / 2, boxY + 40, COLORS.position, 16);
    drawText(ctx, `${displacement.toFixed(1)} m`, graphLeft + 3 * (boxWidth + gap) + boxWidth / 2, boxY + 58, COLORS.position, 12);

    // Area under curve (displacement visualization)
    if (time > 0) {
      ctx.fillStyle = COLORS.position + "20";
      ctx.beginPath();
      ctx.moveTo(graphLeft, graphBottom - ((current.u - minVel) / velRange) * graphHeight);
      for (let t = 0; t <= time; t += 0.1) {
        const v = current.u + current.a * t;
        const x = graphLeft + (t / current.duration) * graphWidth;
        const y = graphBottom - ((v - minVel) / velRange) * graphHeight;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(currentX, zeroY);
      ctx.lineTo(graphLeft, zeroY);
      ctx.closePath();
      ctx.fill();
    }

  }, [scenario, time, current]);

  useEffect(() => {
    if (isPlaying) {
      animRef.current = requestAnimationFrame(function animate() {
        setTime((t) => {
          if (t >= current.duration) {
            setIsPlaying(false);
            return current.duration;
          }
          return t + 0.02;
        });
        animRef.current = requestAnimationFrame(animate);
      });
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, current.duration]);

  return (
    <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: 16, border: `1px solid ${COLORS.border}` }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.velocity, marginBottom: 12 }}>
        Initial vs Final Velocity
      </div>

      {/* Scenario selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {Object.entries(scenarios).map(([key, s]) => (
          <button
            key={key}
            onClick={() => { setScenario(key); setTime(0); setIsPlaying(false); }}
            style={{
              padding: "8px 14px",
              borderRadius: 6,
              border: `1px solid ${scenario === key ? s.color : COLORS.border}`,
              background: scenario === key ? s.color + "20" : COLORS.bg,
              color: scenario === key ? s.color : COLORS.textSecondary,
              fontFamily: FONTS.mono,
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div style={{
        padding: 10,
        background: current.color + "10",
        borderRadius: 6,
        marginBottom: 12,
        fontSize: 12,
        color: current.color,
      }}>
        {current.desc} | a = {current.a} m/s²
      </div>

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ borderRadius: 8, display: "block", maxWidth: "100%" }}
      />

      <div style={{ marginTop: 16, display: "flex", gap: 16, alignItems: "center" }}>
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
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={() => { setTime(0); setIsPlaying(false); }}
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
        <label style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.textSecondary, fontSize: 12 }}>
          Time:
          <input
            type="range"
            min="0"
            max={current.duration}
            step="0.1"
            value={time}
            onChange={(e) => { setTime(parseFloat(e.target.value)); setIsPlaying(false); }}
            style={{ width: 150 }}
          />
          <span style={{ fontFamily: FONTS.mono, color: COLORS.accent }}>{time.toFixed(1)}s</span>
        </label>
      </div>

      {/* Equation display */}
      <div style={{
        marginTop: 16,
        padding: 12,
        background: COLORS.bg,
        borderRadius: 8,
        fontFamily: FONTS.mono,
        fontSize: 13,
      }}>
        <div style={{ color: COLORS.textSecondary, marginBottom: 8 }}>Equation: v = u + at</div>
        <div style={{ color: COLORS.textPrimary }}>
          v = {current.u} + ({current.a})({time.toFixed(2)}) = <span style={{ color: COLORS.velocity, fontWeight: 600 }}>{currentVel.toFixed(2)} m/s</span>
        </div>
      </div>
    </div>
  );
}
