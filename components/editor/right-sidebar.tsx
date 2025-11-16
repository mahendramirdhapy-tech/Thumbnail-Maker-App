// components/editor/right-sidebar.tsx
import { useCanvasStore } from '@/store/canvas-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Move, 
  Lock, 
  Trash2,
  Layers,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

export function RightSidebar() {
  const { activeObject, canvas } = useCanvasStore()

  if (!activeObject) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="text-center text-gray-500">
          <Layers className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Select an object to edit properties</p>
        </div>
      </div>
    )
  }

  const handlePropertyChange = (property: string, value: any) => {
    if (!activeObject || !canvas) return

    activeObject.set(property, value)
    canvas.renderAll()
  }

  const bringForward = () => {
    if (!activeObject || !canvas) return
    activeObject.bringForward()
    canvas.renderAll()
  }

  const sendBackward = () => {
    if (!activeObject || !canvas) return
    activeObject.sendBackwards()
    canvas.renderAll()
  }

  const removeObject = () => {
    if (!activeObject || !canvas) return
    canvas.remove(activeObject)
    canvas.renderAll()
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <div className="space-y-6">
        {/* Object Info */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center">
            <Move className="w-4 h-4 mr-2" />
            Object Properties
          </h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="left">Left</Label>
              <Input
                id="left"
                type="number"
                value={Math.round(activeObject.left || 0)}
                onChange={(e) => handlePropertyChange('left', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="top">Top</Label>
              <Input
                id="top"
                type="number"
                value={Math.round(activeObject.top || 0)}
                onChange={(e) => handlePropertyChange('top', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="scale">Scale</Label>
              <Input
                id="scale"
                type="number"
                step="0.1"
                value={activeObject.scaleX || 1}
                onChange={(e) => {
                  const scale = parseFloat(e.target.value)
                  handlePropertyChange('scaleX', scale)
                  handlePropertyChange('scaleY', scale)
                }}
              />
            </div>
          </div>
        </div>

        {/* Text Properties */}
        {activeObject.type === 'text' && (
          <div>
            <h3 className="font-semibold mb-3">Text Properties</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="fontSize">Font Size</Label>
                <Input
                  id="fontSize"
                  type="number"
                  value={(activeObject as fabric.Text).fontSize}
                  onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="fontFamily">Font Family</Label>
                <Input
                  id="fontFamily"
                  value={(activeObject as fabric.Text).fontFamily}
                  onChange={(e) => handlePropertyChange('fontFamily', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Layer Controls */}
        <div>
          <h3 className="font-semibold mb-3">Layer</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={bringForward}>
              <ArrowUp className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={sendBackward}>
              <ArrowDown className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Lock className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={removeObject}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
