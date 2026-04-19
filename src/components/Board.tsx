import React from 'react'
import './Board.css'

interface BoardProps {
  children: React.ReactNode;
  onDoubleClick?: (x: number, y: number) => void;
}

export function Board({ children, onDoubleClick }: BoardProps) {
  function handleDoubleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget) return
    onDoubleClick?.(e.clientX - 100, e.clientY - 80)
  }

  return (
    <div className="board" onDoubleClick={handleDoubleClick}>
      {children}
    </div>
  )
}
