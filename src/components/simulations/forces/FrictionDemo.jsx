import { useRef, useEffect, useState } from "react";
import { COLORS, FONTS } from "../../../styles/theme";
import { drawArrow, drawText } from "../../../utils/canvasHelpers";

export default function FrictionDemo() {
  const canvasRef = useRef(null);
  const [mass, setMass] = useState(10);
  const [appliedForce, setAppliedForce] = useState(30);
  const [muStatic, setMuStatic] = useState(0.5);
  const [muKinetic, setMuKinetic] = useState(0.3);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [velocity, setVelocity] = useState(0);
  const [position, setPosition] = useState(0);
  const animRef = useRef(null);

  const width = 600;
  const height = 280;
  const groundY = height - 60;
  const g = 9.8;

  const weight = mass * g;
  const normalForce = weight;
  const maxStaticFriction = muStatic * normalForce;
  const kineticFriction = muKinetic * normalForce;

  const isMoving = velocity > 0.01 || appliedForce > maxStaticFriction;
  const frictionForce = isMoving ? kineticFriction : Math.min(appliedForce, maxStaticFriction);
  const netForce = isMoving ? appliedForce - kineticFriction : (appliedForce > maxStaticFriction ? appliedForce - maxStaticFriction : 0);
  const acceleration = netForce / mass;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, width, height);

    // Ground with texture
    ctx.fillStyle = COLORS.border;
    ctx.fillRect(0, groundY, width, height - groundY);

    // Friction texture lines
    ctx.strokeStyle = COLORS.textSecondary + "30";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 8) {
      ctx.beginPath();
      ctx.moveTo(x, groundY);
      ctx.lineTo(x + 4, groundY + 20);
      ctx.stroke();
    }

    // Object
    const boxSize = 50;
    const pixelScale = 10;
    const boxX = 100 + position * pixelScale;
    const boxY = groundY - boxSize;

    ctx.fillStyle = COLORS.bgCardHover;
    ctx.strokeStyle = COLORS.accent;
    ctx.lineWidth = 2;
    ctx.fillRect(boxX, boxY, boxSize, boxSize);
    ctx.strokeRect(boxX, boxY, boxSize, boxSize);

    drawText(ctx, `${mass}kg`, boxX + boxSize / 2, boxY + boxSize / 2 + 5, COLORS.textPrimary, 12);

    const forceScale = 1.5;
    const centerX = boxX + boxSize / 2;
    const centerY = boxY + boxSize / 2;

    // Applied force (right)
    if (appliedForce > 0) {
      const fLen = appliedForce * forceScale;
      drawArrow(ctx, boxX - 5, centerY, boxX - 5 - fLen, centerY, COLORS.force, 3, 10);
      drawText(ctx, `F = ${appliedForce}N`, boxX - fLen / 2 - 5, centerY - 15, COLORS.force, 10);
    }

    // Friction force (left, opposing motion)
    if (frictionForce > 0) {
      const frLen = frictionForce * forceScale;
      drawArrow(ctx, boxX + boxSize + 5, centerY, boxX + boxSize + 5 + frLen, centerY, COLORS.energy, 3, 10);
      drawText(ctx, `f = ${frictionForce.toFixed(1)}N`, boxX + boxSize + frLen / 2 + 5, centerY - 15, COLORS.energy, 10);
    }

    // Weight (down)
    const wLen = weight * 0.3;
    drawArrow(ctx, centerX, boxY + boxSize, centerX, boxY + boxSize + wLen, COLORS.textSecondary, 2, 8);

    // Normal (up)
    drawArrow(ctx, centerX, boxY, centerX, boxY - wLen, COLORS.momentum, 2, 8);

    // Status indicator
    const statusColor = isMoving ? COLORS.velocity : (appliedForce >= maxStaticFriction * 0.9 ? COLORS.energy : COLORS.momentum);
    const status = isMoving ? "MOVING" : (appliedForce >= maxStaticFriction ? "ABOUT TO MOVE" : "STATIC");

    ctx.fillStyle = statusColor + "20";
    ctx.fillRect(boxX, boxY - 25, boxSize, 18);
    drawText(ctx, status, centerX, boxY - 12, statusColor, 9);

    // Info panel
    ctx.fillStyle = "rgba(17, 24, 39, 0.95)";
    ctx.fillRect(width - 220, 10, 210, 130);
    ctx.strokeStyle = COLORS.border;
    ctx.strokeRect(width - 220, 10, 210, 130);

    drawText(ctx, "Friction Analysis", width - 115, 30, COLORS.textPrimary, 13);
    drawText(ctx, `Weight: ${weight.toFixed(1)} N`, width - 210, 52, COLORS.textSecondary, 11, "left");
    drawText(ctx, `Normal: ${normalForce.toFixed(1)} N`, width - 210, 68, COLORS.momentum, 11, "left");
    drawText(ctx, `Max Static: ${maxStaticFriction.toFixed(1)} N`, width - 210, 84, COLORS.energy, 11, "left");
    drawText(ctx, `Kinetic: ${kineticFriction.toFixed(1)} N`, width - 210, 100, COLORS.energy, 11, "left");
    drawText(ctx, `Net Force: ${netForce.toFixed(1)} N`, width - 210, 120, COLORS.force, 11, "left");
    drawText(ctx, `a = ${acceleration.toFixed(2)} m/s²`, width - 210, 136, COLORS.velocity, 11, "left");

    // Friction comparison bar
    const barY = height - 25;
    const barWidth = 200;
    const barX = 10;

    ctx.fillStyle = COLORS.bgCard;
    ctx.fillRect(barX, barY - 15, barWidth + 60, 25);

    // Static friction threshold
    ctx.fillStyle = COLORS.energy + "40";
    ctx.fillRect(barX, barY, barWidth, 10);

    // Applied force bar
    const appliedRatio = Math.min(appliedForce / maxStaticFriction, 1);
    ctx.fillStyle = appliedForce > maxStaticFriction ? COLORS.force : COLORS.velocity;
    ctx.fillRect(barX, barY, barWidth * appliedRatio, 10);

    // Threshold line
    ctx.strokeStyle = COLORS.energy;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(barX + barWidth, barY - 2);
    ctx.lineTo(barX + barWidth, barY + 12);
    ctx.stroke();

    drawText(ctx, "μₛN", barX + barWidth + 15, barY + 8, COLORS.energy, 10, "left");

  }, [mass, appliedForce, muStatic, muKinetic, position, velocity, time]);

  useEffect(() => {
    if (isPlaying) {
      animRef.current = requestAnimationFrame(function animate() {
        const dt = 0.03;
        setVelocity((v) => {
          const isCurrentlyMoving = v > 0.01 || appliedForce > maxStaticFriction;
          const currentFriction = isCurrentlyMoving ? kineticFriction : 0;
          const netF = appliedForce - currentFriction;
          const a = netF / mass;

          if (!isCurrentlyMoving && appliedForce <= maxStaticFriction) {
            return 0;
          }

          const newV = Math.max(0, v + a * dt);
          return newV;
        });

        setPosition((p) => {
          const newP = p + velocity * 0.03;
          if (newP > 40) {
            setIsPlaying(false);
            return 40;
          }
          return newP;
        });

        setTime((t) => t + dt);
        animRef.current = requestAnimationFrame(animate);
      });
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, appliedForce, mass, velocity, maxStaticFriction, kineticFriction]);

  const reset = () => {
    setIsPlaying(false);
    setTime(0);
    setVelocity(0);
    setPosition(0);
  };

  return (
    <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: 16, border: `1px solid ${COLORS.border}` }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.energy, marginBottom: 12 }}>
        Static vs Kinetic Friction
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ borderRadius: 8, display: "block", maxWidth: "100%" }}
      />
      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.textSecondary, fontSize: 12 }}>
          Applied Force (N):
          <input
            type="range"
            min="0"
            max="100"
            value={appliedForce}
            onChange={(e) => setAppliedForce(parseInt(e.target.value))}
            style={{ width: 80 }}
          />
          <span style={{ fontFamily: FONTS.mono, width: 30 }}>{appliedForce}</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.textSecondary, fontSize: 12 }}>
          Mass (kg):
          <input
            type="range"
            min="1"
            max="20"
            value={mass}
            onChange={(e) => { setMass(parseInt(e.target.value)); reset(); }}
            style={{ width: 80 }}
          />
          <span style={{ fontFamily: FONTS.mono, width: 25 }}>{mass}</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.textSecondary, fontSize: 12 }}>
          μ static:
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={muStatic}
            onChange={(e) => { setMuStatic(parseFloat(e.target.value)); reset(); }}
            style={{ width: 80 }}
          />
          <span style={{ fontFamily: FONTS.mono, width: 35 }}>{muStatic}</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.textSecondary, fontSize: 12 }}>
          μ kinetic:
          <input
            type="range"
            min="0.05"
            max="0.8"
            step="0.05"
            value={muKinetic}
            onChange={(e) => { setMuKinetic(parseFloat(e.target.value)); reset(); }}
            style={{ width: 80 }}
          />
          <span style={{ fontFamily: FONTS.mono, width: 35 }}>{muKinetic}</span>
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
          {isPlaying ? "Pause" : "Start"}
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
