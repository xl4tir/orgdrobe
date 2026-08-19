import { Box } from '@mui/material'
import { motion } from 'framer-motion'
import { useRef, type PointerEvent, type ReactNode } from 'react'
import { staggerContainer } from '@/theme/motion'

interface ScrollRowProps {
  children: ReactNode
  /** Width of each item (CSS length). */
  itemWidth?: number | string
}

/**
 * Horizontal, snap-scrolling row with grab-to-scroll + momentum on desktop —
 * hold the mouse and drag like a swipe. Touch keeps native scrolling.
 */
export function ScrollRow({ children, itemWidth = 210 }: ScrollRowProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const drag = useRef({ down: false, moved: false, startX: 0, startScroll: 0, lastX: 0, lastT: 0, v: 0, raf: 0 })

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return // touch/pen use native scrolling
    const el = ref.current
    if (!el) return
    const d = drag.current
    cancelAnimationFrame(d.raf)
    d.down = true
    d.moved = false
    d.startX = e.clientX
    d.startScroll = el.scrollLeft
    d.lastX = e.clientX
    d.lastT = performance.now()
    d.v = 0
    el.setPointerCapture?.(e.pointerId)
    el.style.scrollSnapType = 'none'
    el.style.scrollBehavior = 'auto'
    el.style.cursor = 'grabbing'
    el.style.userSelect = 'none'
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    const el = ref.current
    if (!d.down || !el) return
    const dx = e.clientX - d.startX
    if (Math.abs(dx) > 4) d.moved = true
    el.scrollLeft = d.startScroll - dx
    const now = performance.now()
    const dt = now - d.lastT || 16
    d.v = (e.clientX - d.lastX) / dt // px per ms
    d.lastX = e.clientX
    d.lastT = now
  }

  const endDrag = () => {
    const d = drag.current
    const el = ref.current
    if (!d.down || !el) return
    d.down = false
    el.style.cursor = 'grab'
    el.style.userSelect = ''

    let v = d.v * 16 // carry the fling as px/frame
    const settle = () => {
      el.style.scrollSnapType = 'x proximity'
    }
    if (!d.moved || Math.abs(v) < 0.6) return settle()
    const step = () => {
      el.scrollLeft -= v
      v *= 0.93
      if (Math.abs(v) < 0.5) return settle()
      d.raf = requestAnimationFrame(step)
    }
    d.raf = requestAnimationFrame(step)
  }

  return (
    <Box
      ref={ref}
      component={motion.div}
      variants={staggerContainer(0.05)}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.1 }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onClickCapture={(e) => {
        // swallow the click that ends a drag so cards don't navigate
        if (drag.current.moved) {
          e.stopPropagation()
          e.preventDefault()
          drag.current.moved = false
        }
      }}
      sx={{
        display: 'grid',
        gridAutoFlow: 'column',
        gridAutoColumns: typeof itemWidth === 'number' ? `${itemWidth}px` : itemWidth,
        gap: 2,
        overflowX: 'auto',
        scrollSnapType: 'x proximity',
        cursor: 'grab',
        pb: 1.5,
        mx: { xs: -2, sm: 0 },
        px: { xs: 2, sm: 0 },
        '& > *': { scrollSnapAlign: 'start' },
        scrollbarWidth: 'thin',
        touchAction: 'pan-x',
        overscrollBehaviorX: 'contain',
      }}
    >
      {children}
    </Box>
  )
}
