// components/editor/top-bar.tsx
import { Button } from '@/components/ui/button'
import { useCanvasStore } from '@/store/canvas-store'
import {
  Undo2,
  Redo2,
  Save,
  Download,
  AspectRatio
} from 'lucide-react'

export function TopBar() {
  const { 
    aspectRatio, 
    setAspectRatio,
    undo,
    redo,
    exportCanvas
  } = useCanvasStore()

  const handleExport = async (format: 'png' | 'jpg' | 'png-transparent') => {
    const dataUrl = await exportCanvas(format)
    const link = document.createElement('a')
    link.download = `thumbnail.${format === 'jpg' ? 'jpg' : 'png'}`
    link.href = dataUrl
    link.click()
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={undo}>
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={redo}>
          <Redo2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        {/* Aspect Ratio Toggle */}
        <div className="flex items-center space-x-2">
          <AspectRatio className="w-4 h-4" />
          <Button
            variant={aspectRatio === '16:9' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAspectRatio('16:9')}
          >
            16:9
          </Button>
          <Button
            variant={aspectRatio === '9:16' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAspectRatio('9:16')}
          >
            9:16
          </Button>
        </div>

        {/* Save & Export */}
        <Button variant="outline" size="sm">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>

        <Button size="sm" onClick={() => handleExport('png')}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  )
}
