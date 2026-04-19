import React from 'react'
import './Note.css'
import { Note as NoteType } from '../types'

interface NoteProps {
  note: NoteType;
  isDragging: boolean;
  onStartMove: (noteId: string, e: React.MouseEvent) => void;
  onStartResize: (noteId: string, e: React.MouseEvent) => void;
  onContentChange: (noteId: string, content: string) => void;
  onBringToFront: (noteId: string) => void;
}

export function Note({ note, isDragging, onStartMove, onStartResize, onContentChange, onBringToFront }: NoteProps) {
  const { x, y, width, height, color, zIndex } = note

  return (
    <div
      className={`note${isDragging ? ' note--dragging' : ''}`}
      style={{ left: x, top: y, width, height, background: color, zIndex }}
      onMouseDown={() => onBringToFront(note.id)}
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
        <textarea
          className="note__textarea"
          value={note.content}
          placeholder="Type something..."
          onChange={e => onContentChange(note.id, e.target.value)}
          onMouseDown={e => e.stopPropagation()}
        />
      </div>
      <div
        className="note__resize-handle"
        onMouseDown={e => onStartResize(note.id, e)}
      />
    </div>
  )
}
