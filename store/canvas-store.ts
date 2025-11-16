// store/canvas-store.ts
import { create } from 'zustand'
import { fabric } from 'fabric'

interface CanvasState {
  canvas: fabric.Canvas | null
  activeObject: fabric.Object | null
  zoom: number
  aspectRatio: '16:9' | '9:16'
  history: string[]
  historyIndex: number
  
  // Actions
  initCanvas: (width: number, height: number) => void
  setActiveObject: (obj: fabric.Object | null) => void
  setZoom: (zoom: number) => void
  setAspectRatio: (ratio: '16:9' | '9:16') => void
  addText: (text: string) => void
  addImage: (url: string) => void
  removeBackground: (imageUrl: string) => Promise<void>
  exportCanvas: (format: 'png' | 'jpg' | 'png-transparent') => Promise<string>
  saveToHistory: () => void
  undo: () => void
  redo: () => void
  loadTemplate: (templateJson: any) => void
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  canvas: null,
  activeObject: null,
  zoom: 1,
  aspectRatio: '16:9',
  history: [],
  historyIndex: -1,

  initCanvas: (width: number, height: number) => {
    const canvas = new fabric.Canvas('canvas', {
      width,
      height,
      backgroundColor: '#ffffff',
    })

    canvas.on('selection:created', (e) => {
      set({ activeObject: e.selected?.[0] || null })
    })

    canvas.on('selection:updated', (e) => {
      set({ activeObject: e.selected?.[0] || null })
    })

    canvas.on('selection:cleared', () => {
      set({ activeObject: null })
    })

    set({ canvas })
    get().saveToHistory()
  },

  setActiveObject: (obj) => set({ activeObject: obj }),

  setZoom: (zoom) => {
    const { canvas } = get()
    if (canvas) {
      canvas.setZoom(zoom)
      set({ zoom })
    }
  },

  setAspectRatio: (ratio) => {
    const { canvas } = get()
    if (canvas) {
      const width = ratio === '16:9' ? 1280 : 720
      const height = ratio === '16:9' ? 720 : 1280
      
      canvas.setDimensions({ width, height })
      set({ aspectRatio: ratio })
      get().saveToHistory()
    }
  },

  addText: (text) => {
    const { canvas } = get()
    if (!canvas) return

    const textObj = new fabric.Text(text, {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fontSize: 48,
      fill: '#000000',
    })

    canvas.add(textObj)
    canvas.setActiveObject(textObj)
    get().saveToHistory()
  },

  addImage: async (url) => {
    const { canvas } = get()
    if (!canvas) return

    fabric.Image.fromURL(url, (img) => {
      img.scaleToWidth(300)
      canvas.add(img)
      canvas.setActiveObject(img)
      get().saveToHistory()
    })
  },

  removeBackground: async (imageUrl) => {
    // This will call the backend API
    const response = await fetch('/api/remove-bg', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl }),
    })

    const { processedUrl } = await response.json()
    get().addImage(processedUrl)
  },

  exportCanvas: async (format) => {
    const { canvas } = get()
    if (!canvas) return ''

    // Add watermark if free user
    // Implementation depends on user auth status
    
    const dataUrl = canvas.toDataURL({
      format: format === 'jpg' ? 'jpeg' : 'png',
      quality: 1,
    })

    return dataUrl
  },

  saveToHistory: () => {
    const { canvas, history, historyIndex } = get()
    if (!canvas) return

    const json = JSON.stringify(canvas.toJSON())
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(json)
    
    set({ 
      history: newHistory,
      historyIndex: newHistory.length - 1 
    })
  },

  undo: () => {
    const { canvas, history, historyIndex } = get()
    if (!canvas || historyIndex <= 0) return

    const newIndex = historyIndex - 1
    canvas.loadFromJSON(history[newIndex], () => {
      canvas.renderAll()
      set({ historyIndex: newIndex })
    })
  },

  redo: () => {
    const { canvas, history, historyIndex } = get()
    if (!canvas || historyIndex >= history.length - 1) return

    const newIndex = historyIndex + 1
    canvas.loadFromJSON(history[newIndex], () => {
      canvas.renderAll()
      set({ historyIndex: newIndex })
    })
  },

  loadTemplate: (templateJson) => {
    const { canvas } = get()
    if (!canvas) return

    canvas.loadFromJSON(templateJson, () => {
      canvas.renderAll()
      get().saveToHistory()
    })
  },
}))
