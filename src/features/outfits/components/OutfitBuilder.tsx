import { useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded'
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  closestCorners,
  useSensor,
  useSensors,
  useDroppable,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Garment } from '@/types/domain'
import { GarmentVisual } from '@/components/ui/GarmentVisual'

type Zone = 'active' | 'wardrobe'

interface OutfitBuilderProps {
  pieceIds: string[]
  setPieceIds: Dispatch<SetStateAction<string[]>>
  allGarments: Garment[]
}

const gridSx = {
  display: 'grid',
  gap: 1.5,
  gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)' },
} as const

/** A single draggable garment tile, used in both zones. */
function SortableGarment({
  garment,
  zone,
  onRemove,
  onAdd,
}: {
  garment: Garment
  zone: Zone
  onRemove: (id: string) => void
  onAdd: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: garment.id,
  })

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        onClick={zone === 'wardrobe' ? () => onAdd(garment.id) : undefined}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
        }}
        sx={{
          position: 'relative',
          cursor: zone === 'wardrobe' ? 'pointer' : 'grab',
          // pan-y keeps vertical page scrolling working on touch; the delay
          // TouchSensor still lets a press-and-hold start a drag.
          touchAction: 'pan-y',
          opacity: isDragging ? 0.35 : 1,
          outline: 'none',
          '&:active': { cursor: 'grabbing' },
          '& .drag-hint': { opacity: 0, transition: 'opacity .2s' },
          '&:hover .drag-hint': { opacity: 1 },
          '& .add-veil': { opacity: 0, transition: 'opacity .2s' },
          '&:hover .add-veil': zone === 'wardrobe' ? { opacity: 1 } : undefined,
        }}
      >
        <GarmentVisual garment={garment} ratio="3 / 4" radius={12} showSwatches={false} />

        {/* subtle grab affordance */}
        <Box
          className="drag-hint"
          aria-hidden
          sx={{
            position: 'absolute',
            top: 4,
            left: 4,
            display: 'grid',
            placeItems: 'center',
            width: 22,
            height: 22,
            borderRadius: '7px',
            color: '#fff',
            bgcolor: 'rgba(0,0,0,0.45)',
            pointerEvents: 'none',
          }}
        >
          <DragIndicatorRoundedIcon sx={{ fontSize: 15 }} />
        </Box>

        {zone === 'wardrobe' && (
          <Box
            className="add-veil"
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              borderRadius: '12px',
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'rgba(0,0,0,0.35)',
              pointerEvents: 'none',
            }}
          >
            <AddRoundedIcon sx={{ color: '#fff', fontSize: 30 }} />
          </Box>
        )}

        <Typography
          variant="caption"
          noWrap
          sx={{ display: 'block', mt: 0.5, textAlign: 'center', color: 'text.secondary' }}
        >
          {garment.name}
        </Typography>
      </Box>

      {zone === 'active' && (
        <IconButton
          size="small"
          aria-label={`Remove ${garment.name}`}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onRemove(garment.id)}
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            zIndex: 2,
            bgcolor: 'rgba(0,0,0,0.5)',
            color: '#fff',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.72)' },
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 15 }} />
        </IconButton>
      )}
    </Box>
  )
}

/** A droppable zone wrapper that highlights when a piece hovers over it. */
function DropZone({
  id,
  label,
  count,
  empty,
  emptyHint,
  children,
}: {
  id: Zone
  label: string
  count: number
  empty: boolean
  emptyHint: string
  children: React.ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <Box>
      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        {label} · {count}
      </Typography>
      <Box
        ref={setNodeRef}
        sx={{
          borderRadius: 3,
          p: 1.5,
          minHeight: 132,
          border: (t) =>
            `1.5px dashed ${isOver ? t.palette.primary.main : t.palette.divider}`,
          bgcolor: (t) =>
            isOver
              ? t.palette.mode === 'light'
                ? 'rgba(0,0,0,0.02)'
                : 'rgba(255,255,255,0.04)'
              : 'transparent',
          transition: 'border-color .18s, background-color .18s',
        }}
      >
        {empty ? (
          <Box
            sx={{
              minHeight: 100,
              display: 'grid',
              placeItems: 'center',
              textAlign: 'center',
              color: 'text.secondary',
              fontSize: 14,
            }}
          >
            {emptyHint}
          </Box>
        ) : (
          <Box sx={gridSx}>{children}</Box>
        )}
      </Box>
    </Box>
  )
}

