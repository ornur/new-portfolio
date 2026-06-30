import { type RefObject, useEffect, useRef } from "react";

type CanvasStrokeStyle = CanvasGradient | CanvasPattern | string;
interface DrawGridOptions {
  borderColor: CanvasStrokeStyle;
  canvas: HTMLCanvasElement;
  cellOpacities: Map<string, number>;
  ctx: CanvasRenderingContext2D;
  gridOffset: GridOffset;
  hoverFillColor: CanvasStrokeStyle;
  metrics: GridMetrics;
  vinetteColor: string;
}

interface GridMetrics {
  hexHoriz: number;
  hexVert: number;
  isHex: boolean;
  isTri: boolean;
  shape: Shape;
  squareSize: number;
}

interface GridOffset {
  x: number;
  y: number;
}

interface HoverCellOptions {
  canvas: HTMLCanvasElement;
  event: MouseEvent;
  gridOffset: GridOffset;
  metrics: GridMetrics;
}

type Shape = "circle" | "hexagon" | "square" | "triangle";

interface ShapeGridProps {
  borderColor?: CanvasStrokeStyle;
  direction?: "diagonal" | "down" | "left" | "right" | "up";
  hoverFillColor?: CanvasStrokeStyle;
  hoverTrailAmount?: number;
  shape?: Shape;
  speed?: number;
  squareSize?: number;
  vinetteColor?: string;
}

const ShapeGrid = ({
  borderColor = "#999",
  direction = "right",
  hoverFillColor = "oklch(0.9295 0.2025 115.99)",
  hoverTrailAmount = 0,
  shape = "square",
  speed = 1,
  squareSize = 40,
  vinetteColor = "#060010",
}: ShapeGridProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useShapeGridAnimation({
    borderColor,
    canvasRef,
    direction,
    hoverFillColor,
    hoverTrailAmount,
    shape,
    speed,
    squareSize,
    vinetteColor,
  });

  return (
    <canvas className="fixed h-screen w-screen border-none" ref={canvasRef} />
  );
};

function appendTrailCell(
  currentCell: GridOffset | null,
  trailCells: GridOffset[],
  hoverTrailAmount: number,
) {
  if (!currentCell || hoverTrailAmount <= 0) return;

  trailCells.unshift({ ...currentCell });
  if (trailCells.length > hoverTrailAmount) {
    trailCells.length = hoverTrailAmount;
  }
}

function drawCircle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
) {
  ctx.beginPath();
  ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
  ctx.closePath();
}

function drawCircleGrid(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  metrics: GridMetrics,
  gridOffset: GridOffset,
  cellOpacities: Map<string, number>,
  styles: { borderColor: CanvasStrokeStyle; hoverFillColor: CanvasStrokeStyle },
) {
  const offsetX = wrapOffset(gridOffset.x, metrics.squareSize);
  const offsetY = wrapOffset(gridOffset.y, metrics.squareSize);
  const cols = Math.ceil(canvas.width / metrics.squareSize) + 3;
  const rows = Math.ceil(canvas.height / metrics.squareSize) + 3;

  for (let col = -2; col < cols; col++) {
    for (let row = -2; row < rows; row++) {
      const cx = col * metrics.squareSize + metrics.squareSize / 2 + offsetX;
      const cy = row * metrics.squareSize + metrics.squareSize / 2 + offsetY;
      const cellKey = `${col},${row}`;
      const alpha = cellOpacities.get(cellKey);

      if (alpha)
        fillPath(ctx, alpha, styles.hoverFillColor, () => {
          drawCircle(ctx, cx, cy, metrics.squareSize);
        });

      drawCircle(ctx, cx, cy, metrics.squareSize);
      ctx.strokeStyle = styles.borderColor;
      ctx.stroke();
    }
  }
}

function drawGrid({
  borderColor,
  canvas,
  cellOpacities,
  ctx,
  gridOffset,
  hoverFillColor,
  metrics,
  vinetteColor,
}: DrawGridOptions) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (metrics.isHex) {
    drawHexGrid(ctx, canvas, metrics, gridOffset, cellOpacities, {
      borderColor,
      hoverFillColor,
    });
  } else if (metrics.isTri) {
    drawTriangleGrid(ctx, canvas, metrics, gridOffset, cellOpacities, {
      borderColor,
      hoverFillColor,
    });
  } else if (metrics.shape === "circle") {
    drawCircleGrid(ctx, canvas, metrics, gridOffset, cellOpacities, {
      borderColor,
      hoverFillColor,
    });
  } else {
    drawSquareGrid(ctx, canvas, metrics, gridOffset, cellOpacities, {
      borderColor,
      hoverFillColor,
    });
  }

  drawVinette(ctx, canvas, vinetteColor);
}

