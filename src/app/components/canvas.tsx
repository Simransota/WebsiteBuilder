"use client"

import { useDroppable } from "@dnd-kit/core"
import type { WebsiteElement } from "@/lib/types"
import { ElementRenderer } from "./element-renderer"
import { useEffect, useRef } from "react"

interface CanvasProps {
  elements: WebsiteElement[]
  selectedElementIds: string[]
  onElementSelect: (element: WebsiteElement, isMultiSelect: boolean) => void
  onCanvasClick: () => void
  onDeleteElement: (id: string) => void
  showGrid: boolean
  gridSize: number
  isPreviewMode: boolean
}

export function Canvas({
  elements,
  selectedElementIds,
  onElementSelect,
  onCanvasClick,
  onDeleteElement,
  showGrid,
  gridSize,
  isPreviewMode,
}: CanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas",
  })

  const canvasRef = useRef<HTMLCanvasElement>(null);


  // Draw grid
 useEffect(() => {
  if (!canvasRef.current || !showGrid) return;

  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set canvas size to match parent
  const parent = canvas.parentElement;
  if (parent) {
    canvas.width = parent.clientWidth; // ✅ No TypeScript error
    canvas.height = parent.clientHeight; // ✅ No TypeScript error
  }

  // Draw grid
  ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
  ctx.lineWidth = 1;

  // Draw vertical lines
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Draw horizontal lines
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}, [showGrid, gridSize]);

  // Sort elements by z-index for rendering
  const sortedElements = [...elements].sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1))

  return (
    <div className="flex-1 overflow-auto bg-muted/20 relative">
      <div
        ref={setNodeRef}
        className={`min-h-full w-full relative p-4 transition-colors ${isOver && !isPreviewMode ? "bg-primary/5" : ""}`}
        onClick={onCanvasClick}
      >
        {showGrid && <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />}

        <div className="mx-auto max-w-4xl min-h-[calc(100vh-8rem)] bg-background shadow-md rounded-md p-4 relative">
          {sortedElements.map((element) => (
            <ElementRenderer
              key={element.id}
              element={element}
              isSelected={selectedElementIds.includes(element.id)}
              onSelect={(e) => onElementSelect(element, e.ctrlKey || e.metaKey)}
              onDelete={() => onDeleteElement(element.id)}
              isPreviewMode={isPreviewMode}
            />
          ))}
          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              {isPreviewMode ? "No content to preview" : "Drag elements or sections here to build your website"}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

