export interface Note {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  color: string;
  zIndex: number;
}

export type DragMode = 'move' | 'resize';

export interface DragState {
  noteId: string;
  mode: DragMode;
  startMouseX: number;
  startMouseY: number;
  startNoteX: number;
  startNoteY: number;
  startWidth: number;
  startHeight: number;
}
