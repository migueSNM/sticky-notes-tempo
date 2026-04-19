import { useState } from 'react'
import { Board } from './components/Board'
import { Note } from './components/Note'
import { Toolbar } from './components/Toolbar'
import { useNotes } from './hooks/useNotes'
import { useDrag } from './hooks/useDrag'
import './App.css'

function App() {
  const { notes, createNote, updateNote } = useNotes()
  const [selectedColor, setSelectedColor] = useState('#fef08a')

  const { startMove } = useDrag({
    onMove: (id, x, y) => updateNote(id, { x, y }),
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
            onStartMove={startMove}
          />
        ))}
      </Board>
      <Toolbar
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        onAddNote={handleAddNote}
      />
    </div>
  )
}

export default App
