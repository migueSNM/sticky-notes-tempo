import { useRef, useCallback, useState } from 'react'
import { DragState } from '../types'

interface UseDragOptions {
  onMove: (id: string, x: number, y: number) => void;
}

export function useDrag({ onMove }: UseDragOptions) {
  const dragRef = useRef<DragState | null>(null)
  const [draggingNoteId, setDraggingNoteId] = useState<string | null>(null)

  const startMove = useCallback((noteId: string, e: React.MouseEvent) => {
    e.preventDefault()
    const target = e.currentTarget as HTMLElement
    const noteEl = target.closest('.note') as HTMLElement
    if (!noteEl) return

    dragRef.current = {
      noteId,
      mode: 'move',
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startNoteX: parseInt(noteEl.style.left, 10) || 0,
      startNoteY: parseInt(noteEl.style.top, 10) || 0,
      startWidth: noteEl.offsetWidth,
      startHeight: noteEl.offsetHeight,
    }
    setDraggingNoteId(noteId)

    function onMouseMove(ev: MouseEvent) {
      if (!dragRef.current || dragRef.current.mode !== 'move') return
      const { startMouseX, startMouseY, startNoteX, startNoteY } = dragRef.current
      const dx = ev.clientX - startMouseX
      const dy = ev.clientY - startMouseY
      onMove(noteId, startNoteX + dx, startNoteY + dy)
    }

    function onMouseUp() {
      dragRef.current = null
      setDraggingNoteId(null)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [onMove])

  return { startMove, draggingNoteId }
}
