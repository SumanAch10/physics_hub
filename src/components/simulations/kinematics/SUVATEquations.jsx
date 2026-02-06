import { useRef, useEffect, useState } from "react";
import { COLORS, FONTS } from "../../../styles/theme";
import { drawArrow, drawText, drawCircle, drawDashedLine } from "../../../utils/canvasHelpers";

export default function SUVATEquations() {
  const canvasRef = useRef(null);
  const [initialVel, setInitialVel] = useState(5);
  const [finalVel, setFinalVel] = useState(15);
  const [acceleration, setAcceleration] = useState(2);
  const [time, setTime] = useState(5);
  const [activeEquation, setActiveEquation] = useState(0);
  const [animTime, setAnimTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animRef = useRef(null);

  const width = 620;
  const height = 300;
  const groundY = height - 50;

  // Calculate derived values
  const calcFinalVel = initialVel + acceleration * time;
  const calcDisplacement = initialVel * time + 0.5 * acceleration * time * time;
  const calcDisplacementV2 = (finalVel * finalVel - initialVel * initialVel) / (2 * acceleration);
  const calcDisplacementAvg = 0.5 * (initialVel + finalVel) * time;

  const equations = [
    {
      name: "v = u + at",
      desc: "Final velocity from initial velocity and acceleration",
      result: `v = ${initialVel} + (${acceleration})(${time}) = ${calcFinalVel.toFixed(1)} m/s`,
      color: COLORS.velocity
    },
    {
      name: "s = ut + ½at²",
      desc: "Displacement from initial velocity and acceleration",
      result: `s = (${initialVel})(${time}) + ½(${acceleration})(${time})² = ${calcDisplacement.toFixed(1)} m`,
      color: COLORS.position
    },
    {
      name: "v² = u² + 2as",
      desc: "Final velocity from displacement (no time)",
      result: `s = (${finalVel}² - ${initialVel}²) / 2(${acceleration}) = ${calcDisplacementV2.toFixed(1)} m`,
      color: COLORS.energy
    },
    {
      name: "s = ½(u + v)t",
      desc: "Displacement from average velocity",
      result: `s = ½(${initialVel} + ${finalVel})(${time}) = ${calcDisplacementAvg.toFixed(1)} m`,
      color: COLORS.momentum
    },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, width, height);

    // Ground
    ctx.fillStyle = COLORS.border;
    ctx.fillRect(0, groundY, width, height - groundY);

    // Grid
    ctx.strokeStyle = COLORS.gridLine;
    for (let x = 50; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, groundY);
      ctx.stroke();
    }

    // Distance markers
    const pixelScale = 10;
    for (let d = 0; d <= 50; d += 10) {
      const x = 50 + d * pixelScale;
      drawText(ctx, `${d}m`, x, groundY + 20, COLORS.textSecondary, 10);
    }

    // Current displacement based on animation
    const currentDisp = initialVel * animTime + 0.5 * acceleration * animTime * animTime;
    const currentVel = initialVel + acceleration * animTime;

    // Object
    const objX = 50 + Math.min(currentDisp, 50) * pixelScale;
    const objY = groundY - 25;

    // Trail
    ctx.fillStyle = COLORS.accent + "30";
    for (let t = 0; t < animTime; t += 0.1) {
      const trailDisp = initialVel * t + 0.5 * acceleration * t * t;
      const trailX = 50 + Math.min(trailDisp, 50) * pixelScale;
      ctx.beginPath();
      ctx.arc(trailX, objY, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw object
    ctx.fillStyle = COLORS.bgCardHover;
    ctx.strokeStyle = COLORS.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(objX - 20, objY - 15, 40, 30, 5);
    ctx.fill();
    ctx.stroke();

    // Velocity arrow on object
    const velScale = 5;
    const velLen = Math.min(currentVel * velScale, 100);
    if (velLen > 5) {
      drawArrow(ctx, objX + 25, objY, objX + 25 + velLen, objY, COLORS.velocity, 3, 10);
      drawText(ctx, `v = ${currentVel.toFixed(1)}`, objX + 25 + velLen / 2, objY - 20, COLORS.velocity, 11);
    }

    // Initial velocity indicator
    drawArrow(ctx, 50, objY - 40, 50 + initialVel * velScale, objY - 40, COLORS.momentum, 2, 8);
    drawText(ctx, `u = ${initialVel} m/s`, 50 + initialVel * velScale / 2, objY - 55, COLORS.momentum, 10);

    // Acceleration indicator
    if (acceleration !== 0) {
      const accelX = objX;
      const accelLen = acceleration * 15;
      drawArrow(ctx, accelX, objY + 25, accelX + accelLen, objY + 25, COLORS.force, 2, 8);
      drawText(ctx, `a = ${acceleration} m/s²`, accelX + accelLen / 2 + 20, objY + 40, COLORS.force, 10);
    }

    // Displacement bracket
    if (currentDisp > 0) {
      const dispEndX = 50 + Math.min(currentDisp, 50) * pixelScale;
      ctx.strokeStyle = COLORS.position;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, groundY - 5);
      ctx.lineTo(50, groundY + 5);
      ctx.moveTo(50, groundY);
      ctx.lineTo(dispEndX, groundY);
      ctx.moveTo(dispEndX, groundY - 5);
      ctx.lineTo(dispEndX, groundY + 5);
      ctx.stroke();
      drawText(ctx, `s = ${currentDisp.toFixed(1)}m`, (50 + dispEndX) / 2, groundY + 35, COLORS.position, 11);
    }

    // Time display
    drawText(ctx, `t = ${animTime.toFixed(2)}s`, width - 60, 30, COLORS.accent, 14);

    // Active equation highlight
    const eq = equations[activeEquation];
    ctx.fillStyle = eq.color + "15";
    ctx.fillRect(10, 10, 250, 50);
    ctx.strokeStyle = eq.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 250, 50);
    drawText(ctx, eq.name, 135, 30, eq.color, 16);
    drawText(ctx, eq.desc.slice(0, 35), 135, 48, COLORS.textSecondary, 9);

  }, [initialVel, finalVel, acceleration, time, activeEquation, animTime]);

  useEffect(() => {
    if (isPlaying) {
      animRef.current = requestAnimationFrame(function animate() {
        setAnimTime((t) => {
          if (t >= time) {
            setIsPlaying(false);
            return time;
          }
          return t + 0.03;
        });
        animRef.current = requestAnimationFrame(animate);
      });
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, time]);

  const reset = () => {
    setIsPlaying(false);
    setAnimTime(0);
  };

  return (
    <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: 16, border: `1px solid ${COLORS.border}` }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.accent, marginBottom: 12 }}>
        SUVAT Equations of Motion
      </div>

      {/* Equation selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {equations.map((eq, i) => (
          <button
            key={i}
            onClick={() => setActiveEquation(i)}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: `1px solid ${activeEquation === i ? eq.color : COLORS.border}`,
              background: activeEquation === i ? eq.color + "20" : COLORS.bg,
              color: activeEquation === i ? eq.color : COLORS.textSecondary,
              fontFamily: FONTS.mono,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {eq.name}
          </button>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ borderRadius: 8, display: "block", maxWidth: "100%" }}
      />

      {/* Result display */}
      <div style={{
        marginTop: 12,
        padding: 12,
        background: equations[activeEquation].color + "10",
        borderRadius: 8,
        border: `1px solid ${equations[activeEquation].color}30`,
      }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: equations[activeEquation].color }}>
          {equations[activeEquation].result}
        </div>
      </div>

      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, color: COLORS.textSecondary, fontSize: 11 }}>
          Initial Velocity (u)
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="range"
              min="0"
              max="20"
              value={initialVel}
              onChange={(e) => { setInitialVel(parseFloat(e.target.value)); reset(); }}
              style={{ width: 60 }}
            />
            <span style={{ fontFamily: FONTS.mono, color: COLORS.momentum }}>{initialVel} m/s</span>
          </div>
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, color: COLORS.textSecondary, fontSize: 11 }}>
          Final Velocity (v)
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="range"
              min="0"
              max="30"
              value={finalVel}
              onChange={(e) => { setFinalVel(parseFloat(e.target.value)); reset(); }}
              style={{ width: 60 }}
            />
            <span style={{ fontFamily: FONTS.mono, color: COLORS.velocity }}>{finalVel} m/s</span>
          </div>
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, color: COLORS.textSecondary, fontSize: 11 }}>
          Acceleration (a)
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.5"
              value={acceleration}
              onChange={(e) => { setAcceleration(parseFloat(e.target.value)); reset(); }}
              style={{ width: 60 }}
            />
            <span style={{ fontFamily: FONTS.mono, color: COLORS.force }}>{acceleration} m/s²</span>
          </div>
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, color: COLORS.textSecondary, fontSize: 11 }}>
          Time (t)
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={time}
              onChange={(e) => { setTime(parseFloat(e.target.value)); reset(); }}
              style={{ width: 60 }}
            />
            <span style={{ fontFamily: FONTS.mono, color: COLORS.accent }}>{time} s</span>
          </div>
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
          {isPlaying ? "Pause" : "Simulate"}
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
