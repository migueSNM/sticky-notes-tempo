import './Toolbar.css'
import { NOTE_COLORS } from '../constants'

interface ToolbarProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  onAddNote: () => void;
}

export function Toolbar({ selectedColor, onAddNote, onColorChange }: ToolbarProps) {
  return (
    <div className="toolbar">
      <button
        className="toolbar__add"
        onClick={onAddNote}
        title="New note (or double-click the board)"
        style={{ '--preview-color': selectedColor } as React.CSSProperties}
      >
        +
        <span className="toolbar__add-preview" />
      </button>
      <div className="toolbar__divider" />
      <div className="toolbar__colors" role="radiogroup" aria-label="Note color">
        {NOTE_COLORS.map(c => (
          <button
            key={c.value}
            role="radio"
            aria-checked={selectedColor === c.value}
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