function drawHex(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const vx = cx + size * Math.cos(angle);
    const vy = cy + size * Math.sin(angle);
    if (i === 0) ctx.moveTo(vx, vy);
    else ctx.lineTo(vx, vy);
  }
  ctx.closePath();
}

function drawHexGrid(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  metrics: GridMetrics,
  gridOffset: GridOffset,
  cellOpacities: Map<string, number>,
  styles: { borderColor: CanvasStrokeStyle; hoverFillColor: CanvasStrokeStyle },
) {
  const colShift = Math.floor(gridOffset.x / metrics.hexHoriz);
  const offsetX = wrapOffset(gridOffset.x, metrics.hexHoriz);
  const offsetY = wrapOffset(gridOffset.y, metrics.hexVert);
  const cols = Math.ceil(canvas.width / metrics.hexHoriz) + 3;
  const rows = Math.ceil(canvas.height / metrics.hexVert) + 3;

  for (let col = -2; col < cols; col++) {
    for (let row = -2; row < rows; row++) {
      const cx = col * metrics.hexHoriz + offsetX;
      const cy =
        row * metrics.hexVert +
        ((col + colShift) % 2 !== 0 ? metrics.hexVert / 2 : 0) +
        offsetY;
      const cellKey = `${col},${row}`;
      const alpha = cellOpacities.get(cellKey);

      if (alpha)
        fillPath(ctx, alpha, styles.hoverFillColor, () => {
          drawHex(ctx, cx, cy, metrics.squareSize);
        });

      drawHex(ctx, cx, cy, metrics.squareSize);
      ctx.strokeStyle = styles.borderColor;
      ctx.stroke();
    }
  }
}

function drawSquareGrid(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  metrics: GridMetrics,
  gridOffset: GridOffset,
  cellOpacities: Map<string, number>,
  styles: { borderColor: CanvasStrokeStyle; hoverFillColor: CanvasStrokeStyle },
) {
  const offsetX = wrapOffset(gridOffset.x, metrics.squareSize);
  const offsetY = wrapOffset(gridOffset.y, metrics.squareSize);
  const cols = Math.ceil(canvas.width / metrics.squareSize) + 3;
  const rows = Math.ceil(canvas.height / metrics.squareSize) + 3;

  for (let col = -2; col < cols; col++) {
    for (let row = -2; row < rows; row++) {
      const sx = col * metrics.squareSize + offsetX;
      const sy = row * metrics.squareSize + offsetY;
      const cellKey = `${col},${row}`;
      const alpha = cellOpacities.get(cellKey);

      if (alpha) {
        ctx.globalAlpha = alpha;
        ctx.fillStyle = styles.hoverFillColor;
        ctx.fillRect(sx, sy, metrics.squareSize, metrics.squareSize);
        ctx.globalAlpha = 1;
      }

      ctx.strokeStyle = styles.borderColor;
      ctx.strokeRect(sx, sy, metrics.squareSize, metrics.squareSize);
    }
  }
}

function drawTriangle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  flip: boolean,
) {
  ctx.beginPath();
  if (flip) {
    ctx.moveTo(cx, cy + size / 2);
    ctx.lineTo(cx + size / 2, cy - size / 2);
    ctx.lineTo(cx - size / 2, cy - size / 2);
  } else {
    ctx.moveTo(cx, cy - size / 2);
    ctx.lineTo(cx + size / 2, cy + size / 2);
    ctx.lineTo(cx - size / 2, cy + size / 2);
  }
  ctx.closePath();
}

function drawTriangleGrid(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  metrics: GridMetrics,
  gridOffset: GridOffset,
  cellOpacities: Map<string, number>,
  styles: { borderColor: CanvasStrokeStyle; hoverFillColor: CanvasStrokeStyle },
) {
  const halfW = metrics.squareSize / 2;
  const colShift = Math.floor(gridOffset.x / halfW);
  const rowShift = Math.floor(gridOffset.y / metrics.squareSize);
  const offsetX = wrapOffset(gridOffset.x, halfW);
  const offsetY = wrapOffset(gridOffset.y, metrics.squareSize);
  const cols = Math.ceil(canvas.width / halfW) + 4;
  const rows = Math.ceil(canvas.height / metrics.squareSize) + 4;

  for (let col = -2; col < cols; col++) {
    for (let row = -2; row < rows; row++) {
      const cx = col * halfW + offsetX;
      const cy = row * metrics.squareSize + metrics.squareSize / 2 + offsetY;
      const flip = (((col + colShift + row + rowShift) % 2) + 2) % 2 !== 0;
      const cellKey = `${col},${row}`;
      const alpha = cellOpacities.get(cellKey);

      if (alpha)
        fillPath(ctx, alpha, styles.hoverFillColor, () => {
          drawTriangle(ctx, cx, cy, metrics.squareSize, flip);
        });

      drawTriangle(ctx, cx, cy, metrics.squareSize, flip);
      ctx.strokeStyle = styles.borderColor;
      ctx.stroke();
    }
  }
}

