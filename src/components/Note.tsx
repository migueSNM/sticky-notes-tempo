import React from 'react'
import './Note.css'
import { Note as NoteType } from '../types'

interface NoteProps {
  note: NoteType;
  onStartMove: (noteId: string, e: React.MouseEvent) => void;
}

export function Note({ note, onStartMove }: NoteProps) {
  const { x, y, width, height, color, zIndex } = note

  return (
    <div
      className="note"
      style={{ left: x, top: y, width, height, background: color, zIndex }}
    >
      <div
        className="note__header"
        onMouseDown={e => onStartMove(note.id, e)}
      >
        <span className="note__dots">
          <span /><span /><span />
        </span>
      </div>
      <div className="note__body">
        <span className="note__content">{note.content || ''}</span>
      </div>
    </div>
  )
}
