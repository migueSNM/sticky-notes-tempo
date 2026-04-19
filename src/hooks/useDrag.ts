import { useRef, useCallback, useState } from 'react'
import { DragState } from '../types'

const MIN_WIDTH = 120
const MIN_HEIGHT = 80

interface UseDragOptions {
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
}

export function useDrag({ onMove, onResize }: UseDragOptions) {
  const dragRef = useRef<DragState | null>(null)
  const [draggingNoteId, setDraggingNoteId] = useState<string | null>(null)

  const startMove = useCallback((noteId: string, e: React.MouseEvent) => {
    e.preventDefault()
    const noteEl = (e.currentTarget as HTMLElement).closest('.note') as HTMLElement
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
      const state = dragRef.current
      if (!state || state.mode !== 'move') return
      const dx = ev.clientX - state.startMouseX
      const dy = ev.clientY - state.startMouseY
      onMove(noteId, state.startNoteX + dx, state.startNoteY + dy)
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

  const startResize = useCallback((noteId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const noteEl = (e.currentTarget as HTMLElement).closest('.note') as HTMLElement
    if (!noteEl) return

    dragRef.current = {
      noteId,
      mode: 'resize',
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startNoteX: parseInt(noteEl.style.left, 10) || 0,
      startNoteY: parseInt(noteEl.style.top, 10) || 0,
      startWidth: noteEl.offsetWidth,
      startHeight: noteEl.offsetHeight,
    }
    setDraggingNoteId(noteId)

    function onMouseMove(ev: MouseEvent) {
      const state = dragRef.current
      if (!state || state.mode !== 'resize') return
      const newWidth = Math.max(MIN_WIDTH, state.startWidth + ev.clientX - state.startMouseX)
      const newHeight = Math.max(MIN_HEIGHT, state.startHeight + ev.clientY - state.startMouseY)
      onResize(noteId, newWidth, newHeight)
    }

    function onMouseUp() {
      dragRef.current = null
      setDraggingNoteId(null)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [onResize])

  return { startMove, startResize, draggingNoteId }
}
