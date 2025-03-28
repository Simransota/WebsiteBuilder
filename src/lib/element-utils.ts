import type { ElementPosition, ElementProperties, ElementType, WebsiteElement, Section, SectionType } from "./types"

export function createNewElement(type: ElementType, position: ElementPosition): WebsiteElement {
  const id = `element-${Date.now()}-${Math.floor(Math.random() * 1000)}`

  const defaultProperties: Record<ElementType, ElementProperties> = {
    heading: {
      text: "Heading Text",
      fontSize: "24px",
      color: "#000000",
      fontFamily: "Inter, sans-serif",
      fontWeight: "600",
    },
    text: {
      text: "This is a paragraph of text. Click to edit.",
      fontSize: "16px",
      color: "#000000",
      fontFamily: "Inter, sans-serif",
      fontWeight: "400",
    },
    image: {
      src: "",
      alt: "Image description",
      width: "250px",
      height: "auto",
    },
    button: {
      text: "Click Me",
      backgroundColor: "#3b82f6",
      color: "#ffffff",
      paddingX: 16,
      paddingY: 8,
      borderRadius: 4,
      fontFamily: "Inter, sans-serif",
      fontWeight: "500",
    },
    container: {
      width: "300px",
      height: "200px",
      backgroundColor: "#f3f4f6",
      borderRadius: 0,
      padding: 16,
      margin: 0,
    },
    list: {
      listStyle: "disc",
      items: ["Item 1", "Item 2", "Item 3"],
      fontFamily: "Inter, sans-serif",
    },
    form: {
      width: "100%",
      fontFamily: "Inter, sans-serif",
    },
  }

  return {
    id,
    type,
    position,
    properties: defaultProperties[type],
    isLocked: false,
    zIndex: 1,
  }
}

