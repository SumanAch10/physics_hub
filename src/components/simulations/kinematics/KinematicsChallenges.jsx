import { useRef, useEffect, useState } from "react";
import { COLORS, FONTS } from "../../../styles/theme";
import { drawArrow, drawText, drawCircle, drawDashedLine } from "../../../utils/canvasHelpers";

const PROBLEMS = [
  {
    id: 1,
    title: "MIT 8.01 - Braking Car",
    difficulty: "Medium",
    scenario: "A car traveling at 25 m/s applies brakes and decelerates uniformly at 5 m/s². How far does it travel before stopping?",
    given: { u: 25, v: 0, a: -5 },
    find: "displacement",
    answer: 62.5,
    unit: "m",
    hint: "Use v² = u² + 2as, solve for s",
    equation: "v² = u² + 2as → s = (v² - u²) / 2a",
  },
  {
    id: 2,
    title: "MIT 8.01 - Rocket Launch",
    difficulty: "Medium",
    scenario: "A rocket accelerates from rest at 15 m/s² for 8 seconds. What is its final velocity?",
    given: { u: 0, a: 15, t: 8 },
    find: "velocity",
    answer: 120,
    unit: "m/s",
    hint: "Use v = u + at",
    equation: "v = u + at = 0 + (15)(8)",
  },
  {
    id: 3,
    title: "MIT 8.01 - Free Fall",
    difficulty: "Hard",
    scenario: "A ball is dropped from a 80m tower. How long does it take to hit the ground? (g = 10 m/s²)",
    given: { u: 0, s: 80, a: 10 },
    find: "time",
    answer: 4,
    unit: "s",
    hint: "Use s = ut + ½at², with u = 0",
    equation: "s = ½at² → t = √(2s/a)",
  },
  {
    id: 4,
    title: "MIT 8.01 - Train Acceleration",
    difficulty: "Easy",
    scenario: "A train accelerates from 10 m/s to 30 m/s over a distance of 200m. What is its acceleration?",
    given: { u: 10, v: 30, s: 200 },
    find: "acceleration",
    answer: 2,
    unit: "m/s²",
    hint: "Use v² = u² + 2as, solve for a",
    equation: "a = (v² - u²) / 2s",
  },
  {
    id: 5,
    title: "MIT 8.01 - Catching the Bus",
    difficulty: "Hard",
    scenario: "A bus starts from rest with acceleration 2 m/s². A student 50m behind runs at constant 8 m/s. How long until the student catches the bus?",
    given: { studentV: 8, busA: 2, gap: 50 },
    find: "time",
    answer: 10,
    unit: "s",
    hint: "Set student position = bus position: 8t = 50 + ½(2)t²",
    equation: "8t = 50 + t² → t² - 8t + 50 = 0... but student must catch up!",
  },
];