export function OutfitBuilder({ pieceIds, setPieceIds, allGarments }: OutfitBuilderProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const byId = useMemo(() => {
    const map = new Map<string, Garment>()
    allGarments.forEach((g) => map.set(g.id, g))
    return map
  }, [allGarments])

  // Both lists are derived from pieceIds — the single source of truth.
  const activePieces = useMemo(
    () => pieceIds.map((id) => byId.get(id)).filter((g): g is Garment => Boolean(g)),
    [pieceIds, byId],
  )
  const wardrobePieces = useMemo(
    () => allGarments.filter((g) => !pieceIds.includes(g.id)),
    [allGarments, pieceIds],
  )

  const activeIds = activePieces.map((g) => g.id)
  const wardrobeIds = wardrobePieces.map((g) => g.id)

  const sensors = useSensors(
    // Mouse: start dragging after a small move. Touch: require a short hold so a
    // quick swipe scrolls the page instead of grabbing a tile.
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 220, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const zoneOf = (id: string): Zone | undefined => {
    if (id === 'active' || id === 'wardrobe') return id
    if (pieceIds.includes(id)) return 'active'
    if (byId.has(id)) return 'wardrobe'
    return undefined
  }

  const addPiece = (id: string) =>
    setPieceIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  const removePiece = (id: string) => setPieceIds((prev) => prev.filter((x) => x !== id))

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }

  // Cross-container moves happen live while dragging so the piece visibly
  // jumps between zones and the overlay tracks the pointer.
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return
    const activeKey = String(active.id)
    const overKey = String(over.id)

    const from = zoneOf(activeKey)
    const to = zoneOf(overKey)
    if (!from || !to || from === to) return

    if (from === 'wardrobe' && to === 'active') {
      setPieceIds((prev) => {
        if (prev.includes(activeKey)) return prev
        const overIndex = prev.indexOf(overKey)
        const insertAt = overIndex >= 0 ? overIndex : prev.length
        const next = [...prev]
        next.splice(insertAt, 0, activeKey)
        return next
      })
    } else if (from === 'active' && to === 'wardrobe') {
      setPieceIds((prev) => prev.filter((x) => x !== activeKey))
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const activeKey = String(active.id)
    const overKey = String(over.id)

    // Only reordering within the active zone is persisted.
    if (zoneOf(activeKey) === 'active' && zoneOf(overKey) === 'active' && activeKey !== overKey) {
      setPieceIds((prev) => {
        const fromIndex = prev.indexOf(activeKey)
        const toIndex = overKey === 'active' ? prev.length - 1 : prev.indexOf(overKey)
        if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return prev
        return arrayMove(prev, fromIndex, toIndex)
      })
    }
  }

  const activeGarment = activeId ? byId.get(activeId) : undefined

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <SortableContext items={activeIds} strategy={rectSortingStrategy}>
          <DropZone
            id="active"
            label="In this outfit"
            count={activePieces.length}
            empty={activePieces.length === 0}
            emptyHint="Drag pieces here to build your outfit"
          >
            {activePieces.map((g) => (
              <SortableGarment
                key={g.id}
                garment={g}
                zone="active"
                onRemove={removePiece}
                onAdd={addPiece}
              />
            ))}
          </DropZone>
        </SortableContext>

        <SortableContext items={wardrobeIds} strategy={rectSortingStrategy}>
          <DropZone
            id="wardrobe"
            label="Your wardrobe"
            count={wardrobePieces.length}
            empty={wardrobePieces.length === 0}
            emptyHint="Every piece is already in this outfit"
          >
            {wardrobePieces.map((g) => (
              <SortableGarment
                key={g.id}
                garment={g}
                zone="wardrobe"
                onRemove={removePiece}
                onAdd={addPiece}
              />
            ))}
          </DropZone>
        </SortableContext>
      </Box>

      <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(.18,.67,.6,1.22)' }}>
        {activeGarment ? (
          <Box
            sx={{
              cursor: 'grabbing',
              filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.28))',
              transform: 'scale(1.04)',
            }}
          >
            <GarmentVisual garment={activeGarment} ratio="3 / 4" radius={12} showSwatches={false} />
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
