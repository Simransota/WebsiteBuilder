"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Undo2, Redo2, Grid, Magnet, Eye, EyeOff, Trash2, Lock, Layers, LayoutGrid } from "lucide-react"

interface ToolbarProps {
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  showGrid: boolean
  snapToGrid: boolean
  onToggleGrid: () => void
  onToggleSnapToGrid: () => void
  isPreviewMode: boolean
  onTogglePreview: () => void
  onToggleLayersPanel: () => void
  onToggleSectionsPanel: () => void
  selectedElementsCount: number
  onDeleteSelected: () => void
  onToggleLock: () => void
}

export function Toolbar({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  showGrid,
  snapToGrid,
  onToggleGrid,
  onToggleSnapToGrid,
  isPreviewMode,
  onTogglePreview,
  onToggleLayersPanel,
  onToggleSectionsPanel,
  selectedElementsCount,
  onDeleteSelected,
  onToggleLock,
}: ToolbarProps) {
  return (
    <TooltipProvider>
      <div className="border-b bg-muted/40 p-2 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onUndo} disabled={!canUndo || isPreviewMode}>
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo (Ctrl+Z)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onRedo} disabled={!canRedo || isPreviewMode}>
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo (Ctrl+Shift+Z)</p>
            </TooltipContent>
          </Tooltip>

          <div className="h-4 w-px bg-border mx-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showGrid ? "secondary" : "ghost"}
                size="icon"
                onClick={onToggleGrid}
                disabled={isPreviewMode}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Grid (G)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={snapToGrid ? "secondary" : "ghost"}
                size="icon"
                onClick={onToggleSnapToGrid}
                disabled={isPreviewMode}
              >
                <Magnet className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Snap to Grid (S)</p>
            </TooltipContent>
          </Tooltip>

          <div className="h-4 w-px bg-border mx-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onToggleLayersPanel} disabled={isPreviewMode}>
                <Layers className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Layers Panel</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onToggleSectionsPanel} disabled={isPreviewMode}>
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Sections Panel</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center space-x-1">
          {selectedElementsCount > 0 && !isPreviewMode && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onToggleLock}>
                    {selectedElementsCount === 1 ? <Lock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Lock (Ctrl+L)</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onDeleteSelected}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Selected (Delete)</p>
                </TooltipContent>
              </Tooltip>

              <div className="h-4 w-px bg-border mx-1" />
            </>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={isPreviewMode ? "secondary" : "ghost"} size="icon" onClick={onTogglePreview}>
                {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Preview Mode (P)</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}