function drawVinette(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  vinetteColor: string,
) {
  const gradient = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2,
  );
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(1, vinetteColor);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function fillPath(
  ctx: CanvasRenderingContext2D,
  alpha: number,
  fillStyle: CanvasStrokeStyle,
  drawPath: () => void,
) {
  ctx.globalAlpha = alpha;
  drawPath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.globalAlpha = 1;
}

function getCircleHoverCell(
  mouseX: number,
  mouseY: number,
  gridOffset: GridOffset,
  metrics: GridMetrics,
): GridOffset {
  const offsetX = wrapOffset(gridOffset.x, metrics.squareSize);
  const offsetY = wrapOffset(gridOffset.y, metrics.squareSize);

  return {
    x: Math.round((mouseX - offsetX) / metrics.squareSize),
    y: Math.round((mouseY - offsetY) / metrics.squareSize),
  };
}

function getGridMetrics(shape: Shape, squareSize: number): GridMetrics {
  return {
    hexHoriz: squareSize * 1.5,
    hexVert: squareSize * Math.sqrt(3),
    isHex: shape === "hexagon",
    isTri: shape === "triangle",
    shape,
    squareSize,
  };
}

function getHexHoverCell(
  mouseX: number,
  mouseY: number,
  gridOffset: GridOffset,
  metrics: GridMetrics,
): GridOffset {
  const colShift = Math.floor(gridOffset.x / metrics.hexHoriz);
  const offsetX = wrapOffset(gridOffset.x, metrics.hexHoriz);
  const offsetY = wrapOffset(gridOffset.y, metrics.hexVert);
  const adjustedX = mouseX - offsetX;
  const adjustedY = mouseY - offsetY;
  const x = Math.round(adjustedX / metrics.hexHoriz);
  const rowOffset = (x + colShift) % 2 !== 0 ? metrics.hexVert / 2 : 0;
  const y = Math.round((adjustedY - rowOffset) / metrics.hexVert);

  return { x, y };
}

function getHoveredCell({
  canvas,
  event,
  gridOffset,
  metrics,
}: HoverCellOptions): GridOffset {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  if (metrics.isHex) {
    return getHexHoverCell(mouseX, mouseY, gridOffset, metrics);
  }

  if (metrics.isTri) {
    return getTriangleHoverCell(mouseX, mouseY, gridOffset, metrics);
  }

  if (metrics.shape === "circle") {
    return getCircleHoverCell(mouseX, mouseY, gridOffset, metrics);
  }

  return getSquareHoverCell(mouseX, mouseY, gridOffset, metrics);
}

function getOpacityTargets(
  hoveredCell: GridOffset | null,
  trailCells: GridOffset[],
  hoverTrailAmount: number,
) {
  const targets = new Map<string, number>();

  if (hoveredCell) {
    targets.set(`${hoveredCell.x},${hoveredCell.y}`, 1);
  }

  if (hoverTrailAmount <= 0) return targets;

  trailCells.forEach((cell, index) => {
    const key = `${cell.x},${cell.y}`;
    if (!targets.has(key)) {
      targets.set(key, (trailCells.length - index) / (trailCells.length + 1));
    }
  });

  return targets;
}

function getSquareHoverCell(
  mouseX: number,
  mouseY: number,
  gridOffset: GridOffset,
  metrics: GridMetrics,
): GridOffset {
  const offsetX = wrapOffset(gridOffset.x, metrics.squareSize);
  const offsetY = wrapOffset(gridOffset.y, metrics.squareSize);

  return {
    x: Math.floor((mouseX - offsetX) / metrics.squareSize),
    y: Math.floor((mouseY - offsetY) / metrics.squareSize),
  };
}

function getTriangleHoverCell(
  mouseX: number,
  mouseY: number,
  gridOffset: GridOffset,
  metrics: GridMetrics,
): GridOffset {
  const halfW = metrics.squareSize / 2;
  const offsetX = wrapOffset(gridOffset.x, halfW);
  const offsetY = wrapOffset(gridOffset.y, metrics.squareSize);

  return {
    x: Math.round((mouseX - offsetX) / halfW),
    y: Math.floor((mouseY - offsetY) / metrics.squareSize),
  };
}

