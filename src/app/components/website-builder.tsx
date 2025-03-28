"use client"

import { useState, useEffect, useCallback } from "react"
import { DndContext, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core"
import { restrictToWindowEdges } from "@dnd-kit/modifiers"
import { ElementPanel } from "./element-panel"
import { Canvas } from "./canvas"
import { PropertiesPanel } from "./properties-panel"
import type { ElementType, WebsiteElement, HistoryState, EditorState, SectionType } from "@/lib/types"
import { createNewElement, createSection, snapToGrid } from "@/lib/element-utils"
import { Toolbar } from "./toolbar"
import { SectionPanel } from "./section-panel"
import { LayersPanel } from "./layers-panel"
import { useHotkeys } from "react-hotkeys-hook"

export default function WebsiteBuilder() {
  const [editorState, setEditorState] = useState<EditorState>({
    elements: [],
    selectedElementIds: [],
    history: [],
    historyIndex: -1,
    showGrid: true,
    snapToGrid: true,
    gridSize: 10,
    isPreviewMode: false,
  })

  const [activeId, setActiveId] = useState<string | null>(null)
  const [draggedElement, setDraggedElement] = useState<ElementType | null>(null)
  const [draggedSection, setDraggedSection] = useState<SectionType | null>(null)
  const [showLayersPanel, setShowLayersPanel] = useState(false)
  const [showSectionsPanel, setShowSectionsPanel] = useState(false)

  // Save current state to history
  const saveToHistory = useCallback(() => {
    const currentState: HistoryState = {
      elements: editorState.elements,
      selectedElementIds: editorState.selectedElementIds,
      timestamp: Date.now(),
    }

    // Remove any future history if we're not at the latest point
    const newHistory = editorState.history.slice(0, editorState.historyIndex + 1)

    setEditorState((prev) => ({
      ...prev,
      history: [...newHistory, currentState],
      historyIndex: newHistory.length,
    }))
  }, [editorState.elements, editorState.selectedElementIds, editorState.history, editorState.historyIndex])

  // Undo action
  const handleUndo = useCallback(() => {
    if (editorState.historyIndex > 0) {
      const newIndex = editorState.historyIndex - 1
      const previousState = editorState.history[newIndex]

      setEditorState((prev) => ({
        ...prev,
        elements: previousState.elements,
        selectedElementIds: previousState.selectedElementIds,
        historyIndex: newIndex,
      }))
    }
  }, [editorState.historyIndex, editorState.history])

  // Redo action
  const handleRedo = useCallback(() => {
    if (editorState.historyIndex < editorState.history.length - 1) {
      const newIndex = editorState.historyIndex + 1
      const nextState = editorState.history[newIndex]

      setEditorState((prev) => ({
        ...prev,
        elements: nextState.elements,
        selectedElementIds: nextState.selectedElementIds,
        historyIndex: newIndex,
      }))
    }
  }, [editorState.historyIndex, editorState.history])

  // Delete selected elements
  const handleDeleteSelected = useCallback(() => {
    if (editorState.selectedElementIds.length > 0) {
      const newElements = editorState.elements.filter((el) => !editorState.selectedElementIds.includes(el.id))

      setEditorState((prev) => ({
        ...prev,
        elements: newElements,
        selectedElementIds: [],
      }))

      saveToHistory()
    }
  }, [editorState.selectedElementIds, editorState.elements, saveToHistory])

  // Toggle element lock
  const handleToggleLock = useCallback(() => {
    if (editorState.selectedElementIds.length > 0) {
      const newElements = editorState.elements.map((el) => {
        if (editorState.selectedElementIds.includes(el.id)) {
          return { ...el, isLocked: !el.isLocked }
        }
        return el
      })

      setEditorState((prev) => ({
        ...prev,
        elements: newElements,
      }))

      saveToHistory()
    }
  }, [editorState.selectedElementIds, editorState.elements, saveToHistory])

  // Toggle grid visibility
  const handleToggleGrid = useCallback(() => {
    setEditorState((prev) => ({
      ...prev,
      showGrid: !prev.showGrid,
    }))
  }, [])

  // Toggle snap to grid
  const handleToggleSnapToGrid = useCallback(() => {
    setEditorState((prev) => ({
      ...prev,
      snapToGrid: !prev.snapToGrid,
    }))
  }, [])

  // Toggle preview mode
  const handleTogglePreview = useCallback(() => {
    setEditorState((prev) => ({
      ...prev,
      isPreviewMode: !prev.isPreviewMode,
      selectedElementIds: [], // Clear selection in preview mode
    }))
  }, [])

  // Register keyboard shortcuts
  useHotkeys(
    "ctrl+z, cmd+z",
    (e) => {
      e.preventDefault()
      handleUndo()
    },
    [handleUndo],
  )

  useHotkeys(
    "ctrl+shift+z, cmd+shift+z",
    (e) => {
      e.preventDefault()
      handleRedo()
    },
    [handleRedo],
  )

  useHotkeys(
    "delete, backspace",
    (e) => {
      if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault()
        handleDeleteSelected()
      }
    },
    [handleDeleteSelected],
  )

  useHotkeys(
    "ctrl+l, cmd+l",
    (e) => {
      e.preventDefault()
      handleToggleLock()
    },
    [handleToggleLock],
  )

  useHotkeys(
    "g",
    (e) => {
      if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault()
        handleToggleGrid()
      }
    },
    [handleToggleGrid],
  )

  useHotkeys(
    "s",
    (e) => {
      if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault()
        handleToggleSnapToGrid()
      }
    },
    [handleToggleSnapToGrid],
  )

  useHotkeys(
    "p",
    (e) => {
      if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault()
        handleTogglePreview()
      }
    },
    [handleTogglePreview],
  )

  // Initialize history with empty state
  useEffect(() => {
    if (editorState.history.length === 0) {
      saveToHistory()
    }
  }, [editorState.history.length, saveToHistory])

  // Auto-save every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (editorState.elements.length > 0) {
        console.log("Auto-saving...")
        // In a real implementation, you would save to localStorage or a backend
        // localStorage.setItem('website-builder-autosave', JSON.stringify(editorState))
      }
    }, 30000)

    return () => clearInterval(autoSaveInterval)
  }, [editorState])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)

    // Check if this is a new element being dragged from the panel
    if (typeof active.id === "string" && active.id.startsWith("new-")) {
      setDraggedElement(active.id.replace("new-", "") as ElementType)
    }

    // Check if this is a section being dragged
    if (typeof active.id === "string" && active.id.startsWith("section-")) {
      setDraggedSection(active.id.replace("section-", "") as SectionType)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setDraggedElement(null)
    setDraggedSection(null)

    if (over && over.id === "canvas") {
      // If dragging a new element from the panel to the canvas
      if (typeof active.id === "string" && active.id.startsWith("new-")) {
        const elementType = active.id.replace("new-", "") as ElementType
        let position = {
          x: event.delta.x,
          y: event.delta.y,
        }

        // Apply snap to grid if enabled
        if (editorState.snapToGrid) {
          position = snapToGrid(position, editorState.gridSize)
        }

        const newElement = createNewElement(elementType, position)

        setEditorState((prev) => ({
          ...prev,
          elements: [...prev.elements, newElement],
          selectedElementIds: [newElement.id],
        }))

        saveToHistory()
      }
      // If dragging a section from the panel to the canvas
      else if (typeof active.id === "string" && active.id.startsWith("section-")) {
        const sectionType = active.id.replace("section-", "") as SectionType
        const section = createSection(sectionType)

        // Adjust positions of all elements in the section
        const adjustedElements = section.elements.map((el) => ({
          ...el,
          position: {
            x: el.position.x + event.delta.x,
            y: el.position.y + event.delta.y,
          },
        }))

        setEditorState((prev) => ({
          ...prev,
          elements: [...prev.elements, ...adjustedElements],
          selectedElementIds: adjustedElements.map((el) => el.id),
        }))

        saveToHistory()
      }
      // Update position of existing element(s)
      else {
        const selectedElements = editorState.elements.filter((el) => editorState.selectedElementIds.includes(el.id))

        // Only move elements that aren't locked
        const elementsToMove = selectedElements.filter((el) => !el.isLocked)

        if (elementsToMove.length > 0) {
          const updatedElements = editorState.elements.map((el) => {
            if (elementsToMove.some((selected) => selected.id === el.id)) {
              let newPosition = {
                x: el.position.x + event.delta.x,
                y: el.position.y + event.delta.y,
              }

              // Apply snap to grid if enabled
              if (editorState.snapToGrid) {
                newPosition = snapToGrid(newPosition, editorState.gridSize)
              }

              return {
                ...el,
                position: newPosition,
              }
            }
            return el
          })

          setEditorState((prev) => ({
            ...prev,
            elements: updatedElements,
          }))

          saveToHistory()
        }
      }
    }
  }

  const handleElementSelect = (element: WebsiteElement, isMultiSelect: boolean) => {
    if (editorState.isPreviewMode) return

    // Don't select locked elements unless already selected
    if (element.isLocked && !editorState.selectedElementIds.includes(element.id)) {
      return
    }

    if (isMultiSelect) {
      // Toggle selection for multi-select
      setEditorState((prev) => {
        const newSelectedIds = prev.selectedElementIds.includes(element.id)
          ? prev.selectedElementIds.filter((id) => id !== element.id)
          : [...prev.selectedElementIds, element.id]

        return {
          ...prev,
          selectedElementIds: newSelectedIds,
        }
      })
    } else {
      // Single select
      setEditorState((prev) => ({
        ...prev,
        selectedElementIds: [element.id],
      }))
    }
  }

  const handleCanvasClick = () => {
    if (!editorState.isPreviewMode) {
      setEditorState((prev) => ({
        ...prev,
        selectedElementIds: [],
      }))
    }
  }

  const handleElementUpdate = (updatedElement: WebsiteElement) => {
    setEditorState((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === updatedElement.id ? updatedElement : el)),
    }))

    saveToHistory()
  }

  const handleDeleteElement = (id: string) => {
    setEditorState((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== id),
      selectedElementIds: prev.selectedElementIds.filter((selectedId) => selectedId !== id),
    }))

    saveToHistory()
  }

  const handleUpdateElementLayer = (id: string, direction: "up" | "down" | "top" | "bottom") => {
    const element = editorState.elements.find((el) => el.id === id)
    if (!element) return

    const newElements = [...editorState.elements]

    // Sort elements by z-index
    newElements.sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1))

    // Find the index of the element
    const index = newElements.findIndex((el) => el.id === id)

    if (direction === "up" && index < newElements.length - 1) {
      // Swap z-index with the element above
      const nextElement = newElements[index + 1]
      const tempZIndex = element.zIndex || 1
      newElements[index] = { ...element, zIndex: nextElement.zIndex || 1 }
      newElements[index + 1] = { ...nextElement, zIndex: tempZIndex }
    } else if (direction === "down" && index > 0) {
      // Swap z-index with the element below
      const prevElement = newElements[index - 1]
      const tempZIndex = element.zIndex || 1
      newElements[index] = { ...element, zIndex: prevElement.zIndex || 1 }
      newElements[index - 1] = { ...prevElement, zIndex: tempZIndex }
    } else if (direction === "top") {
      // Move to top (highest z-index)
      const highestZIndex = Math.max(...newElements.map((el) => el.zIndex || 1)) + 1
      newElements[index] = { ...element, zIndex: highestZIndex }
    } else if (direction === "bottom") {
      // Move to bottom (lowest z-index)
      const lowestZIndex = Math.min(...newElements.map((el) => el.zIndex || 1)) - 1
      newElements[index] = { ...element, zIndex: lowestZIndex }
    }

    setEditorState((prev) => ({
      ...prev,
      elements: newElements,
    }))

    saveToHistory()
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Toolbar
        canUndo={editorState.historyIndex > 0}
        canRedo={editorState.historyIndex < editorState.history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        showGrid={editorState.showGrid}
        snapToGrid={editorState.snapToGrid}
        onToggleGrid={handleToggleGrid}
        onToggleSnapToGrid={handleToggleSnapToGrid}
        isPreviewMode={editorState.isPreviewMode}
        onTogglePreview={handleTogglePreview}
        onToggleLayersPanel={() => setShowLayersPanel(!showLayersPanel)}
        onToggleSectionsPanel={() => setShowSectionsPanel(!showSectionsPanel)}
        selectedElementsCount={editorState.selectedElementIds.length}
        onDeleteSelected={handleDeleteSelected}
        onToggleLock={handleToggleLock}
      />
      <div className="flex flex-1 overflow-hidden">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
          {!editorState.isPreviewMode && !showSectionsPanel && <ElementPanel />}

          {!editorState.isPreviewMode && showSectionsPanel && <SectionPanel />}

          <Canvas
            elements={editorState.elements}
            selectedElementIds={editorState.selectedElementIds}
            onElementSelect={handleElementSelect}
            onCanvasClick={handleCanvasClick}
            onDeleteElement={handleDeleteElement}
            showGrid={editorState.showGrid && !editorState.isPreviewMode}
            gridSize={editorState.gridSize}
            isPreviewMode={editorState.isPreviewMode}
          />

          {!editorState.isPreviewMode && showLayersPanel && (
            <LayersPanel
              elements={editorState.elements}
              selectedElementIds={editorState.selectedElementIds}
              onElementSelect={handleElementSelect}
              onUpdateLayer={handleUpdateElementLayer}
            />
          )}

          {!editorState.isPreviewMode && editorState.selectedElementIds.length === 1 && (
            <PropertiesPanel
              selectedElement={editorState.elements.find((el) => el.id === editorState.selectedElementIds[0]) || null}
              onElementUpdate={handleElementUpdate}
            />
          )}
        </DndContext>
      </div>
    </div>
  )
}