export default function KinematicsChallenges() {
  const canvasRef = useRef(null);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animProgress, setAnimProgress] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(new Set());
  const animRef = useRef(null);

  const problem = PROBLEMS[currentProblem];
  const width = 620;
  const height = 280;

  const drawProblemVisual = (ctx, progress = 0) => {
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, width, height);

    const groundY = height - 40;

    // Ground
    ctx.fillStyle = COLORS.border;
    ctx.fillRect(0, groundY, width, height - groundY);

    switch (problem.id) {
      case 1: // Braking car
        {
          const carX = 60 + (problem.answer * progress * 8);
          const carVel = problem.given.u + problem.given.a * (progress * Math.sqrt(2 * problem.answer / Math.abs(problem.given.a)));

          // Skid marks
          if (progress > 0) {
            ctx.strokeStyle = "#4a4a4a";
            ctx.lineWidth = 4;
            ctx.setLineDash([20, 10]);
            ctx.beginPath();
            ctx.moveTo(60, groundY - 5);
            ctx.lineTo(carX, groundY - 5);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          // Car body
          ctx.fillStyle = COLORS.force;
          ctx.beginPath();
          ctx.roundRect(carX - 30, groundY - 35, 60, 25, 5);
          ctx.fill();

          // Wheels
          drawCircle(ctx, carX - 15, groundY - 8, 8, COLORS.bgCard, COLORS.textSecondary);
          drawCircle(ctx, carX + 15, groundY - 8, 8, COLORS.bgCard, COLORS.textSecondary);

          // Velocity arrow
          if (carVel > 1) {
            drawArrow(ctx, carX + 35, groundY - 25, carX + 35 + Math.max(carVel, 0) * 2, groundY - 25, COLORS.velocity, 2, 8);
            drawText(ctx, `v = ${Math.max(carVel, 0).toFixed(1)} m/s`, carX + 60, groundY - 40, COLORS.velocity, 10);
          }

          // Distance marker
          if (progress > 0) {
            drawText(ctx, `s = ${(problem.answer * progress).toFixed(1)} m`, (60 + carX) / 2, groundY + 20, COLORS.position, 11);
          }

          // Labels
          drawText(ctx, "u = 25 m/s", 80, 30, COLORS.momentum, 12, "left");
          drawText(ctx, "a = -5 m/s²", 80, 50, COLORS.force, 12, "left");
          drawText(ctx, "v = 0 (stops)", 80, 70, COLORS.velocity, 12, "left");
        }
        break;

      case 2: // Rocket launch
        {
          const rocketY = groundY - 20 - (0.5 * problem.given.a * Math.pow(progress * problem.given.t, 2)) * 0.5;
          const rocketVel = problem.given.a * (progress * problem.given.t);

          // Rocket
          ctx.fillStyle = COLORS.accent;
          ctx.beginPath();
          ctx.moveTo(width / 2, Math.max(rocketY - 30, 20));
          ctx.lineTo(width / 2 - 15, rocketY);
          ctx.lineTo(width / 2 + 15, rocketY);
          ctx.closePath();
          ctx.fill();

          // Flames
          if (progress > 0 && rocketY > 50) {
            ctx.fillStyle = COLORS.energy;
            ctx.beginPath();
            ctx.moveTo(width / 2 - 10, rocketY);
            ctx.lineTo(width / 2, rocketY + 20 + Math.random() * 10);
            ctx.lineTo(width / 2 + 10, rocketY);
            ctx.closePath();
            ctx.fill();
          }

          // Velocity
          if (rocketVel > 0) {
            drawText(ctx, `v = ${rocketVel.toFixed(1)} m/s`, width / 2 + 40, rocketY - 15, COLORS.velocity, 11);
          }

          // Labels
          drawText(ctx, "u = 0 (from rest)", 80, 30, COLORS.momentum, 12, "left");
          drawText(ctx, "a = 15 m/s²", 80, 50, COLORS.force, 12, "left");
          drawText(ctx, "t = 8 s", 80, 70, COLORS.accent, 12, "left");
        }
        break;

      case 3: // Free fall
        {
          const ballY = 40 + (problem.given.s * progress) * 2.5;
          const ballVel = problem.given.a * (progress * problem.answer);

          // Tower
          ctx.fillStyle = COLORS.bgCardHover;
          ctx.fillRect(50, 40, 40, groundY - 40);

          // Height markers
          for (let h = 0; h <= 80; h += 20) {
            const markerY = 40 + (h / 80) * (groundY - 40);
            drawText(ctx, `${80 - h}m`, 30, markerY, COLORS.textSecondary, 9, "right");
          }

          // Ball
          drawCircle(ctx, 120 + progress * 100, Math.min(ballY, groundY - 15), 12, COLORS.energy, COLORS.textPrimary);

          // Velocity arrow
          if (ballVel > 0) {
            drawArrow(ctx, 120 + progress * 100, Math.min(ballY, groundY - 15) + 15, 120 + progress * 100, Math.min(ballY + ballVel * 2, groundY - 5), COLORS.velocity, 2, 8);
          }

          // Labels
          drawText(ctx, "u = 0 (dropped)", 250, 30, COLORS.momentum, 12, "left");
          drawText(ctx, "g = 10 m/s²", 250, 50, COLORS.force, 12, "left");
          drawText(ctx, "h = 80 m", 250, 70, COLORS.position, 12, "left");
        }
        break;

      case 4: // Train
        {
          const trainX = 60 + (progress * 200) * 2;
          const trainVel = problem.given.u + problem.answer * (progress * (problem.given.v - problem.given.u) / problem.answer);

          // Track
          ctx.strokeStyle = COLORS.textSecondary;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, groundY - 5);
          ctx.lineTo(width, groundY - 5);
          ctx.stroke();

          // Train
          ctx.fillStyle = COLORS.momentum;
          ctx.beginPath();
          ctx.roundRect(trainX - 40, groundY - 40, 80, 30, 5);
          ctx.fill();

          // Wheels
          drawCircle(ctx, trainX - 25, groundY - 8, 8, COLORS.bgCard, COLORS.textSecondary);
          drawCircle(ctx, trainX + 25, groundY - 8, 8, COLORS.bgCard, COLORS.textSecondary);

          // Velocity
          drawText(ctx, `v = ${trainVel.toFixed(1)} m/s`, trainX, groundY - 55, COLORS.velocity, 11);

          // Labels
          drawText(ctx, "u = 10 m/s", 450, 30, COLORS.momentum, 12, "left");
          drawText(ctx, "v = 30 m/s", 450, 50, COLORS.velocity, 12, "left");
          drawText(ctx, "s = 200 m", 450, 70, COLORS.position, 12, "left");
        }
        break;

      case 5: // Bus chase
        {
          const t = progress * problem.answer;
          const studentX = 60 + (problem.given.studentV * t) * 4;
          const busX = 60 + problem.given.gap * 4 + (0.5 * problem.given.busA * t * t) * 4;

          // Student (runner)
          ctx.fillStyle = COLORS.velocity;
          ctx.beginPath();
          ctx.arc(Math.min(studentX, width - 40), groundY - 20, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(Math.min(studentX, width - 40), groundY - 10);
          ctx.lineTo(Math.min(studentX, width - 40), groundY - 2);
          ctx.stroke();

          // Bus
          ctx.fillStyle = COLORS.energy;
          ctx.beginPath();
          ctx.roundRect(Math.min(busX - 25, width - 60), groundY - 35, 50, 25, 5);
          ctx.fill();

          // Gap indicator
          if (progress < 1) {
            const gap = busX - studentX;
            if (gap > 10) {
              drawDashedLine(ctx, Math.min(studentX, width - 40), groundY - 50, Math.min(busX - 25, width - 60), groundY - 50, COLORS.textSecondary);
              drawText(ctx, `gap: ${Math.max(0, gap / 4).toFixed(1)}m`, (studentX + busX) / 2, groundY - 60, COLORS.textSecondary, 10);
            }
          }

          // Labels
          drawText(ctx, "Student: v = 8 m/s (constant)", 80, 25, COLORS.velocity, 11, "left");
          drawText(ctx, "Bus: u = 0, a = 2 m/s²", 80, 45, COLORS.energy, 11, "left");
          drawText(ctx, "Initial gap: 50 m", 80, 65, COLORS.textSecondary, 11, "left");
        }
        break;
    }

    // Time display
    if (progress > 0) {
      drawText(ctx, `t = ${(progress * (problem.find === "time" ? problem.answer : 5)).toFixed(2)}s`, width - 70, 30, COLORS.accent, 12);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    drawProblemVisual(ctx, animProgress);
  }, [currentProblem, animProgress]);

  useEffect(() => {
    if (isAnimating) {
      animRef.current = requestAnimationFrame(function animate() {
        setAnimProgress((p) => {
          if (p >= 1) {
            setIsAnimating(false);
            return 1;
          }
          return p + 0.008;
        });
        animRef.current = requestAnimationFrame(animate);
      });
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [isAnimating]);

  const checkAnswer = () => {
    const userNum = parseFloat(userAnswer);
    const tolerance = problem.answer * 0.05; // 5% tolerance

    if (Math.abs(userNum - problem.answer) <= tolerance) {
      setFeedback({ correct: true, message: "Correct! Watch the simulation..." });
      setSolved((prev) => new Set([...prev, problem.id]));
      setIsAnimating(true);
      setAnimProgress(0);
    } else {
      setAttempts((a) => a + 1);
      if (attempts >= 2) {
        setFeedback({ correct: false, message: `Not quite. The answer is ${problem.answer} ${problem.unit}. ${problem.equation}` });
      } else {
        setFeedback({ correct: false, message: `Try again! Hint: ${problem.hint}` });
      }
    }
  };

  const nextProblem = () => {
    setCurrentProblem((p) => (p + 1) % PROBLEMS.length);
    setUserAnswer("");
    setFeedback(null);
    setShowHint(false);
    setAnimProgress(0);
    setIsAnimating(false);
    setAttempts(0);
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case "Easy": return COLORS.momentum;
      case "Medium": return COLORS.energy;
      case "Hard": return COLORS.force;
      default: return COLORS.textSecondary;
    }
  };

  return (
    <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: 16, border: `1px solid ${COLORS.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.force }}>
          Kinematics Challenge #{currentProblem + 1}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: COLORS.textSecondary }}>
            Solved: {solved.size}/{PROBLEMS.length}
          </span>
          <span style={{
            padding: "2px 8px",
            borderRadius: 4,
            background: getDifficultyColor(problem.difficulty) + "20",
            color: getDifficultyColor(problem.difficulty),
            fontSize: 10,
            fontFamily: FONTS.mono,
          }}>
            {problem.difficulty}
          </span>
        </div>
      </div>

      {/* Problem title */}
      <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 8 }}>
        {problem.title}
        {solved.has(problem.id) && <span style={{ marginLeft: 8, color: COLORS.momentum }}>✓</span>}
      </div>

      {/* Scenario */}
      <div style={{
        padding: 12,
        background: COLORS.bg,
        borderRadius: 8,
        marginBottom: 12,
        fontSize: 13,
        color: COLORS.textSecondary,
        lineHeight: 1.5,
      }}>
        {problem.scenario}
      </div>

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ borderRadius: 8, display: "block", maxWidth: "100%", marginBottom: 12 }}
      />

      {/* Answer input */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: COLORS.textSecondary, fontSize: 13 }}>Your Answer:</span>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
            placeholder="?"
            style={{
              width: 80,
              padding: "8px 12px",
              borderRadius: 6,
              border: `1px solid ${COLORS.border}`,
              background: COLORS.bg,
              color: COLORS.textPrimary,
              fontFamily: FONTS.mono,
              fontSize: 14,
            }}
          />
          <span style={{ color: COLORS.textSecondary, fontSize: 13 }}>{problem.unit}</span>
        </div>
        <button
          onClick={checkAnswer}
          disabled={!userAnswer || isAnimating}
          style={{
            background: COLORS.accent,
            color: COLORS.bg,
            border: "none",
            borderRadius: 6,
            padding: "8px 20px",
            fontFamily: FONTS.mono,
            fontSize: 12,
            cursor: userAnswer && !isAnimating ? "pointer" : "not-allowed",
            opacity: userAnswer && !isAnimating ? 1 : 0.5,
          }}
        >
          Submit
        </button>
        <button
          onClick={() => setShowHint(!showHint)}
          style={{
            background: COLORS.border,
            color: COLORS.textPrimary,
            border: "none",
            borderRadius: 6,
            padding: "8px 12px",
            fontFamily: FONTS.mono,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          {showHint ? "Hide Hint" : "Hint"}
        </button>
        <button
          onClick={nextProblem}
          style={{
            background: COLORS.bgCardHover,
            color: COLORS.textPrimary,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 6,
            padding: "8px 16px",
            fontFamily: FONTS.mono,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Next →
        </button>
      </div>

      {/* Hint */}
      {showHint && (
        <div style={{
          padding: 10,
          background: COLORS.energy + "15",
          borderRadius: 6,
          marginBottom: 12,
          fontSize: 12,
          color: COLORS.energy,
          fontFamily: FONTS.mono,
        }}>
          💡 {problem.hint}
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div style={{
          padding: 12,
          background: feedback.correct ? COLORS.momentum + "20" : COLORS.force + "20",
          borderRadius: 8,
          border: `1px solid ${feedback.correct ? COLORS.momentum : COLORS.force}40`,
        }}>
          <div style={{
            fontSize: 13,
            color: feedback.correct ? COLORS.momentum : COLORS.force,
            fontWeight: 500,
          }}>
            {feedback.correct ? "✓ " : "✗ "}{feedback.message}
          </div>
        </div>
      )}

      {/* Problem navigation dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
        {PROBLEMS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => {
              setCurrentProblem(i);
              setUserAnswer("");
              setFeedback(null);
              setShowHint(false);
              setAnimProgress(0);
              setAttempts(0);
            }}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              border: "none",
              background: i === currentProblem ? COLORS.accent : solved.has(p.id) ? COLORS.momentum : COLORS.border,
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}
