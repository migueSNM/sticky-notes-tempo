import { useRef, useState } from 'react'
import { Board } from './components/Board'
import { Note } from './components/Note'
import { Toolbar } from './components/Toolbar'
import { TrashZone } from './components/TrashZone'
import { useNotes } from './hooks/useNotes'
import { useDrag } from './hooks/useDrag'
import './App.css'

function App() {
  const { notes, createNote, updateNote, removeNote } = useNotes()
  const [selectedColor, setSelectedColor] = useState('#fef08a')
  const trashRef = useRef<HTMLDivElement>(null)

  const { startMove, startResize, draggingNoteId, isOverTrash } = useDrag({
    onMove: (id, x, y) => updateNote(id, { x, y }),
    onResize: (id, width, height) => updateNote(id, { width, height }),
    onRemove: removeNote,
    trashRef,
  })

  function handleBoardDoubleClick(x: number, y: number) {
    createNote(x, y, selectedColor)
  }

  function handleAddNote() {
    const x = Math.max(20, window.innerWidth / 2 - 100)
    const y = Math.max(20, window.innerHeight / 2 - 80)
    createNote(x, y, selectedColor)
  }

  return (
    <div className="app">
      <Board onDoubleClick={handleBoardDoubleClick}>
        {notes.map(note => (
          <Note
            key={note.id}
            note={note}
            isDragging={draggingNoteId === note.id}
            onStartMove={startMove}
            onStartResize={startResize}
          />
        ))}
      </Board>
      <Toolbar
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        onAddNote={handleAddNote}
      />
      <TrashZone trashRef={trashRef} isActive={isOverTrash} />
    </div>
  )
}

export default App
