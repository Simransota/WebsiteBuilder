export type ElementType = "heading" | "text" | "image" | "button" | "container" | "list" | "form"

export type SectionType = "hero" | "features" | "testimonials" | "contact" | "pricing" | "gallery"

export interface ElementPosition {
  x: number
  y: number
}

export interface ElementSize {
  width: number | string
  height: number | string
}

export interface ElementProperties {
  [key: string]: any
  // Common properties
  text?: string
  color?: string

  // Text specific
  fontSize?: string
  fontFamily?: string
  fontWeight?: string

  // Image specific
  src?: string
  alt?: string
  width?: string
  height?: string

  // Button specific
  backgroundColor?: string
  paddingX?: number
  paddingY?: number
  borderRadius?: number

  // Container specific
  padding?: number
  margin?: number

  // List specific
  listStyle?: string
  items?: string[]
}

export interface WebsiteElement {
  id: string
  type: ElementType
  position: ElementPosition
  size?: ElementSize
  properties: ElementProperties
  isLocked?: boolean
  zIndex?: number
}

export interface Section {
  id: string
  type: SectionType
  name: string
  elements: WebsiteElement[]
  thumbnail: string
}

export interface Theme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
    accent: string
  }
  fonts: {
    heading: string
    body: string
  }
}

export interface HistoryState {
  elements: WebsiteElement[]
  selectedElementIds: string[]
  timestamp: number
}

export interface EditorState {
  elements: WebsiteElement[]
  selectedElementIds: string[]
  history: HistoryState[]
  historyIndex: number
  showGrid: boolean
  snapToGrid: boolean
  gridSize: number
  isPreviewMode: boolean
}

