"use client"

import type { WebsiteElement } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, MoveUp, MoveDown, Lock, Unlock } from "lucide-react"

interface LayersPanelProps {
  elements: WebsiteElement[]
  selectedElementIds: string[]
  onElementSelect: (element: WebsiteElement, isMultiSelect: boolean) => void
  onUpdateLayer: (id: string, direction: "up" | "down" | "top" | "bottom") => void
}

export function LayersPanel({ elements, selectedElementIds, onElementSelect, onUpdateLayer }: LayersPanelProps) {
  // Sort elements by z-index for the layers panel (highest z-index at the top)
  const sortedElements = [...elements].sort((a, b) => (b.zIndex || 1) - (a.zIndex || 1))

  return (
    <div className="w-64 border-r bg-muted/40 p-4 overflow-y-auto">
      <h2 className="font-semibold mb-4">Layers</h2>
      <div className="space-y-1">
        {sortedElements.map((element) => (
          <div
            key={element.id}
            className={`flex items-center justify-between p-2 rounded ${
              selectedElementIds.includes(element.id) ? "bg-primary/10" : "hover:bg-muted"
            }`}
            onClick={() => onElementSelect(element, false)}
          >
            <div className="flex items-center gap-2">
              {element.isLocked ? (
                <Lock className="h-3 w-3 text-muted-foreground" />
              ) : (
                <Unlock className="h-3 w-3 text-muted-foreground" />
              )}
              <span className="text-sm truncate max-w-[120px]">
                {element.type} {element.properties.text ? `- ${element.properties.text.substring(0, 10)}...` : ""}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation()
                  onUpdateLayer(element.id, "top")
                }}
              >
                <MoveUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation()
                  onUpdateLayer(element.id, "up")
                }}
              >
                <ArrowUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation()
                  onUpdateLayer(element.id, "down")
                }}
              >
                <ArrowDown className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation()
                  onUpdateLayer(element.id, "bottom")
                }}
              >
                <MoveDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
        {elements.length === 0 && <div className="text-sm text-muted-foreground">No elements added yet</div>}
      </div>
    </div>
  )
}

