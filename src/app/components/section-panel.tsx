"use client"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import type { SectionType } from "@/lib/types"

export function SectionPanel() {
  return (
    <div className="w-64 border-r bg-muted/40 p-4 overflow-y-auto">
      <h2 className="font-semibold mb-4">Predefined Sections</h2>
      <div className="grid grid-cols-1 gap-4">
        <DraggableSection type="hero" label="Hero Section" />
        <DraggableSection type="features" label="Features Section" />
        <DraggableSection type="testimonials" label="Testimonials Section" />
        <DraggableSection type="contact" label="Contact Section" />
        <DraggableSection type="pricing" label="Pricing Section" />
        <DraggableSection type="gallery" label="Gallery Section" />
      </div>
    </div>
  )
}

interface DraggableSectionProps {
  type: SectionType
  label: string
}

function DraggableSection({ type, label }: DraggableSectionProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `section-${type}`,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex flex-col items-center p-3 bg-background rounded-md border cursor-move hover:border-primary transition-colors"
    >
      <div className="w-full h-20 bg-muted rounded mb-2 flex items-center justify-center text-xs text-muted-foreground">
        {label} Preview
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}

