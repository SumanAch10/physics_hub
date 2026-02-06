import { COLORS } from "../styles/theme";

/**
 * Draw a background grid with axes on a canvas context.
 */
export function drawGrid(ctx, w, h, originX, originY, scale = 50) {
  ctx.strokeStyle = COLORS.gridLine;
  ctx.lineWidth = 1;
  for (let x = originX % scale; x < w; x += scale) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = originY % scale; y < h; y += scale) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  // axes
  ctx.strokeStyle = "rgba(241,245,249,0.15)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, originY);
  ctx.lineTo(w, originY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(originX, 0);
  ctx.lineTo(originX, h);
  ctx.stroke();
}

/**
 * Draw an arrow from (x1,y1) to (x2,y2).
 */
export function drawArrow(
  ctx,
  x1,
  y1,
  x2,
  y2,
  color,
  lineWidth = 2.5,
  headSize = 10
) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - headSize * Math.cos(angle - 0.4),
    y2 - headSize * Math.sin(angle - 0.4)
  );
  ctx.lineTo(
    x2 - headSize * Math.cos(angle + 0.4),
    y2 - headSize * Math.sin(angle + 0.4)
  );
  ctx.closePath();
  ctx.fill();
}

/**
 * Draw centered text on canvas.
 */
export function drawText(
  ctx,
  text,
  x,
  y,
  color = COLORS.textSecondary,
  size = 12,
  align = "center"
) {
  ctx.fillStyle = color;
  ctx.font = `${size}px 'JetBrains Mono', monospace`;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

/**
 * Draw a dashed line
 */
export function drawDashedLine(ctx, x1, y1, x2, y2, color, dashPattern = [5, 5]) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.setLineDash(dashPattern);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);
}

/**
 * Draw a circle
 */
export function drawCircle(ctx, x, y, radius, fillColor, strokeColor = null) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = fillColor;
  ctx.fill();
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
