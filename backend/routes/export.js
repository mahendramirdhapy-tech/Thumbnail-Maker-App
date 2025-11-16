// backend/routes/export.js
import express from 'express'
import { createCanvas } from 'canvas'
import sharp from 'sharp'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { fabricJson, format, addWatermark } = req.body

    // Recreate canvas from Fabric.js JSON
    const canvas = createCanvas(fabricJson.width, fabricJson.height)
    const ctx = canvas.getContext('2d')

    // Background
    if (fabricJson.backgroundColor) {
      ctx.fillStyle = fabricJson.backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Render objects (simplified - in production you'd need full Fabric.js rendering)
    // This is a simplified version

    let imageBuffer
    if (format === 'jpg') {
      imageBuffer = canvas.toBuffer('image/jpeg', { quality: 1 })
    } else {
      imageBuffer = canvas.toBuffer('image/png')
    }

    // Add watermark if needed
    if (addWatermark) {
      imageBuffer = await addWatermarkToImage(imageBuffer)
    }

    res.setHeader('Content-Type', `image/${format === 'jpg' ? 'jpeg' : 'png'}`)
    res.setHeader('Content-Disposition', `attachment; filename=thumbnail.${format === 'jpg' ? 'jpg' : 'png'}`)
    res.send(imageBuffer)

  } catch (error) {
    console.error('Export error:', error)
    res.status(500).json({ error: 'Export failed' })
  }
})

async function addWatermarkToImage(imageBuffer) {
  const watermarkSvg = `
    <svg width="200" height="50" xmlns="http://www.w3.org/2000/svg">
      <text x="10" y="30" font-family="Arial" font-size="20" fill="rgba(0,0,0,0.3)">
        Made with ThumbnailMaker
      </text>
    </svg>
  `

  return sharp(imageBuffer)
    .composite([{ input: Buffer.from(watermarkSvg), top: 10, left: 10 }])
    .png()
    .toBuffer()
}

export default router