export function createSection(type: SectionType): Section {
  const id = `section-${Date.now()}-${Math.floor(Math.random() * 1000)}`

  const sections: Record<SectionType, Section> = {
    hero: {
      id,
      type: "hero",
      name: "Hero Section",
      thumbnail: "/placeholder.svg?height=100&width=200",
      elements: [
        {
          id: `element-${Date.now()}-1`,
          type: "heading",
          position: { x: 50, y: 50 },
          properties: {
            text: "Welcome to Our Website",
            fontSize: "36px",
            color: "#000000",
            fontFamily: "Inter, sans-serif",
            fontWeight: "700",
          },
          zIndex: 1,
        },
        {
          id: `element-${Date.now()}-2`,
          type: "text",
          position: { x: 50, y: 110 },
          properties: {
            text: "We provide the best services for your needs. Check out what we offer below.",
            fontSize: "18px",
            color: "#4b5563",
            fontFamily: "Inter, sans-serif",
            fontWeight: "400",
          },
          zIndex: 1,
        },
        {
          id: `element-${Date.now()}-3`,
          type: "button",
          position: { x: 50, y: 180 },
          properties: {
            text: "Get Started",
            backgroundColor: "#3b82f6",
            color: "#ffffff",
            paddingX: 20,
            paddingY: 10,
            borderRadius: 4,
            fontFamily: "Inter, sans-serif",
            fontWeight: "500",
          },
          zIndex: 1,
        },
      ],
    },
    features: {
      id,
      type: "features",
      name: "Features Section",
      thumbnail: "/placeholder.svg?height=100&width=200",
      elements: [
        {
          id: `element-${Date.now()}-1`,
          type: "heading",
          position: { x: 50, y: 50 },
          properties: {
            text: "Our Features",
            fontSize: "30px",
            color: "#000000",
            fontFamily: "Inter, sans-serif",
            fontWeight: "600",
          },
          zIndex: 1,
        },
        {
          id: `element-${Date.now()}-2`,
          type: "container",
          position: { x: 50, y: 100 },
          properties: {
            width: "250px",
            height: "200px",
            backgroundColor: "#f3f4f6",
            borderRadius: 8,
            padding: 16,
          },
          zIndex: 1,
        },
        {
          id: `element-${Date.now()}-3`,
          type: "container",
          position: { x: 320, y: 100 },
          properties: {
            width: "250px",
            height: "200px",
            backgroundColor: "#f3f4f6",
            borderRadius: 8,
            padding: 16,
          },
          zIndex: 1,
        },
      ],
    },
    testimonials: {
      id,
      type: "testimonials",
      name: "Testimonials Section",
      thumbnail: "/placeholder.svg?height=100&width=200",
      elements: [
        {
          id: `element-${Date.now()}-1`,
          type: "heading",
          position: { x: 50, y: 50 },
          properties: {
            text: "What Our Clients Say",
            fontSize: "30px",
            color: "#000000",
            fontFamily: "Inter, sans-serif",
            fontWeight: "600",
          },
          zIndex: 1,
        },
        {
          id: `element-${Date.now()}-2`,
          type: "container",
          position: { x: 50, y: 100 },
          properties: {
            width: "300px",
            height: "180px",
            backgroundColor: "#ffffff",
            borderRadius: 8,
            padding: 20,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
          zIndex: 1,
        },
      ],
    },
    contact: {
      id,
      type: "contact",
      name: "Contact Section",
      thumbnail: "/placeholder.svg?height=100&width=200",
      elements: [
        {
          id: `element-${Date.now()}-1`,
          type: "heading",
          position: { x: 50, y: 50 },
          properties: {
            text: "Contact Us",
            fontSize: "30px",
            color: "#000000",
            fontFamily: "Inter, sans-serif",
            fontWeight: "600",
          },
          zIndex: 1,
        },
        {
          id: `element-${Date.now()}-2`,
          type: "form",
          position: { x: 50, y: 100 },
          properties: {
            width: "400px",
          },
          zIndex: 1,
        },
      ],
    },
    pricing: {
      id,
      type: "pricing",
      name: "Pricing Section",
      thumbnail: "/placeholder.svg?height=100&width=200",
      elements: [
        {
          id: `element-${Date.now()}-1`,
          type: "heading",
          position: { x: 50, y: 50 },
          properties: {
            text: "Our Pricing",
            fontSize: "30px",
            color: "#000000",
            fontFamily: "Inter, sans-serif",
            fontWeight: "600",
          },
          zIndex: 1,
        },
        {
          id: `element-${Date.now()}-2`,
          type: "container",
          position: { x: 50, y: 100 },
          properties: {
            width: "250px",
            height: "300px",
            backgroundColor: "#ffffff",
            borderRadius: 8,
            padding: 20,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
          zIndex: 1,
        },
        {
          id: `element-${Date.now()}-3`,
          type: "container",
          position: { x: 320, y: 100 },
          properties: {
            width: "250px",
            height: "300px",
            backgroundColor: "#ffffff",
            borderRadius: 8,
            padding: 20,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
          zIndex: 1,
        },
      ],
    },
    gallery: {
      id,
      type: "gallery",
      name: "Gallery Section",
      thumbnail: "/placeholder.svg?height=100&width=200",
      elements: [
        {
          id: `element-${Date.now()}-1`,
          type: "heading",
          position: { x: 50, y: 50 },
          properties: {
            text: "Our Gallery",
            fontSize: "30px",
            color: "#000000",
            fontFamily: "Inter, sans-serif",
            fontWeight: "600",
          },
          zIndex: 1,
        },
        {
          id: `element-${Date.now()}-2`,
          type: "image",
          position: { x: 50, y: 100 },
          properties: {
            src: "/placeholder.svg?height=150&width=150",
            alt: "Gallery image 1",
            width: "150px",
            height: "150px",
          },
          zIndex: 1,
        },
        {
          id: `element-${Date.now()}-3`,
          type: "image",
          position: { x: 220, y: 100 },
          properties: {
            src: "/placeholder.svg?height=150&width=150",
            alt: "Gallery image 2",
            width: "150px",
            height: "150px",
          },
          zIndex: 1,
        },
        {
          id: `element-${Date.now()}-4`,
          type: "image",
          position: { x: 390, y: 100 },
          properties: {
            src: "/placeholder.svg?height=150&width=150",
            alt: "Gallery image 3",
            width: "150px",
            height: "150px",
          },
          zIndex: 1,
        },
      ],
    },
  }

  return sections[type]
}

export const predefinedThemes = [
  {
    id: "default",
    name: "Default",
    colors: {
      primary: "#3b82f6",
      secondary: "#10b981",
      background: "#ffffff",
      text: "#000000",
      accent: "#f59e0b",
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
  },
  {
    id: "dark",
    name: "Dark Mode",
    colors: {
      primary: "#60a5fa",
      secondary: "#34d399",
      background: "#1f2937",
      text: "#f9fafb",
      accent: "#fbbf24",
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    colors: {
      primary: "#000000",
      secondary: "#6b7280",
      background: "#ffffff",
      text: "#111827",
      accent: "#ef4444",
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
  },
  {
    id: "vibrant",
    name: "Vibrant",
    colors: {
      primary: "#8b5cf6",
      secondary: "#ec4899",
      background: "#ffffff",
      text: "#111827",
      accent: "#f97316",
    },
    fonts: {
      heading: "Poppins, sans-serif",
      body: "Inter, sans-serif",
    },
  },
]

// Helper function to check if elements are aligned
export function checkAlignment(
  element1: WebsiteElement,
  element2: WebsiteElement,
): {
  horizontal: boolean
  vertical: boolean
  horizontalDistance: number
  verticalDistance: number
} {
  const horizontalDistance = Math.abs(element1.position.x - element2.position.x)
  const verticalDistance = Math.abs(element1.position.y - element2.position.y)

  // Consider elements aligned if they're within 5px of each other
  return {
    horizontal: verticalDistance < 5,
    vertical: horizontalDistance < 5,
    horizontalDistance,
    verticalDistance,
  }
}

// Helper function to snap position to grid
export function snapToGrid(position: ElementPosition, gridSize: number): ElementPosition {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
  }
}

