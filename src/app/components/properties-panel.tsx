"use client"

import type { WebsiteElement, Theme } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { predefinedThemes } from "@/lib/element-utils"

interface PropertiesPanelProps {
  selectedElement: WebsiteElement | null
  onElementUpdate: (element: WebsiteElement) => void
}

export function PropertiesPanel({ selectedElement, onElementUpdate }: PropertiesPanelProps) {
  const [localElement, setLocalElement] = useState<WebsiteElement | null>(selectedElement)
  const [activeTab, setActiveTab] = useState("properties")
  const [availableThemes, setAvailableThemes] = useState<Theme[]>(predefinedThemes)
  const [selectedTheme, setSelectedTheme] = useState<string>("default")

  // Update local state when selected element changes
  useEffect(() => {
    if (selectedElement?.id !== localElement?.id) {
      setLocalElement(selectedElement)
    }
  }, [selectedElement, localElement?.id])

  if (!localElement) {
    return (
      <div className="w-80 border-l bg-muted/40 p-4 overflow-y-auto">
        <h2 className="font-semibold mb-4">Properties</h2>
        <p className="text-muted-foreground text-sm">Select an element to edit its properties</p>
      </div>
    )
  }

  const handlePropertyChange = (property: string, value: any) => {
    const updatedElement = {
      ...localElement,
      properties: {
        ...localElement.properties,
        [property]: value,
      },
    }
    setLocalElement(updatedElement)
  }

  const handleApplyChanges = () => {
    if (localElement) {
      onElementUpdate(localElement)
    }
  }

  const handleApplyTheme = (themeId: string) => {
    setSelectedTheme(themeId)
    const theme = availableThemes.find((t) => t.id === themeId)
    if (!theme || !localElement) return

    // Apply theme properties based on element type
    const updatedProperties = { ...localElement.properties }

    switch (localElement.type) {
      case "heading":
      case "text":
        updatedProperties.color = theme.colors.text
        updatedProperties.fontFamily = localElement.type === "heading" ? theme.fonts.heading : theme.fonts.body
        break
      case "button":
        updatedProperties.backgroundColor = theme.colors.primary
        updatedProperties.color = theme.colors.background
        break
      case "container":
        updatedProperties.backgroundColor = theme.colors.secondary
        break
    }

    const updatedElement = {
      ...localElement,
      properties: updatedProperties,
    }

    setLocalElement(updatedElement)
  }

  const renderProperties = () => {
    switch (localElement.type) {
      case "heading":
      case "text":
        return (
          <>
            <div className="mb-4">
              <Label htmlFor="text">Text</Label>
              <Input
                id="text"
                value={localElement.properties.text || ""}
                onChange={(e) => handlePropertyChange("text", e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="fontSize">Font Size (px)</Label>
              <div className="flex items-center gap-2">
  <Slider
    id="fontSize"
    min={8}
    max={72}
    step={1}
    value={[Number.parseInt(localElement.properties.fontSize ?? "16")]}
    onValueChange={(value) => handlePropertyChange("fontSize", `${value[0]}px`)}
    className="flex-1"
  />
  <span className="w-10 text-center">
    {Number.parseInt(localElement.properties.fontSize ?? "16")}
  </span>
</div>

            </div>
            <div className="mb-4">
              <Label htmlFor="fontFamily">Font Family</Label>
              <select
                id="fontFamily"
                value={localElement.properties.fontFamily || "Inter, sans-serif"}
                onChange={(e) => handlePropertyChange("fontFamily", e.target.value)}
                className="w-full mt-1 p-2 border rounded"
              >
                <option value="Inter, sans-serif">Inter</option>
                <option value="Poppins, sans-serif">Poppins</option>
                <option value="Roboto, sans-serif">Roboto</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="Georgia, serif">Georgia</option>
              </select>
            </div>
            <div className="mb-4">
              <Label htmlFor="fontWeight">Font Weight</Label>
              <select
                id="fontWeight"
                value={localElement.properties.fontWeight || "400"}
                onChange={(e) => handlePropertyChange("fontWeight", e.target.value)}
                className="w-full mt-1 p-2 border rounded"
              >
                <option value="300">Light</option>
                <option value="400">Regular</option>
                <option value="500">Medium</option>
                <option value="600">Semi Bold</option>
                <option value="700">Bold</option>
              </select>
            </div>
            <div className="mb-4">
              <Label htmlFor="color">Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="color"
                  type="color"
                  value={localElement.properties.color || "#000000"}
                  onChange={(e) => handlePropertyChange("color", e.target.value)}
                  className="w-12 h-8 p-1"
                />
                <Input
                  value={localElement.properties.color || "#000000"}
                  onChange={(e) => handlePropertyChange("color", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </>
        )
      case "image":
        return (
          <>
            <div className="mb-4">
              <Label htmlFor="src">Image URL</Label>
              <Input
                id="src"
                value={localElement.properties.src || ""}
                onChange={(e) => handlePropertyChange("src", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="mt-1"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                id="alt"
                value={localElement.properties.alt || ""}
                onChange={(e) => handlePropertyChange("alt", e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                value={localElement.properties.width || ""}
                onChange={(e) => handlePropertyChange("width", e.target.value)}
                placeholder="250px or 100%"
                className="mt-1"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                value={localElement.properties.height || ""}
                onChange={(e) => handlePropertyChange("height", e.target.value)}
                placeholder="150px or auto"
                className="mt-1"
              />
            </div>
          </>
        )
      case "button":
        return (
          <>
            <div className="mb-4">
              <Label htmlFor="text">Button Text</Label>
              <Input
                id="text"
                value={localElement.properties.text || ""}
                onChange={(e) => handlePropertyChange("text", e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={localElement.properties.backgroundColor || "#3b82f6"}
                  onChange={(e) => handlePropertyChange("backgroundColor", e.target.value)}
                  className="w-12 h-8 p-1"
                />
                <Input
                  value={localElement.properties.backgroundColor || "#3b82f6"}
                  onChange={(e) => handlePropertyChange("backgroundColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="color">Text Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="color"
                  type="color"
                  value={localElement.properties.color || "#ffffff"}
                  onChange={(e) => handlePropertyChange("color", e.target.value)}
                  className="w-12 h-8 p-1"
                />
                <Input
                  value={localElement.properties.color || "#ffffff"}
                  onChange={(e) => handlePropertyChange("color", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="paddingX">Padding X</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="paddingX"
                    min={0}
                    max={50}
                    step={1}
                    value={[localElement.properties.paddingX || 16]}
                    onValueChange={(value) => handlePropertyChange("paddingX", value[0])}
                    className="flex-1"
                  />
                  <span className="w-8 text-center">{localElement.properties.paddingX || 16}</span>
                </div>
              </div>
              <div>
                <Label htmlFor="paddingY">Padding Y</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="paddingY"
                    min={0}
                    max={50}
                    step={1}
                    value={[localElement.properties.paddingY || 8]}
                    onValueChange={(value) => handlePropertyChange("paddingY", value[0])}
                    className="flex-1"
                  />
                  <span className="w-8 text-center">{localElement.properties.paddingY || 8}</span>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="borderRadius">Border Radius</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="borderRadius"
                  min={0}
                  max={50}
                  step={1}
                  value={[localElement.properties.borderRadius || 4]}
                  onValueChange={(value) => handlePropertyChange("borderRadius", value[0])}
                  className="flex-1"
                />
                <span className="w-8 text-center">{localElement.properties.borderRadius || 4}</span>
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="fontFamily">Font Family</Label>
              <select
                id="fontFamily"
                value={localElement.properties.fontFamily || "Inter, sans-serif"}
                onChange={(e) => handlePropertyChange("fontFamily", e.target.value)}
                className="w-full mt-1 p-2 border rounded"
              >
                <option value="Inter, sans-serif">Inter</option>
                <option value="Poppins, sans-serif">Poppins</option>
                <option value="Roboto, sans-serif">Roboto</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="Georgia, serif">Georgia</option>
              </select>
            </div>
          </>
        )
      case "container":
        return (
          <>
            <div className="mb-4">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                value={localElement.properties.width || ""}
                onChange={(e) => handlePropertyChange("width", e.target.value)}
                placeholder="300px or 100%"
                className="mt-1"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                value={localElement.properties.height || ""}
                onChange={(e) => handlePropertyChange("height", e.target.value)}
                placeholder="200px or auto"
                className="mt-1"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={localElement.properties.backgroundColor || "#f3f4f6"}
                  onChange={(e) => handlePropertyChange("backgroundColor", e.target.value)}
                  className="w-12 h-8 p-1"
                />
                <Input
                  value={localElement.properties.backgroundColor || "#f3f4f6"}
                  onChange={(e) => handlePropertyChange("backgroundColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="borderRadius">Border Radius</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="borderRadius"
                  min={0}
                  max={50}
                  step={1}
                  value={[localElement.properties.borderRadius || 0]}
                  onValueChange={(value) => handlePropertyChange("borderRadius", value[0])}
                  className="flex-1"
                />
                <span className="w-8 text-center">{localElement.properties.borderRadius || 0}</span>
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="padding">Padding</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="padding"
                  min={0}
                  max={50}
                  step={1}
                  value={[localElement.properties.padding || 0]}
                  onValueChange={(value) => handlePropertyChange("padding", value[0])}
                  className="flex-1"
                />
                <span className="w-8 text-center">{localElement.properties.padding || 0}</span>
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="margin">Margin</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="margin"
                  min={0}
                  max={50}
                  step={1}
                  value={[localElement.properties.margin || 0]}
                  onValueChange={(value) => handlePropertyChange("margin", value[0])}
                  className="flex-1"
                />
                <span className="w-8 text-center">{localElement.properties.margin || 0}</span>
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="text">Content Text (Optional)</Label>
              <Input
                id="text"
                value={localElement.properties.text || ""}
                onChange={(e) => handlePropertyChange("text", e.target.value)}
                className="mt-1"
              />
            </div>
          </>
        )
      case "list":
        return (
          <>
            <div className="mb-4">
              <Label htmlFor="listStyle">List Style</Label>
              <select
                id="listStyle"
                value={localElement.properties.listStyle || "disc"}
                onChange={(e) => handlePropertyChange("listStyle", e.target.value)}
                className="w-full mt-1 p-2 border rounded"
              >
                <option value="disc">Disc</option>
                <option value="circle">Circle</option>
                <option value="square">Square</option>
                <option value="decimal">Numbered</option>
                <option value="none">None</option>
              </select>
            </div>
            <div className="mb-4">
              <Label htmlFor="fontFamily">Font Family</Label>
              <select
                id="fontFamily"
                value={localElement.properties.fontFamily || "Inter, sans-serif"}
                onChange={(e) => handlePropertyChange("fontFamily", e.target.value)}
                className="w-full mt-1 p-2 border rounded"
              >
                <option value="Inter, sans-serif">Inter</option>
                <option value="Poppins, sans-serif">Poppins</option>
                <option value="Roboto, sans-serif">Roboto</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="Georgia, serif">Georgia</option>
              </select>
            </div>
            <div className="mb-4">
              <Label>List Items</Label>
              {(localElement.properties.items || []).map((item, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newItems = [...(localElement.properties.items || [])]
                      newItems[index] = e.target.value
                      handlePropertyChange("items", newItems)
                    }}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const newItems = [...(localElement.properties.items || [])]
                      newItems.splice(index, 1)
                      handlePropertyChange("items", newItems)
                    }}
                  >
                    ✕
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newItems = [...(localElement.properties.items || []), "New item"]
                  handlePropertyChange("items", newItems)
                }}
                className="mt-2"
              >
                Add Item
              </Button>
            </div>
          </>
        )
      case "form":
        return (
          <>
            <div className="mb-4">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                value={localElement.properties.width || ""}
                onChange={(e) => handlePropertyChange("width", e.target.value)}
                placeholder="300px or 100%"
                className="mt-1"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="fontFamily">Font Family</Label>
              <select
                id="fontFamily"
                value={localElement.properties.fontFamily || "Inter, sans-serif"}
                onChange={(e) => handlePropertyChange("fontFamily", e.target.value)}
                className="w-full mt-1 p-2 border rounded"
              >
                <option value="Inter, sans-serif">Inter</option>
                <option value="Poppins, sans-serif">Poppins</option>
                <option value="Roboto, sans-serif">Roboto</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="Georgia, serif">Georgia</option>
              </select>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              This is a form placeholder. In a real implementation, you would be able to add, remove, and configure form
              fields.
            </p>
          </>
        )
      default:
        return <p>No properties available for this element type</p>
    }
  }

  const renderThemes = () => {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Apply a theme to this element. This will change colors and fonts based on the selected theme.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {availableThemes.map((theme) => (
            <div
              key={theme.id}
              className={`p-3 border rounded-md cursor-pointer hover:border-primary transition-colors ${
                selectedTheme === theme.id ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => handleApplyTheme(theme.id)}
            >
              <div className="text-sm font-medium mb-2">{theme.name}</div>
              <div className="flex gap-1 mb-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors.secondary }} />
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
              </div>
              <div className="text-xs" style={{ fontFamily: theme.fonts.heading }}>
                Heading Font
              </div>
              <div className="text-xs" style={{ fontFamily: theme.fonts.body }}>
                Body Font
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 border-l bg-muted/40 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Properties</h2>
        <span className="text-xs bg-muted px-2 py-1 rounded-md capitalize">{localElement.type}</span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="properties" className="flex-1">
            Properties
          </TabsTrigger>
          <TabsTrigger value="themes" className="flex-1">
            Themes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="space-y-4">
          {renderProperties()}
        </TabsContent>

        <TabsContent value="themes" className="space-y-4">
          {renderThemes()}
        </TabsContent>
      </Tabs>

      <Button onClick={handleApplyChanges} className="w-full mt-4">
        Apply Changes
      </Button>
    </div>
  )
}

