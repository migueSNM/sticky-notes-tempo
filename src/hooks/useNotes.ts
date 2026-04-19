import { useState } from 'react'
import { Note } from '../types'

const DEFAULT_WIDTH = 200
const DEFAULT_HEIGHT = 160
const DEFAULT_COLOR = '#fef08a'

function generateId(): string {
  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])

  function createNote(x: number, y: number, color: string = DEFAULT_COLOR): Note {
    const note: Note = {
      id: generateId(),
      x,
      y,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      content: '',
      color,
      zIndex: notes.length + 1,
    }
    setNotes(prev => [...prev, note])
    return note
  }

  function updateNote(id: string, changes: Partial<Note>) {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, ...changes } : n))
    )
  }

  function removeNote(id: string) {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  function bringToFront(id: string) {
    setNotes(prev => {
      const maxZ = Math.max(0, ...prev.map(n => n.zIndex))
      return prev.map(n => (n.id === id ? { ...n, zIndex: maxZ + 1 } : n))
    })
  }

  return { notes, createNote, updateNote, removeNote, bringToFront }
}
