import { useState, useEffect } from 'react'
import type { Note } from '../types'
import { DEFAULT_NOTE_COLOR } from '../constants'

const DEFAULT_WIDTH = 200
const DEFAULT_HEIGHT = 160
const STORAGE_KEY = 'sticky-notes-tempo'

function generateId(): string {
  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function loadFromStorage(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Note[]
  } catch {
    return []
  }
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(loadFromStorage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  }, [notes])

  function createNote(x: number, y: number, color: string = DEFAULT_NOTE_COLOR): Note {
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