function isSameCell(previousCell: GridOffset | null, nextCell: GridOffset) {
  return previousCell?.x === nextCell.x && previousCell.y === nextCell.y;
}

function moveGridOffset(
  gridOffset: GridOffset,
  {
    direction,
    metrics,
    speed,
  }: {
    direction: NonNullable<ShapeGridProps["direction"]>;
    metrics: GridMetrics;
    speed: number;
  },
) {
  const effectiveSpeed = Math.max(speed, 0.1);
  const wrapX = metrics.isHex ? metrics.hexHoriz * 2 : metrics.squareSize;
  const wrapY = metrics.isHex
    ? metrics.hexVert
    : metrics.isTri
      ? metrics.squareSize * 2
      : metrics.squareSize;

  switch (direction) {
    case "diagonal":
      gridOffset.x = wrapOffset(gridOffset.x - effectiveSpeed, wrapX);
      gridOffset.y = wrapOffset(gridOffset.y - effectiveSpeed, wrapY);
      break;
    case "down":
      gridOffset.y = wrapOffset(gridOffset.y - effectiveSpeed, wrapY);
      break;
    case "left":
      gridOffset.x = wrapOffset(gridOffset.x + effectiveSpeed, wrapX);
      break;
    case "right":
      gridOffset.x = wrapOffset(gridOffset.x - effectiveSpeed, wrapX);
      break;
    case "up":
      gridOffset.y = wrapOffset(gridOffset.y + effectiveSpeed, wrapY);
      break;
    default:
      break;
  }
}

function useShapeGridAnimation({
  borderColor,
  canvasRef,
  direction,
  hoverFillColor,
  hoverTrailAmount,
  shape,
  speed,
  squareSize,
  vinetteColor,
}: ShapeGridProps & { canvasRef: RefObject<HTMLCanvasElement | null> }) {
  const requestRef = useRef<null | number>(null);
  const gridOffset = useRef<GridOffset>({ x: 0, y: 0 });
  const hoveredSquareRef = useRef<GridOffset | null>(null);
  const trailCells = useRef<GridOffset[]>([]);
  const cellOpacities = useRef<Map<string, number> | null>(null);

  if (cellOpacities.current === null) {
    cellOpacities.current = new Map();
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const cellOpacityMap = cellOpacities.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !cellOpacityMap) return;

    const metrics = getGridMetrics(shape ?? "square", squareSize ?? 40);

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const updateCellOpacities = () => {
      const targets = getOpacityTargets(
        hoveredSquareRef.current,
        trailCells.current,
        hoverTrailAmount ?? 0,
      );

      for (const [key] of targets) {
        if (!cellOpacityMap.has(key)) {
          cellOpacityMap.set(key, 0);
        }
      }

      for (const [key, opacity] of cellOpacityMap) {
        const target = targets.get(key) || 0;
        const next = opacity + (target - opacity) * 0.15;

        if (next < 0.005) {
          cellOpacityMap.delete(key);
        } else {
          cellOpacityMap.set(key, next);
        }
      }
    };

    const updateAnimation = () => {
      moveGridOffset(gridOffset.current, {
        direction: direction ?? "right",
        metrics,
        speed: speed ?? 1,
      });

      updateCellOpacities();
      drawGrid({
        borderColor: borderColor ?? "#999",
        canvas,
        cellOpacities: cellOpacityMap,
        ctx,
        gridOffset: gridOffset.current,
        hoverFillColor: hoverFillColor ?? "oklch(0.9295 0.2025 115.99)",
        metrics,
        vinetteColor: vinetteColor ?? "#060010",
      });
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const nextCell = getHoveredCell({
        canvas,
        event,
        gridOffset: gridOffset.current,
        metrics,
      });

      if (isSameCell(hoveredSquareRef.current, nextCell)) return;

      appendTrailCell(
        hoveredSquareRef.current,
        trailCells.current,
        hoverTrailAmount ?? 0,
      );
      hoveredSquareRef.current = nextCell;
    };

    const handleMouseLeave = () => {
      appendTrailCell(
        hoveredSquareRef.current,
        trailCells.current,
        hoverTrailAmount ?? 0,
      );
      hoveredSquareRef.current = null;
    };

    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    resizeCanvas();
    requestRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [
    borderColor,
    canvasRef,
    direction,
    hoverFillColor,
    hoverTrailAmount,
    shape,
    speed,
    squareSize,
    vinetteColor,
  ]);
}

function wrapOffset(value: number, size: number) {
  return ((value % size) + size) % size;
}

export default ShapeGrid;
