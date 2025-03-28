"use client"

import type React from "react"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import type { WebsiteElement } from "@/lib/types"
import { X, Lock } from "lucide-react"
import { useRef, useState, useEffect } from "react"

interface ElementRendererProps {
  element: WebsiteElement
  isSelected: boolean
  onSelect: (e: React.MouseEvent) => void
  onDelete: () => void
  isPreviewMode: boolean
}

export function ElementRenderer({ element, isSelected, onSelect, onDelete, isPreviewMode }: ElementRendererProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: element.id,
    disabled: element.isLocked || isPreviewMode,
  })

  const [size, setSize] = useState({
    width: typeof element.size?.width === "number" ? element.size.width : "auto",
    height: typeof element.size?.height === "number" ? element.size.height : "auto",
  })

  const elementRef = useRef<HTMLDivElement>(null)

  // Update size when element size changes
  useEffect(() => {
    if (elementRef.current) {
      const { offsetWidth, offsetHeight } = elementRef.current
      setSize({
        width: typeof element.size?.width === "number" ? element.size.width : offsetWidth,
        height: typeof element.size?.height === "number" ? element.size.height : offsetHeight,
      })
    }
  }, [element.size])

  const style = {
    transform: CSS.Translate.toString(transform),
    left: `${element.position.x}px`,
    top: `${element.position.y}px`,
    zIndex: element.zIndex || 1,
  }

  const renderElementContent = () => {
    switch (element.type) {
      case "heading":
        return (
          <h2
            style={{
              fontSize: element.properties.fontSize,
              color: element.properties.color,
              fontFamily: element.properties.fontFamily,
              fontWeight: element.properties.fontWeight,
            }}
          >
            {element.properties.text}
          </h2>
        )
      case "text":
        return (
          <p
            style={{
              fontSize: element.properties.fontSize,
              color: element.properties.color,
              fontFamily: element.properties.fontFamily,
              fontWeight: element.properties.fontWeight,
            }}
          >
            {element.properties.text}
          </p>
        )
      case "image":
        return (
          <img
            src={element.properties.src || "/placeholder.svg?height=150&width=250"}
            alt={element.properties.alt || "Image"}
            style={{
              width: element.properties.width,
              height: element.properties.height,
            }}
          />
        )
      case "button":
        return (
          <button
            style={{
              backgroundColor: element.properties.backgroundColor,
              color: element.properties.color,
              padding: `${element.properties.paddingY}px ${element.properties.paddingX}px`,
              borderRadius: `${element.properties.borderRadius}px`,
              fontFamily: element.properties.fontFamily,
              fontWeight: element.properties.fontWeight,
            }}
            className="cursor-default"
            onClick={(e) => {
              if (isPreviewMode) {
                e.stopPropagation()
                // In preview mode, we'd handle the actual button click action
                console.log("Button clicked in preview mode")
              }
            }}
          >
            {element.properties.text}
          </button>
        )
      case "container":
        return (
          <div
            style={{
              width: element.properties.width,
              height: element.properties.height,
              backgroundColor: element.properties.backgroundColor,
              borderRadius: `${element.properties.borderRadius}px`,
              padding: `${element.properties.padding}px`,
              margin: `${element.properties.margin || 0}px`,
            }}
          >
            {element.properties.text && <p>{element.properties.text}</p>}
          </div>
        )
      case "list":
        return (
          <ul
            style={{
              listStyleType: element.properties.listStyle,
              fontFamily: element.properties.fontFamily,
            }}
          >
            {element.properties.items?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )
      case "form":
        return (
          <form
            style={{ width: element.properties.width }}
            className="cursor-default"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault()
              if (isPreviewMode) {
                // In preview mode, we'd handle the form submission
                console.log("Form submitted in preview mode")
              }
            }}
          >
            <div className="mb-2">
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Enter your name"
                disabled={!isPreviewMode}
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                placeholder="Enter your email"
                disabled={!isPreviewMode}
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded" disabled={!isPreviewMode}>
              Submit
            </button>
          </form>
        )
      default:
        return <div>Unknown element type</div>
    }
  }

  // Resize handlers
  const handleResize = (direction: string, e: React.MouseEvent) => {
    e.stopPropagation()

    // In a real implementation, you would add resize functionality here
    console.log(`Resize ${direction}`)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation()
        if (!isPreviewMode) {
          onSelect(e)
        }
      }}
      className={`absolute ${isPreviewMode ? "cursor-default" : "cursor-move"} ${isSelected && !isPreviewMode ? "outline outline-2 outline-primary" : ""}`}
    >
      <div ref={elementRef} {...(isPreviewMode ? {} : { ...listeners, ...attributes })}>
        {renderElementContent()}

        {isSelected && !isPreviewMode && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="absolute -top-3 -right-3 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm"
            >
              <X size={14} />
            </button>

            {element.isLocked && (
              <div className="absolute -top-3 -left-3 bg-muted text-muted-foreground rounded-full p-1 shadow-sm">
                <Lock size={14} />
              </div>
            )}

            {/* Resize handles */}
            <div
              className="absolute bottom-0 right-0 w-3 h-3 bg-primary cursor-se-resize"
              onMouseDown={(e) => handleResize("se", e)}
            />
            <div
              className="absolute bottom-0 left-0 w-3 h-3 bg-primary cursor-sw-resize"
              onMouseDown={(e) => handleResize("sw", e)}
            />
            <div
              className="absolute top-0 right-0 w-3 h-3 bg-primary cursor-ne-resize"
              onMouseDown={(e) => handleResize("ne", e)}
            />
            <div
              className="absolute top-0 left-0 w-3 h-3 bg-primary cursor-nw-resize"
              onMouseDown={(e) => handleResize("nw", e)}
            />
          </>
        )}
      </div>
    </div>
  )
}

