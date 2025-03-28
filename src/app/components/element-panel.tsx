"use client"

import type React from "react"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import type { ElementType } from "@/lib/types"
import { Type, Image, BoxIcon as ButtonIcon, Square, Heading, ListOrdered, FormInput } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ElementPanel() {
  return (
    <div className="w-64 border-r bg-muted/40 p-4 overflow-y-auto">
      <h2 className="font-semibold mb-4">Elements</h2>

      <Tabs defaultValue="basic">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="basic" className="flex-1">
            Basic
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex-1">
            Layout
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <div className="grid grid-cols-2 gap-2">
            <DraggableElement type="heading" icon={<Heading size={20} />} label="Heading" />
            <DraggableElement type="text" icon={<Type size={20} />} label="Text" />
            <DraggableElement type="image" icon={<Image size={20} />} label="Image" />
            <DraggableElement type="button" icon={<ButtonIcon size={20} />} label="Button" />
          </div>
        </TabsContent>

        <TabsContent value="layout">
          <div className="grid grid-cols-2 gap-2">
            <DraggableElement type="container" icon={<Square size={20} />} label="Container" />
            <DraggableElement type="list" icon={<ListOrdered size={20} />} label="List" />
            <DraggableElement type="form" icon={<FormInput size={20} />} label="Form" />
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-4 pt-4 border-t">
        <h3 className="text-sm font-medium mb-2">Keyboard Shortcuts</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>Delete: Remove selected</li>
          <li>Ctrl+Z: Undo</li>
          <li>Ctrl+Shift+Z: Redo</li>
          <li>Ctrl+L: Lock/Unlock</li>
          <li>G: Toggle grid</li>
          <li>S: Toggle snap to grid</li>
          <li>P: Toggle preview mode</li>
        </ul>
      </div>
    </div>
  )
}

interface DraggableElementProps {
  type: ElementType
  icon: React.ReactNode
  label: string
}

function DraggableElement({ type, icon, label }: DraggableElementProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `new-${type}`,
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
      className="flex flex-col items-center justify-center p-3 bg-background rounded-md border cursor-move hover:border-primary transition-colors"
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </div>
  )
}

