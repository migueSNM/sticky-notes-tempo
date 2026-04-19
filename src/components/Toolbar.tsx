import './Toolbar.css'

interface ToolbarProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  onAddNote: () => void;
}

const COLORS = [
  { value: '#fef08a', label: 'Yellow' },
  { value: '#f9a8d4', label: 'Pink' },
  { value: '#93c5fd', label: 'Blue' },
  { value: '#86efac', label: 'Green' },
  { value: '#fdba74', label: 'Orange' },
  { value: '#c4b5fd', label: 'Lavender' },
]

export function Toolbar({ selectedColor, onColorChange, onAddNote }: ToolbarProps) {
  return (
    <div className="toolbar">
      <button className="toolbar__add" onClick={onAddNote} title="New note (or double-click the board)">
        +
      </button>
      <div className="toolbar__divider" />
      <div className="toolbar__colors">
        {COLORS.map(c => (
          <button
            key={c.value}
            className={`toolbar__swatch${selectedColor === c.value ? ' toolbar__swatch--active' : ''}`}
            style={{ backgroundColor: c.value }}
            title={c.label}
            onClick={() => onColorChange(c.value)}
          />
        ))}
      </div>
    </div>
  )
}
