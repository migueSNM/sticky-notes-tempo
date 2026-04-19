import { useState } from 'react'
import { Board } from './components/Board'
import { Note } from './components/Note'
import { Toolbar } from './components/Toolbar'
import { useNotes } from './hooks/useNotes'
import './App.css'

function App() {
  const { notes, createNote } = useNotes()
  const [selectedColor, setSelectedColor] = useState('#fef08a')

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
          <Note key={note.id} note={note} />
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
