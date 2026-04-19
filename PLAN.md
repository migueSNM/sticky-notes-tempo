# Implementation Plan

This document captures the upfront plan that was designed before writing any code.

---

## Context

Build a sticky-notes SPA considering UI design, architecture, and TypeScript/React skills. The app must be built with Vite + React + TypeScript, no stock component libraries, pushed to GitHub with one commit per feature. All 4 core features + all 4 bonus features were planned from the start.

---

## Architecture Overview

### File Structure
```
sticky-notes-tempo/
├── src/
│   ├── types.ts               # Note + DragState interfaces
│   ├── constants.ts           # note colors, default values
│   ├── hooks/
│   │   ├── useNotes.ts        # notes state + localStorage persistence
│   │   └── useDrag.ts         # drag lifecycle (move & resize)
│   ├── components/
│   │   ├── Board.tsx          # full-screen canvas, double-click to create
│   │   ├── Note.tsx           # individual note (drag, resize, edit, color, z-index)
│   │   ├── TrashZone.tsx      # fixed drop target at bottom-right
│   │   └── Toolbar.tsx        # color palette + "New Note" button
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Key Types (`src/types.ts`)
```ts
export interface Note {
  id: string;
  x: number; y: number;
  width: number; height: number;
  content: string;
  color: string;   // hex, one of 6 preset colors
  zIndex: number;
}

export type DragMode = 'move' | 'resize';

export interface DragState {
  noteId: string;
  mode: DragMode;
  startMouseX: number; startMouseY: number;
  startNoteX: number;  startNoteY: number;
  startWidth: number;  startHeight: number;
}
```

### State Management (`src/hooks/useNotes.ts`)
- `useState<Note[]>` initialized from `localStorage`
- Exposes: `notes`, `createNote(x, y, color)`, `updateNote(id, partial)`, `removeNote(id)`, `bringToFront(id)`
- `useEffect` saves to `localStorage` on every change

### Drag System (`src/hooks/useDrag.ts`)
- Uses `useRef<DragState | null>` (no re-renders during drag for performance)
- Attaches `mousemove` + `mouseup` to `document` when drag starts, removes on end
- Returns: `{ startMove(noteId, e), startResize(noteId, e), draggingNoteId, isOverTrash }`
- On `mouseup`: checks if cursor is over TrashZone ref → calls `removeNote` if so

### Component Responsibilities

**`Board.tsx`**
- Full-screen div, `overflow: hidden`
- `onDoubleClick` → creates note at `(e.clientX - 100, e.clientY - 80)` (centered on cursor)
- Renders all `<Note>` components

**`Note.tsx`**
- Absolutely positioned via `{ left: x, top: y, width, height, zIndex, background: color }`
- Header bar: `onMouseDown` → `startMove`
- Body: `<textarea>` for text editing (transparent bg, no border, resize none)
- Bottom-right corner: 16×16 resize handle `onMouseDown` → `startResize`
- `onMouseDown` on any part → `bringToFront`

**`TrashZone.tsx`**
- Fixed bottom-right, circular drop target with trash SVG icon
- Receives a `ref` so `useDrag` can call `getBoundingClientRect()` to detect drop
- Highlights (scale + red border) when a note is being dragged over it

**`Toolbar.tsx`**
- Fixed top-left panel
- 6 color swatches (yellow, pink, blue, green, orange, lavender)
- "+" button → creates note at board center with selected color
- Preview dot on "+" button shows the currently selected color

---

## Commit Plan

| # | Commit message | What it adds |
|---|----------------|--------------|
| 1 | `chore: init Vite + React + TypeScript project` | Vite scaffold, tsconfig, CSS reset |
| 2 | `feat: add note data model and board layout` | `types.ts`, Board shell, App layout |
| 3 | `feat: create note at position on double-click` | `useNotes.ts` (create), Toolbar "+" button |
| 4 | `feat: move notes by dragging the header` | `useDrag.ts` (move), Note header drag |
| 5 | `feat: resize notes by dragging the corner handle` | useDrag resize, Note resize handle + CSS |
| 6 | `feat: delete notes by dragging them to the trash zone` | `TrashZone.tsx`, drop detection in `useDrag` |
| 7 | `feat: edit note text with an inline textarea` | `<textarea>` in Note body |
| 8 | `feat: bring note to front on mouse interaction` | `bringToFront` in `useNotes`, mousedown on Note |
| 9 | `feat: persist notes to localStorage and restore on page load` | `useEffect` + `loadFromStorage` in `useNotes` |
| 10 | `feat: add color selection palette for sticky notes` | `constants.ts`, Toolbar palette, preview dot |

---

## Implementation Notes

- **No stock components or icon libraries** — trash icon via inline SVG, no MUI/shadcn/etc.
- **CSS**: Plain CSS files per component (no CSS-in-JS, no Tailwind) — keeps it readable.
- **Drag**: Attach `mousemove`/`mouseup` to `document` (not the note element) to handle fast cursor movement outside the note.
- **Drag state in a ref**: `useRef` instead of `useState` for the active drag snapshot avoids triggering re-renders on every `mousemove`.
- **Resize constraints**: min `width: 120px`, min `height: 80px`.
- **z-index**: `bringToFront` sets `zIndex = max(all notes zIndex) + 1`.
- **Default note size**: 200×160px.
- **Colors**: `['#fef08a', '#f9a8d4', '#93c5fd', '#86efac', '#fdba74', '#c4b5fd']`

---

## Verification Checklist

1. `npm run dev` — app opens at `http://localhost:5173`
2. Double-click board → note appears centered on cursor
3. Drag note header → repositions smoothly
4. Drag bottom-right handle → resizes (respects minimum size)
5. Drag note over trash zone → note disappears, trash highlights red
6. Click note body → textarea focuses, typing works
7. Click a note behind another → it comes to front
8. Reload page → all notes are restored from localStorage
9. Select a color swatch, create a note → note has that color
10. `npm run build` → no TypeScript errors, `dist/` produced
