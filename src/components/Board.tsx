import './Board.css'

interface BoardProps {
  children: React.ReactNode;
}

export function Board({ children }: BoardProps) {
  return (
    <div className="board">
      {children}
    </div>
  )
}
