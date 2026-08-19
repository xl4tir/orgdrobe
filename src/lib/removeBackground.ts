/**
 * Lightweight background remover for product-style photos (garment on a plain,
 * light, fairly uniform background). Flood-fills from the borders, clearing
 * every pixel connected to the edge whose colour matches the sampled background,
 * then crops tightly to what's left. Returns a transparent PNG data URL.
 *
 * If the background looks busy / non-uniform (corners disagree), it bails and
 * returns the original image untouched — better a real photo than a mangled one.
 */
export function removeBackground(src: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const maxDim = 1000
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
      const width = Math.max(1, Math.round(img.width * scale))
      const height = Math.max(1, Math.round(img.height * scale))

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return resolve(src)
      ctx.drawImage(img, 0, 0, width, height)

      let imageData: ImageData
      try {
        imageData = ctx.getImageData(0, 0, width, height)
      } catch {
        return resolve(src) // tainted canvas
      }
      const data = imageData.data

      // Sample the four corners as the background reference.
      const cornerIdx = [
        0,
        (width - 1) * 4,
        (height - 1) * width * 4,
        ((height - 1) * width + (width - 1)) * 4,
      ]
      const corners = cornerIdx.map((i) => [data[i], data[i + 1], data[i + 2]])
      const br = corners.reduce((s, c) => s + c[0], 0) / 4
      const bg = corners.reduce((s, c) => s + c[1], 0) / 4
      const bb = corners.reduce((s, c) => s + c[2], 0) / 4

      // Bail if the corners disagree too much (busy background).
      let maxCornerDist = 0
      for (const c of corners) {
        const d = (c[0] - br) ** 2 + (c[1] - bg) ** 2 + (c[2] - bb) ** 2
        if (d > maxCornerDist) maxCornerDist = d
      }
      if (maxCornerDist > 55 * 55) return resolve(src)

      const threshold = 48
      const thr2 = threshold * threshold
      const visited = new Uint8Array(width * height)
      const stack: number[] = []

      const consider = (x: number, y: number) => {
        if (x < 0 || y < 0 || x >= width || y >= height) return
        const p = y * width + x
        if (visited[p]) return
        const i = p * 4
        const dr = data[i] - br
        const dg = data[i + 1] - bg
        const db = data[i + 2] - bb
        if (dr * dr + dg * dg + db * db <= thr2) {
          visited[p] = 1
          data[i + 3] = 0 // transparent
          stack.push(p)
        }
      }

      for (let x = 0; x < width; x++) {
        consider(x, 0)
        consider(x, height - 1)
      }
      for (let y = 0; y < height; y++) {
        consider(0, y)
        consider(width - 1, y)
      }
      while (stack.length) {
        const p = stack.pop() as number
        const x = p % width
        const y = (p / width) | 0
        consider(x - 1, y)
        consider(x + 1, y)
        consider(x, y - 1)
        consider(x, y + 1)
      }

      // Defringe: clear leftover near-background pixels touching the cut edge.
      const fringe2 = (threshold * 1.7) ** 2
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const p = y * width + x
          const i = p * 4
          if (data[i + 3] === 0) continue
          const neighbourTransparent =
            (x > 0 && data[(p - 1) * 4 + 3] === 0) ||
            (x < width - 1 && data[(p + 1) * 4 + 3] === 0) ||
            (y > 0 && data[(p - width) * 4 + 3] === 0) ||
            (y < height - 1 && data[(p + width) * 4 + 3] === 0)
          if (!neighbourTransparent) continue
          const dr = data[i] - br
          const dg = data[i + 1] - bg
          const db = data[i + 2] - bb
          if (dr * dr + dg * dg + db * db <= fringe2) data[i + 3] = 0
        }
      }

      ctx.putImageData(imageData, 0, 0)

      // Crop to the bounding box of remaining opaque pixels.
      let minX = width
      let minY = height
      let maxX = 0
      let maxY = 0
      let found = false
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (data[(y * width + x) * 4 + 3] > 12) {
            found = true
            if (x < minX) minX = x
            if (x > maxX) maxX = x
            if (y < minY) minY = y
            if (y > maxY) maxY = y
          }
        }
      }
      if (!found) return resolve(src)

      const pad = Math.round(Math.max(maxX - minX, maxY - minY) * 0.05)
      minX = Math.max(0, minX - pad)
      minY = Math.max(0, minY - pad)
      maxX = Math.min(width - 1, maxX + pad)
      maxY = Math.min(height - 1, maxY + pad)
      const cw = maxX - minX + 1
      const ch = maxY - minY + 1

      const out = document.createElement('canvas')
      out.width = cw
      out.height = ch
      const octx = out.getContext('2d')
      if (!octx) return resolve(canvas.toDataURL('image/png'))
      octx.drawImage(canvas, minX, minY, cw, ch, 0, 0, cw, ch)
      resolve(out.toDataURL('image/png'))
    }
    img.onerror = () => resolve(src)
    img.src = src
  })
}
