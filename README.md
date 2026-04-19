# sticky-notes-tempo

A sticky notes single-page application built from scratch with React and TypeScript — no component libraries, no UI frameworks.

## Features

**Core**
- Create a note at any position by double-clicking the board, or using the **+** button in the toolbar
- Move notes by dragging the header bar
- Resize notes by dragging the bottom-right handle
- Delete notes by dragging them over the trash zone (bottom-right corner)

**Bonus**
- Edit note text by clicking the note body and typing
- Click any note to bring it to the front when notes overlap
- Notes are saved to `localStorage` and restored on page load
- Choose from 6 note colors via the color palette in the toolbar

## Tech stack

| Layer | Choice |
|-------|--------|
| Language | TypeScript |
| Framework | React 19 |
| Build tool | Vite |
| Styling | Plain CSS (one file per component) |
| State | `useState` (no external store) |
| Persistence | `localStorage` |
| Icons | Inline SVG (no icon library) |

## Running the app

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:5173)
npm run dev

# Type-check + production build
npm run build
```

Requires Node 18+. Supported browsers: Chrome, Firefox, Edge (latest versions).

---

## Architecture

The application is structured around three layers: the **component tree**, the **state + persistence layer**, and the **drag system**. `App.tsx` is the root orchestrator — it owns all shared state and passes callbacks down. Below it sits `Board` (the full-screen canvas), which renders the list of `Note` components, along with a fixed-position `Toolbar` (color palette and add button) and a `TrashZone` (drop target in the corner). Each `Note` is an absolutely-positioned `div` whose geometry (`x`, `y`, `width`, `height`) and appearance (`color`, `zIndex`) come directly from a plain TypeScript `Note` interface, so the render is a pure function of data — no hidden DOM state.

State is managed by the `useNotes` custom hook, which wraps a single `useState<Note[]>` array. Every mutation (`createNote`, `updateNote`, `removeNote`, `bringToFront`) produces a new array via immutable updates, keeping React's reconciler fast. A paired `useEffect` serializes the array to `localStorage` on every change and deserializes it on first render, giving transparent persistence with no extra library.

Drag-and-drop is handled by `useDrag`, which intentionally avoids the native HTML5 drag API (which is awkward to style and can lose track of fast cursor movement). Instead, on `mousedown` it records the drag intent in a `useRef` (not `useState`, so no re-render mid-drag) and attaches `mousemove`/`mouseup` listeners directly to `document`. This means the pointer can leave the note at any speed and the drag still tracks correctly. On `mouseup`, the hook checks whether the cursor is inside the `TrashZone` element's bounding rect and, if so, calls `removeNote` — turning the trash into a simple spatial predicate rather than a drag-and-drop framework concern.

---

## Project structure

```
src/
├── types.ts                  # Note + DragState interfaces
├── constants.ts              # note colors, default values
├── hooks/
│   ├── useNotes.ts           # notes state + localStorage persistence
│   └── useDrag.ts            # drag lifecycle (move & resize)
├── components/
│   ├── Board.tsx / .css      # full-screen canvas, double-click to create
│   ├── Note.tsx / .css       # individual note with all interactions
│   ├── TrashZone.tsx / .css  # drop target for deletion
│   └── Toolbar.tsx / .css    # color palette + add button
├── App.tsx / .css
└── main.tsx
```
